// Procesamiento equánime del batch de fotos, días después del evento.
// Reparte el trabajo por RONDAS entre invitados (1ª foto de cada uno,
// luego la 2ª de cada uno...) en vez de agotar primero al invitado
// que subió más fotos.

// El ID de la carpeta "EVENTOS" (ID_CARPETA_EVENTOS) ahora se define una
// única vez en comun.gs, para no tenerlo duplicado en varios archivos.
const LIMITE_POR_EJECUCION = 30; // ajusta según cuota Gemini / tiempo de script (máx 6 min)

/**
 * Recorre TODOS los eventos de ALBUM_B_EVENTOS y procesa las fotos
 * pendientes de cada uno, respetando el límite de 6 minutos de
 * ejecución de Apps Script (se deja margen y se corta antes de llegar).
 *
 * Ponla en un trigger de tiempo (cada 15-30 min, ver instrucciones)
 * para que el procesamiento sea continuo mientras el evento está en
 * marcha, sin tener que esperar a que acabe el plazo de subida ni
 * llamar a mano a procesarBatchEquanime para cada código.
 */
function procesarTodosLosEventosPendientes() {
  const lock = LockService.getScriptLock();
  
  // Intentar obtener bloqueo por 10 segundos
  try {
    lock.waitLock(10000); 
  } catch (e) {
    Logger.log("Otra ejecución está procesando las fotos, esperamos al siguiente trigger.");
    return; // Salimos si ya hay alguien trabajando
  }
  const TIEMPO_MAXIMO_MS = 5 * 60 * 1000; // margen de 1 min sobre el límite real de 6
  const inicio = Date.now();

  
// 1. Recuperamos el ID guardado en las propiedades del script
  const scriptProperties = PropertiesService.getScriptProperties();
  const idHojaObrador = scriptProperties.getProperty("ID_SHEET"); // O el nombre de propiedad que uses para la hoja
  
  if (!idHojaObrador) {
    console.error("❌ ERROR: No se encontró la propiedad con el ID en la configuración.");
    return;
  }

  // 2. Abrimos la hoja de cálculo de forma segura por su ID (evita el error de 'ActiveSpreadsheet')
  const ss = SpreadsheetApp.openById(idHojaObrador);
  const hoja = ss.getActiveSheet(); // O usa ss.getSheetByName("NombreDePestaña")
  if (!hoja) throw new Error('No se encontró la hoja "' + NOMBRE_HOJA_EVENTOS + '"');



  const cab = obtenerMapaCabeceras(hoja);
  const colCodigo = cab["CODIGO EVENTO"];
  if (colCodigo === undefined) throw new Error('Falta la columna "Código Evento"');

  const datos = hoja.getDataRange().getValues();

  for (let i = 1; i < datos.length; i++) {
    if (Date.now() - inicio > TIEMPO_MAXIMO_MS) {
      Logger.log("Tiempo casi agotado, se sigue en la próxima ejecución del trigger.");
      break;
    }

    const codigo = String(datos[i][colCodigo] || "").trim();
    if (!codigo) continue;

    try {
      let resultado;
      do {
        if (Date.now() - inicio > TIEMPO_MAXIMO_MS) break;
        resultado = procesarBatchEquanime(codigo);
        Logger.log(codigo + " → procesadas: " + resultado.procesadas + ", quedan: " + resultado.restantes);
      } while (resultado.restantes > 0 && resultado.procesadas > 0);
      // Si procesadas===0 y restantes>0, algo falla de forma persistente
      // (ej. cuota de Gemini agotada) -> pasamos al siguiente evento en
      // vez de quedarnos atascados en bucle.
    } catch (err) {
      Logger.log("Error procesando evento " + codigo + ": " + err.message);
      // seguimos con el resto de eventos aunque uno falle
    }
  }
  lock.releaseLock();
}

/**
 * Procesa el lote pendiente de una boda concreta.
 * Lanza esta función manualmente o con un trigger de tiempo, y vuelve
 * a llamarla hasta que ya no queden fotos en RAW_INVITADOS.
 */
function procesarBatchEquanime(codigoEvento) {
  const evento = buscarEventoPorCodigo(codigoEvento);
  if (!evento.encontrado) throw new Error("Código de evento no encontrado: " + codigoEvento);

  // El código ya incluye el prefijo (lo genera generarCodigoEvento como
  // "PREFIJO_AZAR"), así que NO hay que volver a anteponer evento.prefijo.
  const nombreCarpetaEvento = codigoEvento.toUpperCase();
  const carpetaEventos = DriveApp.getFolderById(ID_CARPETA_EVENTOS);

  const carpetasBoda = carpetaEventos.getFoldersByName(nombreCarpetaEvento);
  if (!carpetasBoda.hasNext()) throw new Error("No se encontró la carpeta " + nombreCarpetaEvento);
  const carpetaBoda = carpetasBoda.next();

  const carpetasRaw = carpetaBoda.getFoldersByName("01_RAW_INVITADOS");
  if (!carpetasRaw.hasNext()) throw new Error("No se encontró RAW_INVITADOS en " + nombreCarpetaEvento);
  const carpetaRaw = carpetasRaw.next();

  // Carpeta de salida para las fotos ya editadas
  let carpetaEditadas;
  const carpetasEditadas = carpetaBoda.getFoldersByName("03_EDITADAS");
  if (carpetasEditadas.hasNext()) {
    carpetaEditadas = carpetasEditadas.next();
  } else {
    carpetaEditadas = carpetaBoda.createFolder("03_EDITADAS");
  }

  // 1. Listar todos los archivos pendientes y extraer sessionId + timestamp
  const archivos = [];
  const it = carpetaRaw.getFiles();
  while (it.hasNext()) {
    const file = it.next();
    const nombre = file.getName(); // FOTO_<timestamp>_<sessionId>.jpg
    const match = nombre.match(/^FOTO_(\d+)_(.+)\.jpg$/i);
    const sessionId = match ? match[2] : "SIN_SESION";
    const timestamp = match ? Number(match[1]) : file.getDateCreated().getTime();
    archivos.push({ file, sessionId, timestamp });
  }

  if (archivos.length === 0) {
    Logger.log("No quedan fotos pendientes en 01_RAW_INVITADOS para " + nombreCarpetaEvento);
    // Puede que ya se hubiera marcado en una ejecución anterior; escribirlo
    // de nuevo es inofensivo (idempotente) y cubre el caso de que el evento
    // nunca haya tenido fotos que procesar.
    entregarAlbumAlCliente(codigoEvento); // comparte EDITADAS, guarda el enlace y avisa al cliente (idempotente)
    return { procesadas: 0, restantes: 0 };
  }

  // 2. Calcular el "número de orden" de cada foto dentro de su propia sesión/invitado
  const porSesion = {};
  archivos.forEach(a => {
    if (!porSesion[a.sessionId]) porSesion[a.sessionId] = [];
    porSesion[a.sessionId].push(a);
  });
  Object.values(porSesion).forEach(lista => {
    lista.sort((x, y) => x.timestamp - y.timestamp);
    lista.forEach((a, idx) => { a.orden = idx + 1; }); // 1ª foto, 2ª foto...
  });

  // 3. Ordenar TODO por rondas: primero todas las "orden 1", luego "orden 2"...
  archivos.sort((a, b) => {
    if (a.orden !== b.orden) return a.orden - b.orden;
    if (a.sessionId !== b.sessionId) return a.sessionId.localeCompare(b.sessionId);
    return a.timestamp - b.timestamp;
  });

  // 4. Procesar solo hasta el límite de esta ejecución
  const lote = archivos.slice(0, LIMITE_POR_EJECUCION);
  const estiloPrompt = obtenerEstiloBoda(codigoEvento); // se lee una vez por lote, no por foto
  let procesadas = 0;

  lote.forEach(item => {
  try {
    // 1. Mover preventivamente antes de procesar para evitar duplicados
    const carpetaProcesadas = getOrCrearCarpetaProcesadas(carpetaBoda);
    item.file.moveTo(carpetaProcesadas); 
    
    // 2. Ahora procesamos la que ya está en la carpeta de destino
    // Ajusta la referencia del archivo al nuevo destino:
    const fileProcesado = carpetaProcesadas.getFilesByName(item.file.getName()).next();
    
    const resultadoBlob = procesarFotoConVertexAI(fileProcesado, estiloPrompt);
    carpetaEditadas.createFile(resultadoBlob.setName("EDIT_" + item.file.getName()));
    procesadas++;
  } catch (e) {
    Logger.log("Error en el lote: " + e.message);
  }
});

  const restantes = archivos.length - procesadas;
  Logger.log("Evento " + nombreCarpetaEvento + ": procesadas " + procesadas + ", quedan " + restantes + " pendientes, invitados en este lote: " + new Set(lote.map(a => a.sessionId)).size);

  // Si esta ejecución ha agotado la cola de pendientes, marcamos el evento
  // como listo. Si quedan fotos (por límite de ejecución o por errores que
  // se reintentarán), NO tocamos el estado: se actualizará en una ejecución
  // posterior cuando de verdad no quede nada pendiente.
  if (restantes === 0) {
    entregarAlbumAlCliente(codigoEvento); // comparte EDITADAS, guarda el enlace y avisa al cliente (idempotente)
  }

  return { procesadas: procesadas, restantes: restantes };
}

function getOrCrearCarpetaProcesadas(carpetaBoda) {
  const existentes = carpetaBoda.getFoldersByName("02_RAW_PROCESADAS");
  if (existentes.hasNext()) return existentes.next();
  return carpetaBoda.createFolder("02_RAW_PROCESADAS");
}





function probarProcesamientoCompleto() {
  const resultado = procesarBatchEquanime("EVENTOS_329B196E");
  Logger.log(resultado);
}


function descubrirCabeceraFaltante() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getSheetByName("ALBUM_B_EVENTOS");
  
  if (!hoja) {
    Logger.log("❌ No se encontró la hoja ALBUM_B_EVENTOS");
    return;
  }

  // Usamos tu función de comun.gs para ver cómo las está leyendo
  const cab = obtenerMapaCabeceras(hoja);
  
  Logger.log("🔍 COMPROBANDO COLUMNAS EN TU HOJA...");
  Logger.log("ESTADO SERVICIO: " + (cab["ESTADO SERVICIO"] !== undefined ? "✅ OK" : "❌ FALTA (Debe llamarse 'Estado Servicio')"));
  Logger.log("CODIGO EVENTO: " + (cab["CODIGO EVENTO"] !== undefined ? "✅ OK" : "❌ FALTA (Debe llamarse 'Código Evento')"));
  Logger.log("EMAIL ADDRESS: " + (cab["EMAIL ADDRESS"] !== undefined ? "✅ OK" : "❌ FALTA (Debe llamarse 'Email address')"));
  Logger.log("ENLACE ALBUM: " + (cab["ENLACE ALBUM"] !== undefined ? "✅ OK" : "❌ FALTA (Debe llamarse 'Enlace Álbum')"));
  
  const claveNombre = Object.keys(cab).find(k => k.indexOf("NOMBRE Y APELLIDOS") === 0);
  Logger.log("NOMBRE Y APELLIDOS: " + (claveNombre !== undefined ? "✅ OK" : "❌ FALTA (Debe empezar por 'Nombre y apellidos')"));
  
  Logger.log("\nCabeceras que el script está leyendo realmente de tu fila 1:");
  Logger.log(Object.keys(cab).join(" | "));
}

