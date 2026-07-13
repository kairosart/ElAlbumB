// Trigger disparado al enviarse el formulario de CONTRATACIÓN de evento
// (el que rellena el organizador). Genera el código único, lo guarda en
// la hoja, y manda el email con el enlace listo para compartir con invitados.
//
// Configura este trigger como "From spreadsheet" -> "On form submit",
// apuntando a ALBUM_B_EVENTOS.

//const URL_BASE_ALBUM = "https://script.google.com/macros/s/AKfycbwmlwgYY4siLNreGKVazRCNGHagFRFYbosofo_L4I_QveXIq50SGUJZAlCaOncEsDs_og/exec"; // sustituye por tu URL de despliegue real


function onFormSubmitEventos(e) {
  const hoja = e.range.getSheet();
  const fila = e.range.getRow();
  const cab = obtenerMapaCabeceras(hoja);

  const colCodigo = cab["CODIGO EVENTO"];
  const colTipo = cab["TIPO DE EVENTO"];
  const colEmail = cab["EMAIL ADDRESS"];
  const colEstado = cab["ESTADO SERVICIO"];

  if (colCodigo === undefined) {
    throw new Error('Falta la columna "Código Evento" en ' + hoja.getName());
  }

  const tipoEvento = colTipo !== undefined ? hoja.getRange(fila, colTipo + 1).getValue() : "";
  const codigo = generarCodigoEvento(tipoEvento);
  hoja.getRange(fila, colCodigo + 1).setValue(codigo);

  // Marca el servicio como "Pendiente" al recibir la solicitud, si esa
  // columna existe y aún no tiene valor (para no pisar un estado ya puesto).
  if (colEstado !== undefined) {
    const valorActual = hoja.getRange(fila, colEstado + 1).getValue();
    if (!valorActual || String(valorActual).trim() === "") {
      hoja.getRange(fila, colEstado + 1).setValue("Pendiente");
    }
  } else {
    Logger.log('Aviso: no se encontró la columna "Estado Servicio" en ' + hoja.getName());
  }

  const email = colEmail !== undefined ? hoja.getRange(fila, colEmail + 1).getValue() : "";
  if (email) {
    const enlace = URL_BASE_ALBUM + "?codigo=" + encodeURIComponent(codigo);
    MailApp.sendEmail({
      to: email,
      subject: "Tu código para El Álbum B",
      htmlBody:
        "<p>¡Gracias por contratar El Álbum B!</p>" +
        "<p>Comparte este enlace con tus invitados para que suban sus fotos:</p>" +
        "<p><a href='" + enlace + "'>" + enlace + "</a></p>" +
        "<p>Tu código de evento es: <strong>" + codigo + "</strong></p>"
    });
  } else {
    Logger.log("Fila " + fila + ": sin email, no se pudo notificar el código " + codigo);
  }
}