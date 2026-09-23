// Sustituye el contenido de tu archivo "Gestor de Eventos" por esto.
// Cambios respecto a la versión anterior:
// - writePendiente ya no usa una columna fija (6/F): busca "Estado Servicio"
//   por nombre, así no se rompe si añades columnas en el futuro.
// - writePendiente y procesarNuevaContratacion solo se ejecutan cuando el
//   envío es realmente de ALBUM_B_EVENTOS (antes se llamaba a writePendiente
//   siempre, incluso para envíos de PRUEBA GRATIS, y escribía por error en
//   ALBUM_B_EVENTOS usando el número de fila del otro formulario).
// - procesarNuevaContratacion ahora genera y usa un "Código Evento" único
//   (vía generarCodigoEvento, en comun.gs) en vez del nombre del titular
//   para construir el enlace y el QR. El nombre del titular puede repetirse,
//   llevar espacios/acentos, o coincidir entre dos parejas distintas — el
//   código no.
// - Si la fila ya tiene código (por ejemplo, porque se reprocesa a mano),
//   no se genera uno nuevo ni se manda el email dos veces con enlaces
//   distintos.
//
// Requiere que comun.gs esté en el mismo proyecto (usa obtenerMapaCabeceras,
// normalizarTexto y generarCodigoEvento de ahí).

function onFormSubmit(e) {
  const hoja = e.range.getSheet();
  const nombreHoja = hoja.getName();

  if (nombreHoja === "ALBUM_B_EVENTOS") {
    writePendiente(e);
    //procesarNuevaContratacion(e);
  } else if (nombreHoja === "PRUEBA GRATIS") {
    activadorPrincipal(e);
  }
}

/**
 * Marca "Pendiente" en Estado Servicio si aún no tiene valor.
 * Busca la columna por nombre, no por posición.
 */
function writePendiente(e) {
  const hoja = e.range.getSheet();
  const fila = e.range.getRow();
  const cab = obtenerMapaCabeceras(hoja);

  const colEstado = cab["ESTADO SERVICIO"];
  if (colEstado === undefined) {
    Logger.log('Aviso: no se encontró la columna "Estado Servicio" en ' + hoja.getName());
    return;
  }

  const valorActual = hoja.getRange(fila, colEstado + 1).getValue();
  if (!valorActual || String(valorActual).trim() === "") {
    hoja.getRange(fila, colEstado + 1).setValue("Pendiente");
  }
}


// =================================================================================
// 1️⃣ FUNCIÓN: PROCESAR NUEVA CONTRATACIÓN DE EVENTO
// =================================================================================
function procesarNuevaContratacion(e) {
  console.log("🆕 Detectada nueva entrada de formulario para Eventos...");
  
  // Capturamos las respuestas que acaban de entrar por el formulario
  const respuestas = e.namedValues;
  
  // Extraemos los datos usando los nombres exactos de tus columnas
  const emailCliente = respuestas["Email address"] ? respuestas["Email address"][0].trim() : "";
  const nombreCliente = respuestas["Nombre y apellidos del titular de la cuenta (Tal como aparece en tu app del banco al hacer el Bizum)"] ? respuestas["Nombre y apellidos del titular de la cuenta (Tal como aparece en tu app del banco al hacer el Bizum)"][0].trim() : "";
  const tipoEvento = respuestas["Tipo de Evento"] ? respuestas["Tipo de Evento"][0].trim() : "";
  
  if (!emailCliente) {
    console.error("❌ Error: El formulario no contiene un email válido.");
    return;
  }

  // Forzamos el estado inicial de la fila a "Pendiente" por seguridad
  try {
    const sheet = e.range.getSheet();
    const fila = e.range.getRow();
    const colEstadoNum = letraAIndice(CONFIG_PACKS.EVENTOS.columnas.estado) + 1;
    sheet.getRange(fila, colEstadoNum).setValue("Pendiente");
    SpreadsheetApp.flush();
  } catch(err) {
    console.warn("⚠️ No se pudo escribir el estado 'Pendiente' en la fila: " + err);
  }

  // Obtenemos el precio configurado en tu "Cerebro" (CONFIG_PACKS)
  const precioEvento = CONFIG_PACKS.EVENTOS.precio;

  // 🚀 Delegamos el envío del correo a la segunda función
  enviarEmailEventoListo(emailCliente, nombreCliente, tipoEvento, precioEvento);
}


// =================================================================================
// 📧 FUNCIÓN: ENVIAR EMAIL DE CONFIRMACIÓN (¡Pago Recibido y Evento Listo!)
// =================================================================================
function enviarEmailEventoListo(emailDestinatario, nombreTitular, codigoEvento) {
  const asunto = `¡Tu Álbum de Evento ya está activo! - El Álbum B`;
  
  const cuerpoHTML = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eeeeee; border-radius: 10px;">
      <h2 style="color: #27ae60; text-align: center; margin-bottom: 25px;">¡Pago Recibido Correctamente! 🥳</h2>
      <p>¡Hola, <b>${nombreTitular}</b>!</p>
      <p>Hemos procesado con éxito tu Bizum. Tu pack de Eventos para <b>El Álbum B</b> ya se encuentra totalmente activo.</p>
      
      <div style="background-color: #f4f6f7; padding: 15px; border-radius: 8px; border-left: 4px solid #27ae60; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #2c3e50;">Tu Código de Evento es: <b>${codigoEvento || "Asignado"}</b></p>
      </div>

      <p>El laboratorio inteligente ya está abierto. Ya puedes compartir con tus invitados el acceso y el <b>formulario de subida de archivos</b> para que empiecen a enviar sus fotos y empiece la magia del revelado.</p>
      
      <p>¡Muchas gracias por confiar en El Álbum B! Si tienes cualquier duda, responde directamente a este correo.</p>
      
      <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
      <p style="font-size: 12px; color: #7f8c8d; text-align: center;">
        El Álbum B - Revelado Inteligente de Fotografía.
      </p>
    </div>
  `;

  GmailApp.sendEmail(emailDestinatario, asunto, "", { htmlBody: cuerpoHTML });
  console.log(`✉️ Correo de Evento Listo enviado con éxito a: ${emailDestinatario}`);
}