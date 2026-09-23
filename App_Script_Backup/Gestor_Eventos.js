// =================================================================================
// 1️⃣ FUNCIÓN: PROCESAR NUEVA CONTRATACIÓN DE EVENTO (flujo Bizum manual, sin uso actual)
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
// 📧 FUNCIÓN: ENVIAR EMAIL DE CONFIRMACIÓN (flujo Bizum manual, sin uso actual)
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