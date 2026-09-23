// Funciones compartidas por subida.gs, gemini.gs y procesamientoBatch.gs
// Centralizadas aquí para no repetir la búsqueda de columnas en cada archivo
// (que es justo lo que causó bugs de índices desalineados en el pasado).

const NOMBRE_HOJA_EVENTOS = "ALBUM_B_EVENTOS";

// ID de la carpeta raíz de Drive donde viven todas las carpetas de eventos.
// Única fuente de verdad: subida.gs y Procesamientobatch.gs la usan desde
// aquí para no tener el mismo ID duplicado (y potencialmente desincronizado)
// en varios archivos.
const ID_CARPETA_EVENTOS = "1Yqw1h68C43aZL2LevkpIiofqeqmBITZi";

// Mapa de tipos de evento a prefijo de carpeta/código.
// Añade aquí nuevos tipos si el desplegable del formulario crece.
const PREFIJOS_TIPO_EVENTO = {
  "BODA": "BODA",
  "COMUNION": "COMUNION",
  "BAUTIZO": "BAUTIZO",
  "FIESTA": "FIESTA",
  "COMIDA EMPRESA": "COMIDA_EMPRESA",
  "COMIDA FAMILIAR": "COMIDA_FAMILIAR",
  "CONFIRMACION": "CONFIRMACION",
  "CUMPLEANOS": "CUMPLEANOS",
  "ANIVERSARIO DE BODA": "ANIVERSARIO_DE_BODA",
  "COMPROMISO": "COMPROMISO",
  "GRADUACION": "GRADUACION",
  "JUBILACION": "JUBILACION",
  "OTRO": "EVENTO" // catch-all para la opción "Other:" (texto libre) del formulario
};

/**
 * Quita acentos, signos de puntuación y pasa a mayúsculas, para comparar
 * textos de forma robusta sin depender de cómo estén escritos exactamente
 * (útil sobre todo para cabeceras de Sheets copiadas de preguntas de Forms).
 */
function normalizarTexto(str) {
  return String(str || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-zA-Z0-9\s]/g, " ") // quita signos (¿, ?, paréntesis...)
    .replace(/\s+/g, " ")
    .trim().toUpperCase();
}

/**
 * Devuelve el prefijo de carpeta/código para un tipo de evento dado.
 * Si el tipo está vacío o no se reconoce, usa "EVENTO" como comodín seguro.
 */
function prefijoParaTipo(tipoEvento) {
  const clave = normalizarTexto(tipoEvento);
  return PREFIJOS_TIPO_EVENTO[clave] || "EVENTO";
}



/**
 * Mapa nombre de cabecera -> índice de columna (0-based), case-insensitive
 * y tolerante a espacios. Evita depender de posiciones fijas.
 */
function obtenerMapaCabeceras(hoja) {
  const primeraFila = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
  const mapa = {};
  
  for (let i = 0; i < primeraFila.length; i++) {
    const textoCelda = primeraFila[i];
    if (textoCelda) {
      // Normalizamos el nombre de la columna: a mayúsculas, quitamos espacios extra y acentos
      const cabeceraNormalizada = normalizarTexto(textoCelda.toString());
      mapa[cabeceraNormalizada] = i;
      
      // Añadimos un alias automático para que reconozca el correo del formulario de Google
      if (cabeceraNormalizada.includes("CORREO") || cabeceraNormalizada.includes("MAIL")) {
        mapa["EMAIL ADDRESS"] = i;
      }
    }
  }
  return mapa;
}

/**
 * Actualiza el estado y el enlace del álbum cuando termina de procesarse,
 * contando el número de fotos editadas y guardándolo en la columna "Estado Servicio".
 */
function entregarAlbumAlCliente(codigoEvento) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getSheets().find(s => normalizarTexto(s.getName()) === normalizarTexto(NOMBRE_HOJA_EVENTOS));
  if (!hoja) throw new Error('No se encontró la hoja "' + NOMBRE_HOJA_EVENTOS + '"');

  const cab = obtenerMapaCabeceras(hoja);
  const colEstado = cab["ESTADO SERVICIO"];
  const colCodigo = cab["CODIGO EVENTO"];
  const colEnlace = cab["ENLACE ALBUM"];

  if ([colEstado, colCodigo, colEnlace].some(c => c === undefined)) {
    throw new Error(
      'Falta alguna columna requerida en ' + NOMBRE_HOJA_EVENTOS + ': ' +
      'Estado Servicio, Código Evento, Enlace Álbum.'
    );
  }

  const datos = hoja.getDataRange().getValues();
  const codigoBuscado = normalizarTexto(codigoEvento);
  let fila = -1;
  for (let i = 1; i < datos.length; i++) {
    if (normalizarTexto(datos[i][colCodigo]) === codigoBuscado) { fila = i; break; }
  }
  if (fila === -1) return false;

  const evento = buscarEventoPorCodigo(codigoEvento);
  const nombreCarpetaEvento = codigoEvento.toUpperCase();
  const carpetaEventos = DriveApp.getFolderById(ID_CARPETA_EVENTOS);
  const carpetasBoda = carpetaEventos.getFoldersByName(nombreCarpetaEvento);
  if (!carpetasBoda.hasNext()) throw new Error("No se encontró la carpeta " + nombreCarpetaEvento);
  const carpetaBoda = carpetasBoda.next();

  const carpetasEditadas = carpetaBoda.getFoldersByName("03_EDITADAS");
  if (!carpetasEditadas.hasNext()) throw new Error("No se encontró la carpeta 03_EDITADAS en " + nombreCarpetaEvento);
  const carpetaEditadas = carpetasEditadas.next();

  // Compartir la carpeta: cualquiera con el enlace puede VER (no editar).
  carpetaEditadas.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  const enlace = carpetaEditadas.getUrl();

  // Contar las fotos totales que hay dentro de la carpeta "03_EDITADAS"
  let totalFotosEditadas = 0;
  let archivosEditadas = carpetaEditadas.getFiles();
  while (archivosEditadas.hasNext()) {
    archivosEditadas.next();
    totalFotosEditadas++;
  }

  // Texto que irá en la columna de estado (Ej: "45 FOTOS LISTAS")
  const textoEstado = totalFotosEditadas + " FOTOS LISTAS";

  // getRange es 1-based (fila y columna); datos/cab son 0-based -> +1 en ambos.
  hoja.getRange(fila + 1, colEnlace + 1).setValue(enlace);
  hoja.getRange(fila + 1, colEstado + 1).setValue(textoEstado);

  Logger.log("Evento " + codigoEvento + " actualizado correctamente con " + textoEstado);
  return true;
}



/**
 * Actualiza la columna "Estado Servicio" para el evento dado, localizándola
 * por cabecera (nunca por índice fijo, para no romperse si se insertan
 * columnas nuevas en ALBUM_B_EVENTOS).
 *
 * Devuelve true si se encontró y actualizó la fila, false si el código
 * de evento no existe en la hoja (el llamador decide si eso es grave).
 */
function actualizarEstadoServicio(codigoEvento, nuevoEstado) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getSheets().find(s => normalizarTexto(s.getName()) === normalizarTexto(NOMBRE_HOJA_EVENTOS));
  if (!hoja) throw new Error('No se encontró la hoja "' + NOMBRE_HOJA_EVENTOS + '"');

  const cab = obtenerMapaCabeceras(hoja);
  const colEstado = cab["ESTADO SERVICIO"];
  const colCodigo = cab["CODIGO EVENTO"];
  if (colEstado === undefined) throw new Error('Falta la columna "Estado Servicio" en ' + NOMBRE_HOJA_EVENTOS);
  if (colCodigo === undefined) throw new Error('Falta la columna "Código Evento" en ' + NOMBRE_HOJA_EVENTOS);

  const datos = hoja.getDataRange().getValues();
  const codigoBuscado = normalizarTexto(codigoEvento);

  for (let i = 1; i < datos.length; i++) {
    if (normalizarTexto(datos[i][colCodigo]) === codigoBuscado) {
      // getRange es 1-based (fila y columna), pero el mapa de cabeceras
      // y getValues() son 0-based -> por eso el +1 en ambos.
      hoja.getRange(i + 1, colEstado + 1).setValue(nuevoEstado);
      return true;
    }
  }
  return false;
}


/**
 * Busca un evento por su código en ALBUM_B_EVENTOS.
 * Devuelve { encontrado, fila (1-based), fechaEvento, tipoEvento, prefijo, estilo, codigo }
 * o { encontrado: false } si no existe.
 *
 * IMPORTANTE: requiere que la hoja tenga las columnas "Código Evento",
 * "Fecha del evento" y "Tipo de Evento". "¿Qué estilo prefieres para tus
 * fotos?" es opcional (si está vacía, se usa un estilo por defecto según
 * el tipo de evento).
 */
function buscarEventoPorCodigo(codigo) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getSheets().find(s => normalizarTexto(s.getName()) === normalizarTexto(NOMBRE_HOJA_EVENTOS));
  if (!hoja) {
    throw new Error('No se encontró la hoja "' + NOMBRE_HOJA_EVENTOS + '"');
  }

  const cab = obtenerMapaCabeceras(hoja);
  
  // Como obtenerMapaCabeceras ahora normaliza todo, buscamos en mayúsculas limpias:
  const colCodigo = cab["CODIGO EVENTO"];
  const colFecha = cab["FECHA DEL EVENTO"] !== undefined ? cab["FECHA DEL EVENTO"] : cab["FECHA EVENTO"];
  const colTipo = cab["TIPO DE EVENTO"];
  const colEstilo = cab["QUE ESTILO PREFIERES PARA TUS FOTOS"];

  if (colCodigo === undefined) {
    throw new Error('Falta la columna "Código Evento" en ' + NOMBRE_HOJA_EVENTOS);
  }

  const datos = hoja.getDataRange().getValues();
  const codigoBuscado = normalizarTexto(codigo);

  for (let i = 1; i < datos.length; i++) {
    if (normalizarTexto(datos[i][colCodigo]) === codigoBuscado) {
      const tipoEvento = colTipo !== undefined ? datos[i][colTipo] : "";
      
      let fechaFinal = null;
      if (colFecha !== undefined && datos[i][colFecha]) {
        const fechaCelda = new Date(datos[i][colFecha]);
        if (!isNaN(fechaCelda.getTime())) {
          fechaFinal = fechaCelda.toISOString();
        }
      }

      return {
        encontrado: true,
        fila: i + 1,
        fechaEvento: fechaFinal,
        tipoEvento: tipoEvento,
        prefijo: prefijoParaTipo(tipoEvento),
        estilo: colEstilo !== undefined ? datos[i][colEstilo] : "",
        codigo: datos[i][colCodigo]
      };
    }
  }
  return { encontrado: false };
}


function verificarPlazoSubida(codigo, fechaActualMs) {
  try {
    // Usamos tu función de búsqueda global existente
    const evento = buscarEventoPorCodigo(codigo);
    if (!evento || !evento.encontrado) {
      return { abierto: false, mensaje: "Código de evento no encontrado." };
    }

    if (!evento.fechaEvento) {
      return { abierto: false, mensaje: "Este evento no tiene fecha configurada. Contacta con la organización." };
    }

    const hoy = new Date(fechaActualMs);
    const fechaEvento = new Date(evento.fechaEvento);
    
    if (isNaN(fechaEvento.getTime())) {
      return { abierto: false, mensaje: "Error: El formato de la fecha del evento en la hoja no es válido." };
    }

    // Plazo total: día del evento + 1 día más (2 días naturales en total)
    const fechaLimite = new Date(fechaEvento.getTime() + (1 * 24 * 60 * 60 * 1000));
    
    // Configuramos los límites horarios de forma estricta
    const inicioEvento = new Date(fechaEvento.getTime());
    inicioEvento.setHours(0, 0, 0, 0);
    
    const finLimite = new Date(fechaLimite.getTime());
    finLimite.setHours(23, 59, 59, 999);

    // Si estamos dentro de la fecha permitida, calculamos el cupo real en Drive
    if (hoy >= inicioEvento && hoy <= finLimite) {
      
      let fotosSubidasGlobales = 0;
      const nombreCarpetaEvento = codigo.toUpperCase().trim();
      const carpetaEventos = DriveApp.getFolderById(ID_CARPETA_EVENTOS);
      const carpetas = carpetaEventos.getFoldersByName(nombreCarpetaEvento);
      
      if (carpetas.hasNext()) {
        const carpetaBoda = carpetas.next();
        
        // 🛟 BLINDAJE: Si por alguna razón la función no está definida, asumimos 0 para no romper la web
        if (typeof contarFotosTotalesEvento === 'function') {
          fotosSubidasGlobales = contarFotosTotalesEvento(carpetaBoda);
        } else {
          console.warn("⚠️ Advertencia: contarFotosTotalesEvento no está definida en comun.gs. Usando valor 0.");
        }
      }

      const LIMITE_MAXIMO_GLOBAL = 200; // Cupo máximo del plan contratado
      const cupoDisponibleGlobal = Math.max(0, LIMITE_MAXIMO_GLOBAL - fotosSubidasGlobales);

      // Si ya hemos llegado al tope global, cerramos el grifo
      if (cupoDisponibleGlobal <= 0) {
        return { 
          abierto: false, 
          mensaje: "✨ ¡Objetivo cumplido! Hemos alcanzado el límite máximo de 200 fotos compartidas para este evento. Muchas gracias a todos." 
        };
      }

      // Si queda sitio, devolvemos el OK y cuántos huecos quedan
      return { 
        abierto: true, 
        prefijo: evento.prefijo, 
        tipoEvento: evento.tipoEvento,
        cupoGlobalRestante: cupoDisponibleGlobal
      };

    // 🔄 CORREGIDO: Mensajes temporales invertidos solucionados
    } else if (hoy < inicioEvento) {
      return { abierto: false, mensaje: "El evento aún no ha comenzado. El plazo de subida abrirá el día del evento." };
    } else {
      return { abierto: false, mensaje: "El periodo de subida para este evento ha finalizado (plazo máximo: 2 días)." };
    }
    
  } catch (error) {
    return { abierto: false, mensaje: "Error al procesar el plazo del evento: " + error.message };
  }
}

function contarFotosTotalesEvento(carpetaBoda) {
  let totalFotos = 0;
  try {
    let archivosRaiz = carpetaBoda.getFiles();
    while (archivosRaiz.hasNext()) { archivosRaiz.next(); totalFotos++; }
    
    let subcarpetas = carpetaBoda.getFolders();
    while (subcarpetas.hasNext()) {
      let subcarpeta = subcarpetas.next();
      let archivosSub = subcarpeta.getFiles();
      while (archivosSub.hasNext()) { archivosSub.next(); totalFotos++; }
    }
  } catch (e) {
    console.error("Error al contar: " + e.toString());
  }
  return totalFotos;
}