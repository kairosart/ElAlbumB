// @ts-nocheck
// =================================================================================
// CONFIGURACIÓN GLOBAL - EL ÁLBUM B
// =================================================================================
const CARPETA_RAIZ_ID = "17aA-10hZDrc4RtnDaLZRTnEJBXw92YKe";
const MODELO = "gemini-3.1-flash-lite-image"; 
const CARPETA_PRUEBA_GRATIS_ID = "1_je93_U_SHcpeEz96NO9v8LSNmzO7qqfBLjWChvl3AxfAVVDbqNbrBvPqGl6pxvmF03aBH0_";
const CARPETA_PACK_EXPRESS_ID = "1si9vyULBO5C4encWGX0814F8CdeePtqo1VaDoPKhz-4JA4IDNVQ4L610cW6bUDrhYVdzo5wW"; 
const CARPETA_EVENTOS_ID = "1Yqw1h68C43aZL2LevkpIiofqeqmBITZi";

// =================================================================================
// ESTILOS PROMPT (MOTOR DE IA REFINADO)
// =================================================================================
const ESTILOS_PROMPT = { 
    "CINEMATIC DRAMA": "estilo cinematográfico y dramático, iluminación de cine, contraste marcado, tonos teal y naranja, atmósfera de película",
    "NOSTALGIA FILM": "estilo de película analógica nostálgica, grano de película sutil, tonos cálidos desaturados, aspecto vintage",
    "VOGUE CHIC": "estilo editorial de revista de moda, elegante y sophisticated, iluminación de estudio, colores ricos y contrastados",
    "MAGIC WONDERLAND": "estilo de fantasía luminosa en bosque mágico, árboles altos curvos con tonos azul y morado, luces flotantes suaves, brillos cálidos alrededor de los sujetos, atmósfera etérea y de cuento de hadas, neblina ligera, reflejos brillantes en el entorno, estética cinematográfica fantástica con colores vibrantes y aura mágica envolvente",
    "FINCA CRISTALINA": "estilo natural y luminoso, con reflejos suaves de luz, ambiente rural elegante, tonos claros y transparentes",
    "CYBER NOIR": "estilo cyberpunk oscuro, iluminación neón azul y morada, alto contraste, atmósfera urbana nocturna",
    "AURA ANCESTRAL": "estilo etéreo y ancestral, tonos tierra cálidos, luz dorada suave, atmósfera espiritual y atemporal",
    "ELEGANCIA MONOCROMA": "estilo en blanco y negro elegante, alto contraste, composición clásica y sofisticada",
    "RUTA VINTAGE": "estilo vintage de carretera, tonos sepia y desaturados, textura de fotografía antigua, nostalgia de viaje",
    "BOHEMIO ORGANICO": "estilo bohemio y natural, tonos tierra y verdes suaves, luz natural cálida, ambiente relajado",
    "LUZ DE PRIMAVERA": "estilo luminoso y fresco, tonos pastel suaves, luz natural brillante, ambiente primaveral",
    "ELEGANCIA ATEMPORAL": "estilo clásico y atemporal, tonos neutros elegantes, iluminación suave, composición refinada",
    "FANTASIA": "estilo fantástico y surrealista, colores vibrantes y saturados, elementos oníricos, atmósfera mágica",
    "RECUERDO FAMILIAR": "estilo cálido y cercano, tonos naturales suaves, luz cálida hogareña, ambiente entrañable y familiar",
    "RESTAURAR B/N": "Restaura esta fotografía antigua de manera profesional y respetuosa. Elimina arañazos, roturas, manchas de polvo, dobleces y zonas desgastadas por el paso del tiempo. Corrige la degradación y la oxidación del papel manteniendo la textura fotográfica original. Restaura de forma natural la nitidez en los rostros y los detalles clave sin crear un efecto digital artificial o de 'plástico'. Equilibrar la iluminación eliminando zonas quemadas u oscuras excesivas, y aplica una gradación de color o un tratamiento en blanco y negro fiel al original según corresponda, devolviéndole su claridad y esplendor histórico pero conservando su autenticidad intacta.",
    "RESTAURAR COLOR": "Restaura esta fotografía antigua y devuélvele todo su color de forma realista y natural. Elimina arañazos, roturas, manchas de polvo, dobleces y el desgaste acumulado por el paso del tiempo. Corrige la degradación del papel manteniendo intacta la textura fotográfica original. Aplica una colorización precisa, respetando los tonos de piel naturales, la ropa y el entorno original, sin saturaciones excesivas ni brillos artificiales. Equilibra la iluminación eliminando zonas oscuras o quemadas, logrando una imagen clara, viva y fiel a su época histórica pero con total nitidez."
};

function obtenerEstiloPrompt(seleccionUsuario) {
  if (!seleccionUsuario) return ESTILOS_PROMPT["CINEMATIC DRAMA"];
  
  const claveLimpia = seleccionUsuario.trim();
  if (ESTILOS_PROMPT[claveLimpia]) {
    return ESTILOS_PROMPT[claveLimpia];
  }

  const claveEncontrada = Object.keys(ESTILOS_PROMPT).find(
    k => k.trim().toLowerCase() === claveLimpia.toLowerCase()
  );
  if (claveEncontrada) {
    return ESTILOS_PROMPT[claveEncontrada];
  }

  return `estilo artístico inspirado temáticamente en '${claveLimpia}', adaptando la dirección de arte, la atmósfera, los elementos visuales icónicos y la paleta de colores de forma totalmente coherente con esta temática.`;
}

// =================================================================================
// 💳 CONFIGURACIÓN DE PRECIOS, PESTAÑAS Y COLUMNAS (STRIPE)
// =================================================================================
const CONFIG_PACKS = {
  EXPRESS: {
    nombrePestana: "PACK EXPRESS",
    precio: 4.99,
    columnas: { email: "B", nombre: "C", estilo: "E", fileIds: "G", estado: "H", importe: "I" }
  },
  EVENTOS: {
    nombrePestana: "ALBUM_B_EVENTOS",
    precio: 79, 
    columnas: { email: "B", nombre: "C", telefono: "D", fecha: "E", tipoEvento: "F", estilo: "G", pack: "H", codigoEvento: "I", estado: "J", enlaceAlbum: "K", importe: "L" }
  },
  GRAN_FIESTA: {
    nombrePestana: "ALBUM_B_EVENTOS",
    precio: 129, 
    columnas: { email: "B", nombre: "C", telefono: "D", fecha: "E", tipoEvento: "F", estilo: "G", pack: "H", codigoEvento: "I", estado: "J", enlaceAlbum: "K", importe: "L" }
  }
};

// =================================================================================
// 1. DISPARADOR DE FORMULARIOS (CONTROLADOR PRINCIPAL)
// =================================================================================
function onFormSubmit(e) {
  try {
    Logger.log("=== INICIO onFormSubmit ===");
    if (!e || !e.range) return;

    const sheet = e.range.getSheet();
    const nombrePestana = sheet.getName().trim();
    const fila = e.range.getRow();
    Logger.log("Pestaña detectada: '" + nombrePestana + "', Fila: " + fila);
    
    if (nombrePestana === "PACK EXPRESS") {
      try {
        const estadoActual = sheet.getRange(fila, 8).getValue();
        if (estadoActual === "Entregado" || estadoActual === "Revelando..." || estadoActual === "Pendiente de Pago") {
          return ContentService.createTextOutput("PACK EXPRESS YA PROCESADO O PENDIENTE");
        }

        const emailCliente  = sheet.getRange(fila, 2).getValue();
        const nombreCliente = sheet.getRange(fila, 3).getValue() || "Cliente";

        // Marcar inicialmente como pendiente de pago antes de revelar
        sheet.getRange(fila, 8).setValue("Pendiente de Pago");
        SpreadsheetApp.flush();

        PackExpressEnviarEmailPago(fila, emailCliente);
      } catch (err) {
        console.error("❌ Error PACK EXPRESS (Formulario):", err.toString());
        sheet.getRange(fila, 8).setValue("Error Crítico");
        return ContentService.createTextOutput("Error PACK EXPRESS: " + err.message);
      }
    }
    
    else if (nombrePestana === "PRUEBA GRATIS") {
      ejecutarPruebaGratis(e); 
    } 
    
    else if (nombrePestana === "ALBUM_B_EVENTOS") {
      const seleccionPack = sheet.getRange(fila, 8).getValue().toString().trim().toUpperCase();

      let packConfig, tipoEventoParaCodigo, nombrePackTexto;
      if (seleccionPack.includes("GRAN FIESTA")) {
        packConfig = CONFIG_PACKS.GRAN_FIESTA; 
        tipoEventoParaCodigo = "GRAN_FIESTA";
        nombrePackTexto = "Gran Fiesta (400 fotos)";
      } else {
        packConfig = CONFIG_PACKS.EVENTOS;     
        tipoEventoParaCodigo = "EVENTOS";
        nombrePackTexto = "Eventos (200 fotos)";
      }

      const codigoAleatorio = Utilities.getUuid().slice(0, 8).toUpperCase();
      const codigoEventoFinal = `${tipoEventoParaCodigo}_${codigoAleatorio}`;

      sheet.getRange(fila, 9).setValue(codigoEventoFinal);

      const colEstadoNum = 10; 
      sheet.getRange(fila, colEstadoNum).setValue("Pendiente de Pago");

      const emailColKey = e.namedValues["Dirección de correo electrónico"]
        ? "Dirección de correo electrónico"
        : Object.keys(e.namedValues).find(k => k.toLowerCase().includes("email") || k.toLowerCase().includes("correo"));
      const email = emailColKey ? e.namedValues[emailColKey][0] : null;

      const nombreColKey = e.namedValues["Nombre y apellidos"]
        ? "Nombre y apellidos"
        : Object.keys(e.namedValues).find(k => k.toLowerCase().includes("nombre"));
      const nombre = nombreColKey ? e.namedValues[nombreColKey][0] : "Cliente";

      if (!email) throw new Error("No se pudo identificar el correo electrónico.");

      Logger.log("Procesando pack: " + tipoEventoParaCodigo + " para: " + email + " - Precio: " + packConfig.precio + "€");

      const referenciaUnica = "EVENTO_FILA_" + fila;
      const urlPagoDinamica = crearSesionStripeDinamica(nombrePackTexto, packConfig.precio, email, referenciaUnica);

      enviarEmailPagoStripe(email, nombre, urlPagoDinamica);

      sheet.getRange(fila, colEstadoNum).setValue("Formulario recibido");
      Logger.log("=== PROCESO EVENTOS / GRAN FIESTA COMPLETADO Y EMAIL ENVIADO ===");
    }

  } catch (err) {
    Logger.log("FATAL_ERROR en onFormSubmit: " + err.toString());
  }
}


function PackExpressEnviarEmailPago(filaPrueba, emailCliente) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("PACK EXPRESS");

  const nombreCliente = sheet.getRange(filaPrueba, 3).getValue() || "Cliente";

  Logger.log("Formulario Pack Express recibido. Enviando email de pago a: " + emailCliente);

  // Solo creamos la sesión de Stripe y enviamos el enlace de pago.
  // El revelado con Gemini se dispara más tarde, desde doPost(), únicamente
  // cuando Stripe confirma que el pago se ha completado.
  const referenciaUnica = "PACK_EXPRESS_FILA_" + filaPrueba;
  const urlPagoDinamica = crearSesionStripeDinamica("Pack Express", CONFIG_PACKS.EXPRESS.precio, emailCliente, referenciaUnica);

  enviarEmailPagoStripe(emailCliente, nombreCliente, urlPagoDinamica);
}



// =================================================================================
// 2. INTEGRACIÓN STRIPE (PASARELA DE PAGO)
// =================================================================================
function crearSesionStripeDinamica(nombreProducto, precioEuros, emailCliente, referenciaUnica) {
  const secretKey = PropertiesService.getScriptProperties().getProperty('STRIPE_SECRET_KEY');
  if (!secretKey) throw new Error("Falta STRIPE_SECRET_KEY en las propiedades del script.");

  const url = "https://api.stripe.com/v1/checkout/sessions";
  
  Logger.log("Precio recibido en Stripe: " + precioEuros);

  const precioNum = parseFloat(precioEuros) || 0;
  const importeCents = Math.round(precioNum * 100);

  const payload = {
    "mode": "payment",
    "success_url": "https://www.elalbumb.com",
    "cancel_url": "https://www.elalbumb.com",
    "customer_email": emailCliente,
    "client_reference_id": referenciaUnica,
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(importeCents),
    "line_items[0][price_data][product_data][name]": nombreProducto,
    "line_items[0][quantity]": "1"
  };

  const options = {
    "method": "post",
    "headers": { "Authorization": "Bearer " + secretKey },
    "payload": payload,
    "muteHttpExceptions": true
  };

  const response = UrlFetchApp.fetch(url, options);
  const resultado = JSON.parse(response.getContentText());

  if (resultado.url) {
    Logger.log("¡Sesión de Stripe creada con éxito: " + resultado.url);
    return resultado.url;
  } else {
    throw new Error("Error al crear sesión en Stripe: " + (resultado.error ? resultado.error.message : response.getContentText()));
  }
}

function generarSesionStripe(nombreCliente, precio, emailCliente, idRef) {
  return crearSesionStripeDinamica("Servicio El Álbum B", precio, emailCliente, idRef);
}



function enviarEmailPagoStripe(email, nombre, urlPago) {
  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333; padding: 20px;">
      <h2 style="color:#d4af37; font-weight:600; margin-bottom:10px;">¡Hola ${nombre}!</h2>
      <p style="margin-bottom:18px;">
        Gracias por confiar en <strong>El Álbum B</strong>.  
        Para activar tu servicio y comenzar, solo tienes que completar el pago.
      </p>
      <a href="${urlPago}" style="display:inline-block; padding:14px 22px; background:#d4af37; color:white; text-decoration:none; border-radius:6px; font-weight:bold; font-size:16px;">
        Finalizar pago con Stripe
      </a>
      <p style="margin-top:25px; color:#555;">
        Una vez realizado el pago, procesaremos todo automáticamente.
      </p>
      <p style="margin-top:30px; font-size:13px; color:#999;">El Álbum B</p>
    </div>
  `;

  GmailApp.sendEmail(
    email,
    "Completa tu pedido en El Álbum B",
    "Para completar tu pedido, haz clic en el botón del email.",
    { htmlBody: html }
  );
}

// =================================================================================
// 3. WEBHOOK PACK EXPRESS, EVENTOS, PRUEBA GRATIS
// =================================================================================
function doPost(e) {
  // 1. Parseamos el JSON UNA sola vez, fuera de cualquier lógica de negocio.
  //    Si esto falla, es un error real de formato, no un fallo de "subir" ni de Stripe.
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", mensaje: "JSON inválido: " + err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Enrutamos según el contenido, cada ruta con su propio try/catch interno.
  if (data.action === "subir") {
    return manejarSubidaInvitado(data);
  }

  if (data.type) {
    return manejarWebhookStripe(data);
  }

  return ContentService.createTextOutput(
    JSON.stringify({ status: "error", mensaje: "Petición no reconocida" })
  ).setMimeType(ContentService.MimeType.JSON);
}

// -----------------------------------------------------------------------
// Caso 1: subida de foto de un invitado (viene de la app Firebase)
// -----------------------------------------------------------------------
function manejarSubidaInvitado(data) {
  try {
    const respuestaServidor = subirArchivoAlDrive(data);
    return ContentService.createTextOutput(JSON.stringify(respuestaServidor))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", mensaje: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// -----------------------------------------------------------------------
// Caso 2: webhook de Stripe (checkout.session.completed, etc.)
// -----------------------------------------------------------------------
function manejarWebhookStripe(data) {
  try {
    if (data.type !== "checkout.session.completed") {
      return ContentService.createTextOutput("Evento ignorado (" + data.type + ")");
    }

    const session = data.data.object;

    if (session.payment_status !== "paid") {
      return ContentService.createTextOutput("Sesión aún no pagada, ignorada");
    }

    // Extraemos la referencia del cliente que mandamos al crear la sesión de Stripe
    const clientRefId = session.client_reference_id; // Ej: "PACK_EXPRESS_FILA_58" o "EVENTO_FILA_12"
    Logger.log("Client Reference ID recibido de Stripe: " + clientRefId);

    let sheet, fila, nombrePestana;
    const ss = SpreadsheetApp.getActive();

    if (clientRefId && clientRefId.includes("PACK_EXPRESS_FILA_")) {
      fila = parseInt(clientRefId.replace("PACK_EXPRESS_FILA_", ""), 10);
      sheet = ss.getSheetByName("PACK EXPRESS");
      nombrePestana = "PACK EXPRESS";
    } else if (clientRefId && clientRefId.includes("EVENTO_FILA_")) {
      fila = parseInt(clientRefId.replace("EVENTO_FILA_", ""), 10);
      sheet = ss.getSheetByName("ALBUM_B_EVENTOS");
      nombrePestana = "ALBUM_B_EVENTOS";
    } else {
      // Método de respaldo por si viniera sin referencia (búsqueda por email)
      const email = session.customer_details ? session.customer_details.email : null;
      if (!email) return ContentService.createTextOutput("Error: No se pudo identificar el cliente ni la referencia");
      
      const emailBuscado = email.toString().trim().toLowerCase();
      for (let s of ss.getSheets()) {
        const nombreHoja = s.getName().trim();
        if (nombreHoja === "PACK EXPRESS" || nombreHoja === "ALBUM_B_EVENTOS") {
          const values = s.getDataRange().getValues();
          for (let i = values.length - 1; i >= 1; i--) {
            if (values[i][1] && values[i][1].toString().trim().toLowerCase() === emailBuscado) {
              sheet = s;
              fila = i + 1;
              nombrePestana = nombreHoja;
              break;
            }
          }
          if (sheet) break;
        }
      }
    }

    if (!sheet || !fila || isNaN(fila)) {
      Logger.log("❌ Error crítico: No se pudo determinar la hoja o la fila.");
      return ContentService.createTextOutput("Error: No se encontró la hoja o la fila correspondiente.");
    }

    Logger.log(`✅ Fila ${fila} identificada correctamente en la pestaña '${nombrePestana}'. Ejecutando revelado...`);

    if (nombrePestana === "ALBUM_B_EVENTOS") {
      return procesarEventoPagado(sheet, fila);
    }

    if (nombrePestana === "PACK EXPRESS") {
      return procesarPackExpressPagado(sheet, fila);
    }

    return ContentService.createTextOutput("Servicio no reconocido");

  } catch (err) {
    console.error("❌ Error general webhook:", err.toString());
    return ContentService.createTextOutput("Error general: " + err.message);
  }
}

// -----------------------------------------------------------------------
// Sub-caso: evento tipo ALBUM_B_EVENTOS pagado -> crea carpetas, QR y envía email
// -----------------------------------------------------------------------
function procesarEventoPagado(sheet, fila) {
  try {
    const estadoActual = sheet.getRange(fila, 10).getValue();
    if (estadoActual === "EN PROCESO DE SUBIDA" || estadoActual === "Pagado") {
      return ContentService.createTextOutput("EVENTO YA PROCESADO");
    }

    const emailCliente  = sheet.getRange(fila, 2).getValue();
    const nombreCliente = sheet.getRange(fila, 3).getValue();
    const seleccionPack = sheet.getRange(fila, 8).getValue().toString().trim().toUpperCase();

    let precioFinal, nombrePackTexto, tipoCodigo;
    if (seleccionPack.includes("GRAN FIESTA")) {
      precioFinal = CONFIG_PACKS.GRAN_FIESTA.precio;
      nombrePackTexto = "Gran Fiesta (400 fotos)";
      tipoCodigo = "GRAN_FIESTA";
    } else {
      precioFinal = CONFIG_PACKS.EVENTOS.precio;
      nombrePackTexto = "Eventos (200 fotos)";
      tipoCodigo = "EVENTOS";
    }

    // Generamos el código único una sola vez y lo compartimos
    const codigoAleatorio = Utilities.getUuid().slice(0, 8).toUpperCase();
    const codigoEvento = `${tipoCodigo}_${codigoAleatorio}`;

    const carpetaEventos = obtenerCarpetaEventos();
    const carpetaEvento = obtenerOCrearSubcarpeta(carpetaEventos, codigoEvento);

    obtenerOCrearSubcarpeta(carpetaEvento, "01_RAW_INVITADOS");
    obtenerOCrearSubcarpeta(carpetaEvento, "02_RAW_PROCESADAS");
    const carpetaEditadas = obtenerOCrearSubcarpeta(carpetaEvento, "03_EDITADAS");

    const urlFinalAlbum = `https://elalbumb-subirarchivos.web.app/?codigo=${codigoEvento}`;

    carpetaEditadas.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const urlCarpetaEditadas = carpetaEditadas.getUrl();

    const urlApiQRSubida = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + encodeURIComponent(urlFinalAlbum);
    const respuestaQRSubida = UrlFetchApp.fetch(urlApiQRSubida);
    const blobQRSubida = respuestaQRSubida.getBlob().setName("qr_subida_invitados.png");

    const urlApiQREditadas = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + encodeURIComponent(urlCarpetaEditadas);
    const respuestaQREditadas = UrlFetchApp.fetch(urlApiQREditadas);
    const blobQREditadas = respuestaQREditadas.getBlob().setName("qr_fotos_editadas.png");

    GmailApp.sendEmail(
      emailCliente,
      "¡Tu Álbum de Evento ya está activo!",
      "",
      {
        htmlBody: `
          <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px;">
            <h2 style="color:#6a5acd;">¡Hola ${nombreCliente || ""}, tu evento (${nombrePackTexto}) está activo!</h2>
            <p>Hemos creado el espacio para tu evento. A continuación tienes los accesos tanto para tus invitados como para ti:</p>

            <p style="font-size: 16px; margin: 15px 0;">
              <strong>Código de tu evento:</strong> <span style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${codigoEvento}</span>
            </p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;" />

            <h3 style="color: #444; margin-bottom: 5px;">1. Acceso para tus Invitados (Subir fotos)</h3>
            <p style="margin-top: 0; color: #666; font-size: 14px;">Comparte este QR o enlace con los asistentes para que suban sus fotos:</p>
            <div style="margin: 15px 0; text-align: center;">
              <img src="cid:qrSubida" alt="QR Subida Invitados" style="max-width:160px; height:auto; border: 1px solid #eee; padding: 5px; border-radius: 4px;" />
            </div>
            <p style="text-align: center;">
              <a href="${urlFinalAlbum}" style="background: #6a5acd; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Subir fotos al evento</a>
            </p>

            <br>

            <h3 style="color: #444; margin-bottom: 5px;">2. Tu Carpeta de Fotos Editadas</h3>
            <p style="margin-top: 0; color: #666; font-size: 14px;">Aquí podrás ver y descargar las fotos finales a medida que el sistema las procese:</p>
            <div style="margin: 15px 0; text-align: center;">
              <img src="cid:qrEditadas" alt="QR Fotos Editadas" style="max-width:160px; height:auto; border: 1px solid #eee; padding: 5px; border-radius: 4px;" />
            </div>
            <p style="text-align: center;">
              <a href="${urlCarpetaEditadas}" style="background: #4682b4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Ver carpeta de fotos editadas</a>
            </p>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;" />
            <p style="font-size: 12px; color: #888; text-align: center;">Gracias por confiar en El Álbum B.</p>
          </div>
        `,
        inlineImages: {
          qrSubida: blobQRSubida,
          qrEditadas: blobQREditadas
        }
      }
    );

    sheet.getRange(fila, 9).setValue(codigoEvento);
    sheet.getRange(fila, 10).setValue("EN PROCESO DE SUBIDA");
    sheet.getRange(fila, 11).setValue(carpetaEvento.getUrl());
    sheet.getRange(fila, 12).setValue(precioFinal);
    sheet.getRange(fila, 12).setNumberFormat("0.00");

    return ContentService.createTextOutput("EVENTO OK");

  } catch (err) {
    console.error("❌ Error EVENTOS:", err.toString());
    return ContentService.createTextOutput("Error EVENTOS: " + err.toString());
  }
}

// -----------------------------------------------------------------------
// Sub-caso: Pack Express pagado -> dispara el revelado con Gemini
// -----------------------------------------------------------------------
function procesarPackExpressPagado(sheet, fila) {
  try {
    const estadoActual = sheet.getRange(fila, 8).getValue();
    if (estadoActual === "Entregado" || estadoActual === "Revelando...") {
      return ContentService.createTextOutput("PACK EXPRESS YA PROCESADO");
    }

    const emailCliente  = sheet.getRange(fila, 2).getValue();
    const estiloElegido = sheet.getRange(fila, 5).getValue().toString().trim();
    const fileIdsRaw    = sheet.getRange(fila, 7).getValue();

    sheet.getRange(fila, 8).setValue("Revelando...");
    SpreadsheetApp.flush();

    const resultadoRevelado = ejecutarReveladoGemini(sheet, fila, emailCliente, estiloElegido, fileIdsRaw);

    if (resultadoRevelado) {
      const precioExpress = CONFIG_PACKS.EXPRESS.precio;
      sheet.getRange(fila, 9).setValue(precioExpress);
      sheet.getRange(fila, 9).setNumberFormat("0.00");
      SpreadsheetApp.flush();
      return ContentService.createTextOutput("PACK EXPRESS OK");
    } else {
      throw new Error("El proceso de Gemini devolvió null.");
    }
  } catch (err) {
    console.error("❌ Error PACK EXPRESS (Webhook):", err.message);
    sheet.getRange(fila, 8).setValue("Error Crítico");
    return ContentService.createTextOutput("Error PACK EXPRESS: " + err.message);
  }
}

// =================================================================================
// PROMO: PRUEBA GRATIS
// =================================================================================
const packExpressLink = "https://forms.gle/tiU1r1z6jegxLuFm9"

function ejecutarPruebaGratis(e) {
  try {
    const sheet = e.range.getSheet();
    const fila = e.range.getRow();
    const datos = sheet.getRange(fila, 1, 1, sheet.getLastColumn()).getValues()[0];

    const emailCliente  = datos[1] ? datos[1].toString().trim().toLowerCase() : "";
    const estiloElegido = datos[2] ? datos[2].toString().trim() : "";
    const urlFotoRaw    = datos[4] ? datos[4].toString().trim() : "";

    if (!emailCliente || !urlFotoRaw) {
      sheet.getRange(fila, 6).setValue("Error: Datos incompletos");
      return;
    }

    if (fila > 2) {
      const numFilasPrevias = fila - 2;
      if (numFilasPrevias > 0) {
        const rangoEmails = sheet.getRange(2, 2, numFilasPrevias, 1).getValues().flat();
        const emailsProcesados = rangoEmails.map(item => item.toString().trim().toLowerCase()).filter(Boolean);
        if (emailsProcesados.includes(emailCliente)) {
          sheet.getRange(fila, 6).setValue("Bloqueado: Ya pidió prueba");
          enviarCorreoBloqueado(emailCliente);
          return;
        }
      }
    }

    sheet.getRange(fila, 6).setValue("Procesando");
    SpreadsheetApp.flush();

    const fileId = extraerIdDeUrlDrive(urlFotoRaw);
    if (!fileId) throw new Error("No se pudo extraer la ID de la imagen");

    const urlCarpetaCliente = ejecutarReveladoGemini(sheet, fila, emailCliente, estiloElegido, fileId);

    if (urlCarpetaCliente) {
      const stripeLinkExpress = generarSesionStripe("Pack Express", CONFIG_PACKS.EXPRESS.precio, emailCliente, "PRUEBA_GRATIS_UP_EXPRESS");
      enviarCorreoPromoGratis(emailCliente, urlCarpetaCliente);
      sheet.getRange(fila, 6).setValue("Prueba Entregada");
    }
  } catch (error) {
    try {
      e.range.getSheet().getRange(e.range.getRow(), 6).setValue("Error: " + error.message);
    } catch (innerErr) {}
  }
}

function enviarCorreoPromoGratis(emailDestinatario, urlCarpetaCliente, stripeLink) {
  const asunto = "¡Aquí tienes tu prueba gratis de El Álbum B!";
  const cuerpoHTML = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>¡Tu revelado está listo!</h2>
      <p>Puedes ver y descargar tu foto de prueba aquí:</p>
      <p><a href="${urlCarpetaCliente}" style="background-color: #d4af37; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">VER MI FOTO EDITADA</a></p>
      <p>¿Te gustó? Compra tu pack completo por 4,99€:</p>
      <p><a href="${packExpressLink}">Comprar Pack Express</a></p>
    </div>
  `;
  GmailApp.sendEmail(emailDestinatario, asunto, "", { htmlBody: cuerpoHTML });
}

function enviarCorreoBloqueado(emailDestinatario) {
  const asunto = "¡Vaya! Ya has disfrutado de tu prueba gratis - El Álbum B";
  const cuerpoHTML = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>¡Ya has disfrutado de tu prueba gratuita!</h2>
      <p><a href="${packExpressLink}" style="background-color: #d4af37; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">COMPRAR PACK EXPRESS</a></p>
    </div>
  `;
  GmailApp.sendEmail(emailDestinatario, asunto, "", { htmlBody: cuerpoHTML });
}

// =================================================================================
// MOTOR DE REVELADO E INTEGRACIÓN VERTEX AI
// =================================================================================
function ejecutarReveladoGemini(sheet, filaIndex, emailCliente, estiloElegido, fileIdsRaw) {
  const nombrePestana = sheet.getName().trim().toUpperCase();
  const colEstado = (nombrePestana === "PACK EXPRESS") ? 8 : 6; 

  try {
    let rawItems = [];
    if (Array.isArray(fileIdsRaw)) {
      rawItems = fileIdsRaw;
    } else if (fileIdsRaw) {
      rawItems = fileIdsRaw.toString().split(",");
    }

    let fileIds = [];
    for (let item of rawItems) {
      let itemStr = item ? item.toString().trim() : "";
      if (!itemStr) continue;
      if (itemStr.toLowerCase().includes("sube aquí") || itemStr.length < 10) continue;

      let idExtraido = "";
      try {
        idExtraido = extraerIdDrive(itemStr);
      } catch (eId) {
        idExtraido = itemStr;
      }

      if (idExtraido && idExtraido.trim().length >= 15 && !idExtraido.includes(" ")) {
        fileIds.push(idExtraido.trim());
      }
    }

    if (!fileIds.length) {
      sheet.getRange(filaIndex, colEstado).setValue("Error: Sin Fotos");
      SpreadsheetApp.flush();
      return null;
    }

    let estiloPromptFinal = obtenerEstiloPrompt(estiloElegido);
    
    if (nombrePestana === "PRUEBA GRATIS") {
      estiloPromptFinal += ` CRÍTICO: Añade obligatoriamente una marca de agua de texto distribuida en un patrón de varias líneas diagonales y paralelas repetidas de forma oblicua por toda la superficie de la imagen. Cada línea debe mostrar de forma idéntica, nítida y perfectamente deletreada el siguiente texto exacto en letras MAYÚSCULAS y SIN ACENTOS: "EL ALBUM B - PRUEBA GRATIS".`;
    }

    let carpetaRaiz;
    if (nombrePestana === "PRUEBA GRATIS") {
      carpetaRaiz = DriveApp.getFolderById(CARPETA_PRUEBA_GRATIS_ID.trim());
    } else if (nombrePestana === "PACK EXPRESS") {
      carpetaRaiz = DriveApp.getFolderById(CARPETA_PACK_EXPRESS_ID.trim());
    } else {
      throw new Error(`Pestaña no soportada: ${nombrePestana}`);
    }

    let carpetaCliente;
    const carpetasExistentes = carpetaRaiz.getFoldersByName(emailCliente);
    if (carpetasExistentes.hasNext()) {
      carpetaCliente = carpetasExistentes.next();
    } else {
      carpetaCliente = carpetaRaiz.createFolder(emailCliente);
      carpetaCliente.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }

    let fotosOk = 0;
    for (let i = 0; i < fileIds.length; i++) {
      const fileId = fileIds[i];
      try {
        const archivoOriginal = DriveApp.getFileById(fileId);
        const imagenMejoradaBlob = procesarFotoConVertexAI(archivoOriginal, estiloPromptFinal);

        if (imagenMejoradaBlob) {
          const nombreBase = `${estiloElegido.replace(/\s+/g, '_')}_${i + 1}_${archivoOriginal.getName()}`;
          const nombreModificado = nombreBase.replace("Kairos Art", "elAlumB");
          
          imagenMejoradaBlob.setName(nombreModificado);
          carpetaCliente.createFile(imagenMejoradaBlob);
          fotosOk++;
        }

        if (i < fileIds.length - 1) {
          Utilities.sleep(8000);
        }
      } catch (errInner) {
        console.error("Error en archivo individual:", errInner.message);
      }
    }

    if (fotosOk > 0) {
      const urlCarpeta = carpetaCliente.getUrl();
     if (nombrePestana === "PACK EXPRESS") {
        const asuntoEntrega = "✨ Tus recuerdos ya están listos: Tu Galería Express te espera";
        const cuerpoEntrega = `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #d4af37; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
            <p style="font-size: 16px;">¡Hola!</p>
            <p style="font-size: 16px;">Nos alegra muchísimo anunciarte que tu selección del <strong>PACK EXPRESS</strong> ya ha sido procesada y se encuentra disponible.</p>
            <p style="font-size: 16px;">Puedes explorar y revivir cada momento accediendo a tu galería privada a través del siguiente enlace:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${urlCarpeta}" style="background-color: #d4af37; color: #1a1a1a; padding: 12px 28px; text-decoration: none; border-radius: 4px; font-size: 15px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Acceder a tu carpeta</a>
            </div>
            <p style="font-size: 15px; color: #555555;">Esperamos que disfrutes de cada imagen tanto como nosotros disfrutamos capturándolas.</p>
            <p style="font-size: 15px; margin-top: 30px;">Un saludo cordial,<br><strong>El Álbum B</strong></p>
          </div>
        `;
        GmailApp.sendEmail(emailCliente, asuntoEntrega, "", { htmlBody: cuerpoEntrega });
        sheet.getRange(filaIndex, colEstado).setValue("Entregado");
      } else if (nombrePestana === "PRUEBA GRATIS") {
        sheet.getRange(filaIndex, colEstado).setValue("Prueba Entregada");
      }
      SpreadsheetApp.flush();
      return urlCarpeta;
    } else {
      sheet.getRange(filaIndex, colEstado).setValue("Error Vertex AI");
      SpreadsheetApp.flush();
      return null;
    }
  } catch (error) {
    sheet.getRange(filaIndex, colEstado).setValue("Error Crítico");
    SpreadsheetApp.flush();
    return null;
  }
}



// =================================================================================
// UTILIDADES Y DRIVE
// =================================================================================


function extraerIdDrive(urlOId) {
  const coincidencia = urlOId.match(/[-\w]{25,}/);
  return coincidencia ? coincidencia[0] : urlOId;
}

function extraerIdDeUrlDrive(url) {
  if (url.includes('/d/')) return url.split('/d/')[1].split('/')[0];
  if (url.includes('id=')) return url.split('id=')[1].split('&')[0];
  return url.trim();
}


function vaciarCarpetasPackExpresPruebaGratis() {
  const idsCarpetas = [
    { id: "1_je93_U_SHcpeEz96NO9v8LSNmzO7qqfBLjWChvl3AxfAVVDbqNbrBvPqGl6pxvmF03aBH0_", nombre: "Prueba Gratis" },
    { id: "1si9vyULBO5C4encWGX0814F8CdeePtqo1VaDoPKhz-4JA4IDNVQ4L610cW6bUDrhYVdzo5wW", nombre: "Pack Express" }
  ];

  const CARPETAS_EXCLUIDAS = [
    "Sube aquí hasta 5 fotos originales (File responses)", 
    "Sube aquí tu foto original (File responses)" 
  ];

  let informeHtml = "<h2>🧹 Informe de Vaciado Nocturno</h2>";
  let totalEliminados = 0;

  idsCarpetas.forEach(item => {
    informeHtml += `<h3>📁 Carpeta: ${item.nombre}</h3><ul>`;
    let eliminadosEnCarpeta = 0;

    try {
      const carpeta = DriveApp.getFolderById(item.id);
      
      const subcarpetas = carpeta.getFolders();
      while (subcarpetas.hasNext()) {
        const sub = subcarpetas.next();
        const nombreSub = sub.getName();

        if (CARPETAS_EXCLUIDAS.includes(nombreSub)) {
          informeHtml += `<li><b>Carpeta protegida respetada:</b> ${nombreSub} (vaciando su contenido interior...)</li>`;
          
          const archivosInternos = sub.getFiles();
          while (archivosInternos.hasNext()) {
            const archivoInt = archivosInternos.next();
            informeHtml += `<li>&nbsp;&nbsp;&nbsp;&nbsp;↳ Archivo interno eliminado: ${archivoInt.getName()}</li>`;
            archivoInt.setTrashed(true);
            eliminadosEnCarpeta++;
            totalEliminados++;
          }

          const subCarpetasInternas = sub.getFolders();
          while (subCarpetasInternas.hasNext()) {
            const subInt = subCarpetasInternas.next();
            informeHtml += `<li>&nbsp;&nbsp;&nbsp;&nbsp;↳ Subcarpeta interna eliminada: <b>${subInt.getName()}</b></li>`;
            subInt.setTrashed(true);
            eliminadosEnCarpeta++;
            totalEliminados++;
          }

          continue; 
        }

        informeHtml += `<li>Subcarpeta eliminada: <b>${nombreSub}</b></li>`;
        sub.setTrashed(true);
        eliminadosEnCarpeta++;
        totalEliminados++;
      }

      const archivos = carpeta.getFiles();
      while (archivos.hasNext()) {
        const archivo = archivos.next();
        informeHtml += `<li>Archivo eliminado: ${archivo.getName()}</li>`;
        archivo.setTrashed(true);
        eliminadosEnCarpeta++;
        totalEliminados++;
      }

      if (eliminadosEnCarpeta === 0) {
        informeHtml += `<li><i>No hubo elementos eliminados en esta sección.</i></li>`;
      }

    } catch (e) {
      informeHtml += `<li style="color:red;"><b>Error al procesar la carpeta:</b> ${e.message}</li>`;
      console.error(`❌ Error al vaciar la carpeta con ID ${item.id}: ${e.message}`);
    }

    informeHtml += `</ul>`;
  });

  informeHtml += `<hr><p><b>Total de elementos enviados a la papelera:</b> ${totalEliminados}</p>`;

  try {
    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: `🧹 Reporte Nocturno: ${totalEliminados} elementos eliminados de Drive`,
      htmlBody: informeHtml
    });
    console.log("📧 Informe de vaciado enviado con éxito por correo.");
  } catch (emailError) {
    console.error("❌ Error al enviar el correo del informe: " + emailError.message);
  }
}

function vaciarEventos() {
  const CARPETA_EVENTOS_ID = "1Yqw1h68C43aZL2LevkpIiofqeqmBITZi";
  const nombreCarpeta = "Eventos";
  const DIAS_LIMITE = 15;

  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - DIAS_LIMITE);

  let informeHtml = `<h2>🧹 Informe de Limpieza: ${nombreCarpeta} (Elementos de +${DIAS_LIMITE} días)</h2><ul>`;
  let totalEliminados = 0;

  try {
    const carpeta = DriveApp.getFolderById(CARPETA_EVENTOS_ID);
    
    const subcarpetas = carpeta.getFolders();
    while (subcarpetas.hasNext()) {
      const sub = subcarpetas.next();
      const fechaCreacionSub = sub.getDateCreated();

      if (fechaCreacionSub < fechaLimite) {
        informeHtml += `<li>Subcarpeta eliminada: <b>${sub.getName()}</b> (Creada el: ${fechaCreacionSub.toLocaleDateString()})</li>`;
        sub.setTrashed(true);
        totalEliminados++;
      }
    }

    const archivos = carpeta.getFiles();
    while (archivos.hasNext()) {
      const archivo = archivos.next();
      const fechaCreacionArchivo = archivo.getDateCreated();

      if (fechaCreacionArchivo < fechaLimite) {
        informeHtml += `<li>Archivo eliminado: ${archivo.getName()} (Creado el: ${fechaCreacionArchivo.toLocaleDateString()})</li>`;
        archivo.setTrashed(true);
        totalEliminados++;
      }
    }

    if (totalEliminados === 0) {
      informeHtml += `<li><i>No hay elementos que superen los ${DIAS_LIMITE} días de antigüedad.</i></li>`;
    }

  } catch (e) {
    informeHtml += `<li style="color:red;"><b>Error al procesar la carpeta:</b> ${e.message}</li>`;
    console.error(`❌ Error al vaciar la carpeta de Eventos: ${e.message}`);
  }

  informeHtml += `</ul><hr><p><b>Total de elementos enviados a la papelera:</b> ${totalEliminados}</p>`;

  try {
    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: `🧹 Reporte Eventos (+${DIAS_LIMITE} días): ${totalEliminados} elementos eliminados`,
      htmlBody: informeHtml
    });
    console.log("📧 Informe de la carpeta Eventos enviado con éxito por correo.");
  } catch (emailError) {
    console.error("❌ Error al enviar el correo del informe: " + emailError.message);
  }
}