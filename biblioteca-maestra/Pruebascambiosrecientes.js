// ============================================================
// PRUEBAS DE LOS CAMBIOS RECIENTES
// Pega este archivo como uno nuevo en tu proyecto de Apps Script
// (Archivo > Nuevo > Script), o añádelo al final de pruebas.gs.
//
// Ejecuta cada función desde el editor (selecciona la función en
// el desplegable de arriba > botón ▶ Ejecutar) y mira el log:
// Ver > Registro de ejecución (o Ctrl+Enter).
// ============================================================

/**
 * BLOQUE 1 — Pruebas de lógica pura (no tocan Sheet ni Drive).
 * Seguras de ejecutar ahora mismo, sin ningún riesgo.
 */
function test1_prefijosPorTipoEvento() {
  const casos = [
    "Boda", "Comunión", "Bautizo", "Fiesta", "Comida empresa",
    "Comida familiar", "Confirmación", "Cumpleaños",
    "Aniversario de boda", "Compromiso", "Graduación", "Jubilación",
    "Baby Shower" // ejemplo de "Other" con texto libre -> debe caer en EVENTO
  ];
  casos.forEach(tipo => {
    Logger.log(tipo + "  →  " + prefijoParaTipo(tipo));
  });
  // Esperado: cada uno debe dar su prefijo correspondiente,
  // y "Baby Shower" debe dar "EVENTO" (fallback).
}

function test2_estilosDeFotos() {
  const casos = [
    "Cinematic Drama", "Nostalgia Film", "Vogue Chic", "Magic Wonderland",
    "Finca cristalina", "Cyber Noir", "Aura Ancestral", "Elegancia Monocroma",
    "Ruta Vintage", "Bohemio Orgánico", "Luz de Primavera",
    "Elegancia Atemporal", "Fantasía", "Recuerdo Familiar",
    "Estilo Que No Existe" // debe devolverse tal cual (fallback)
  ];
  casos.forEach(estilo => {
    Logger.log(estilo + "  →  " + traducirEstiloAPrompt(estilo));
  });
  // Esperado: cada uno debe dar su descripción visual completa,
  // y el último caso debe devolver "Estilo Que No Existe" tal cual.
}

function test3_normalizarTexto() {
  const casos = ["¿Qué estilo prefieres para tus fotos?", "Cumpleaños", "  Bohemio   Orgánico  "];
  casos.forEach(txt => Logger.log('"' + txt + '"  →  "' + normalizarTexto(txt) + '"'));
}

/**
 * BLOQUE 2 — Pruebas que SÍ leen tu Sheet real (ALBUM_B_EVENTOS).
 * Solo lectura, no modifican nada. Sustituye CODIGO_DE_PRUEBA por
 * un código de evento real que ya tengas en la hoja.
 */
function test4_buscarEventoPorCodigo() {
  const CODIGO_DE_PRUEBA = "FIESTA_DFF5C668";
  const resultado = buscarEventoPorCodigo(CODIGO_DE_PRUEBA);
  Logger.log(JSON.stringify(resultado, null, 2));
  // Esperado: encontrado: true, con fechaEvento, tipoEvento, prefijo, estilo, codigo
  // Si sale "No se encontró la hoja...", el nombre de la pestaña no coincide.
}

function test5_obtenerEstiloBoda() {
  const CODIGO_DE_PRUEBA = "FIESTA_DFF5C668";
  Logger.log(obtenerEstiloBoda(CODIGO_DE_PRUEBA));
  // Esperado: la descripción visual completa del estilo elegido en el
  // formulario para ese evento, o el estilo por defecto según su tipo
  // si no hay estilo configurado.
}

/**
 * BLOQUE 3 — Prueba que SÍ escribe en tu Sheet (columna Estado Servicio).
 * ⚠️ Esta modifica una celda real. Úsala solo con un evento de prueba,
 * no con un evento real de un cliente.
 */
function test6_actualizarEstadoServicio() {
  const CODIGO_DE_PRUEBA = "FIESTA_DFF5C668";
  const ok = actualizarEstadoServicio(CODIGO_DE_PRUEBA, "FOTOS LISTAS (PRUEBA)");
  Logger.log("¿Se actualizó? → " + ok);
  // Ve a la hoja y comprueba a mano que la celda "Estado Servicio"
  // de esa fila cambió. Luego puedes deshacerlo manualmente.
}

/**
 * BLOQUE 4 — Prueba del cupo de 200 fotos (solo lectura).
 * Necesita que el evento ya tenga una carpeta creada en Drive
 * (aunque sea con 0 fotos).
 */
function test7_contarFotosTotalesEvento() {
  const CODIGO_DE_PRUEBA = "FIESTA_DFF5C668";
  const evento = buscarEventoPorCodigo(CODIGO_DE_PRUEBA);
  if (!evento.encontrado) {
    Logger.log("Evento no encontrado, no se puede probar el cupo.");
    return;
  }
  const nombreCarpetaEvento = CODIGO_DE_PRUEBA.toUpperCase();
  const carpetaEventos = DriveApp.getFolderById(ID_CARPETA_EVENTOS);
  const carpetas = carpetaEventos.getFoldersByName(nombreCarpetaEvento);
  if (!carpetas.hasNext()) {
    Logger.log("No se encontró la carpeta " + nombreCarpetaEvento);
    return;
  }
  const total = contarFotosTotalesEvento(carpetas.next());
  Logger.log("Fotos totales contadas (RAW_INVITADOS + RAW_PROCESADAS): " + total);
  // Esperado: sube este número aunque muevas fotos de RAW_INVITADOS a
  // RAW_PROCESADAS al procesar el batch (antes bajaba, ahora no debería).
}

/**
 * BLOQUE 6 — Diagnóstico de cabeceras.
 * Imprime exactamente cómo el código está leyendo la fila 1 de
 * ALBUM_B_EVENTOS, para comparar contra lo que se espera:
 * ESTADO SERVICIO, CODIGO EVENTO, EMAIL ADDRESS, NOMBRE Y APELLIDOS,
 * ENLACE ALBUM.
 */
function test9_diagnosticoCabeceras() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getSheets().find(s => normalizarTexto(s.getName()) === normalizarTexto(NOMBRE_HOJA_EVENTOS));
  if (!hoja) {
    Logger.log('No se encontró la hoja "' + NOMBRE_HOJA_EVENTOS + '"');
    Logger.log("Pestañas disponibles: " + ss.getSheets().map(s => s.getName()).join(", "));
    return;
  }

  const primeraFila = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
  Logger.log("--- Cabeceras tal cual están en la hoja ---");
  primeraFila.forEach((c, i) => Logger.log((i + 1) + ": \"" + c + "\"  →  normalizada: \"" + normalizarTexto(c) + "\""));

  const cab = obtenerMapaCabeceras(hoja);
  Logger.log("--- Comprobación de las 5 columnas requeridas ---");
  ["ESTADO SERVICIO", "CODIGO EVENTO", "EMAIL ADDRESS", "ENLACE ALBUM"].forEach(clave => {
    Logger.log(clave + "  →  " + (cab[clave] !== undefined ? "OK (columna " + (cab[clave] + 1) + ")" : "❌ NO ENCONTRADA"));
  });
  const claveNombre = Object.keys(cab).find(k => k.indexOf("NOMBRE Y APELLIDOS") === 0);
  Logger.log("NOMBRE Y APELLIDOS (startsWith)  →  " + (claveNombre !== undefined ? "OK (columna " + (cab[claveNombre] + 1) + ", cabecera real: \"" + claveNombre + "\")" : "❌ NO ENCONTRADA"));
}

/**
 * BLOQUE 5 — Prueba de entregarAlbumAlCliente.
 * ⚠️ Esta SÍ hace cosas reales: comparte una carpeta de Drive de verdad
 * y ENVÍA UN EMAIL de verdad (usa tu cuenta de Gmail conectada al script).
 *
 * Antes de ejecutarla:
 * 1) Añade la columna "Enlace Álbum" a ALBUM_B_EVENTOS si no la tienes ya.
 * 2) Usa una FILA DE PRUEBA con TU PROPIO email en "Email address",
 *    no la de un cliente real.
 * 3) El evento de prueba debe tener ya una carpeta EDITADAS creada en
 *    Drive (aunque esté vacía) — si no existe, la función lanzará error.
 * 4) Si esa fila ya tiene "Estado Servicio" = "FOTOS LISTAS" de una
 *    prueba anterior, esta prueba NO hará nada (es idempotente).
 *    Borra el valor de esa celda a mano si quieres repetir la prueba.
 */
function test8_entregarAlbumAlCliente() {
  const CODIGO_DE_PRUEBA = "FIESTA_DFF5C668";
  const resultado = entregarAlbumAlCliente(CODIGO_DE_PRUEBA);
  Logger.log("¿Se entregó? → " + resultado);
  // Esperado: true. Ve a tu Sheet y comprueba:
  //  - "Enlace Álbum" tiene una URL de Drive
  //  - "Estado Servicio" = "FOTOS LISTAS"
  // Y revisa tu bandeja de entrada (o Enviados de la cuenta del script):
  // debería haber llegado el email con el enlace.
}



// Función para hacer una prueba manual real desde el editor de la PRUEBA GRATIS
function PROBAR_PruebaGratis_Manual() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PRUEBA GRATIS");
  
  // 1. Leemos los datos de prueba reales de la fila 2 de tu hoja
  const filaIndex = 2; 
  const emailCliente = sheet.getRange(filaIndex, 2).getValue(); // Columna B (Email)
  const estiloElegido = sheet.getRange(filaIndex, 3).getValue(); // Columna C (Estilo)
  const fileIdsRaw = sheet.getRange(filaIndex, 5).getValue(); // Columna E (Foto)
  console.log(`🧪 Iniciando Prueba Manual para: ${emailCliente} | Estilo: ${estiloElegido} | Foto: ${fileIdsRaw}`);

  // 2. Ejecutamos directamente el revelado pasándole los parámetros correctos
  ejecutarReveladoGemini(sheet, filaIndex, emailCliente, estiloElegido, fileIdsRaw);
}