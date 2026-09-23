/**
 * Devuelve siempre la carpeta EVENTOS oficial usando su ID fijo y exacto.
 */
function obtenerCarpetaEventos() {
  // ID fijo de tu carpeta EVENTOS oficial en Google Drive
  const ID_OFICIAL_EVENTOS = "1Yqw1h68C43aZL2LevkpIiofqeqmBITZi";
  
  try {
    const carpeta = DriveApp.getFolderById(ID_OFICIAL_EVENTOS);
    return carpeta;
  } catch (err) {
    throw new Error("❌ No se pudo encontrar la carpeta EVENTOS oficial con ID: " + ID_OFICIAL_EVENTOS + ". Comprueba que exista en tu Drive.");
  }
}

/**
 * Maneja las peticiones GET desde Firebase o el navegador
 */
function doGet(e) {
  const action = e?.parameter?.action;

  // Si la petición viene de la web de Firebase pidiendo verificar el código
  if (action === "verificar") {
    const codigo = (e.parameter.codigo || "").trim().toUpperCase();
    
    // Llama a tu función de validación existente
    const resultado = verificarPlazoSubida(codigo, Date.now()); 
    
    return ContentService.createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Por seguridad, si alguien entra directo al script sin parámetros de API
  return ContentService.createTextOutput(
    JSON.stringify({ status: "error", mensaje: "Acceso no autorizado. Utiliza la web oficial." })
  ).setMimeType(ContentService.MimeType.JSON);
}


/**
 * Guarda una foto subida por un invitado dentro de la estructura:
 * 01_RAW_INVITADOS
 * 02_RAW_PROCESADAS
 * 03_EDITADAS
 */
function subirArchivoAlDrive(obj) {
  try {
    const codigoEvento = (obj.codigo || "").trim().toUpperCase();
    if (!codigoEvento) {
      throw new Error("Código de evento inválido o vacío.");
    }

    const carpetaEventos = obtenerCarpetaEventos();
    const carpetaEvento = obtenerOCrearSubcarpeta(carpetaEventos, codigoEvento);

    const carpetaRawInvitados  = obtenerOCrearSubcarpeta(carpetaEvento, "01_RAW_INVITADOS");
    obtenerOCrearSubcarpeta(carpetaEvento, "02_RAW_PROCESADAS");
    obtenerOCrearSubcarpeta(carpetaEvento, "03_EDITADAS");

    const sessionId = (obj.sessionId || "SIN_SESION").replace(/[^a-zA-Z0-9_]/g, "");
    const blob = Utilities.newBlob(
      Utilities.base64Decode(obj.data.split(',')[1]),
      obj.type,
      `FOTO_${Date.now()}_${sessionId}.jpg`
    );

    carpetaRawInvitados.createFile(blob);

    return "¡Tu foto se ha guardado correctamente!";

  } catch (err) {
    console.error("Error en subirArchivoAlDrive:", err);
    return "Error al guardar la foto: " + err.message;
  }
}


/**
 * Utilidad: obtiene una subcarpeta o la crea si no existe
 */
function obtenerOCrearSubcarpeta(parent, nombre) {
  const sub = parent.getFoldersByName(nombre);
  return sub.hasNext() ? sub.next() : parent.createFolder(nombre);
}


/**
 * Resetea el ID_CARPETA_EVENTOS para pruebas
 */
function resetEventos() {
  PropertiesService.getScriptProperties().deleteProperty("ID_CARPETA_EVENTOS");
  return "ID_CARPETA_EVENTOS eliminado. La carpeta se recreará automáticamente.";
}
