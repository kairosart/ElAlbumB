// El ID de la carpeta "EVENTOS" (ID_CARPETA_EVENTOS) ahora se define una
// única vez en comun.gs, para no tenerlo duplicado en varios archivos.

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Formulario');
  var codigo = (e && e.parameter && e.parameter.codigo) ? e.parameter.codigo : "";
  template.codigoEvento = codigo;
  
  return template.evaluate()
      .setTitle('Subir Archivos - El Álbum B')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'); // <-- ESTO ES CRUCIAL

}



function subirArchivoAlDrive(obj) {
  const prefijo = obj.prefijo || "EVENTO"; // recibido del cliente tras verificarPlazoSubida
  // El código ya incluye el prefijo (lo genera generarCodigoEvento como
  // "PREFIJO_AZAR"), así que NO hay que volver a anteponer prefijo aquí.
  const nombreCarpetaEvento = obj.codigo.toUpperCase();
  const carpetaEventos = DriveApp.getFolderById(ID_CARPETA_EVENTOS);
  
  let carpetaBoda;
  const carpetas = carpetaEventos.getFoldersByName(nombreCarpetaEvento);
  if (carpetas.hasNext()) { carpetaBoda = carpetas.next(); } 
  else { carpetaBoda = carpetaEventos.createFolder(nombreCarpetaEvento); }
  
  let carpetaRaw;
  const subcarpetas = carpetaBoda.getFoldersByName("RAW_INVITADOS");
  if (subcarpetas.hasNext()) { carpetaRaw = subcarpetas.next(); } 
  else { carpetaRaw = carpetaBoda.createFolder("RAW_INVITADOS"); }
  
  // Incluimos el sessionId del invitado en el nombre de archivo para poder
  // agruparlas por invitado en el procesamiento posterior (reparto equánime).
  // Formato: FOTO_<timestamp>_<sessionId>.jpg
  const sessionId = (obj.sessionId || "SIN_SESION").replace(/[^a-zA-Z0-9_]/g, "");
  const blob = Utilities.newBlob(
    Utilities.base64Decode(obj.data.split(',')[1]),
    obj.type,
    "FOTO_" + new Date().getTime() + "_" + sessionId + ".jpg"
  );
  carpetaRaw.createFile(blob);
  
  return "¡Tu foto se ha guardado corrrectamente!";
}