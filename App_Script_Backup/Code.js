// @ts-nocheck
// =================================================================================
// CONFIGURACIÓN GLOBAL (Ajusta estos datos si cambias de carpeta, modelo o URL)
// =================================================================================

const CARPETA_RAIZ_ID = "17aA-10hZDrc4RtnDaLZRTnEJBXw92YKe";
const MODELO = "gemini-2.5-flash-image"; 
const TELEFONO_BIZUM = "634404631";

// 🌐 URL Base del despliegue de tu aplicación para invitados (¡CORREGIDO: YA NO ESTÁ COMENTADO!)
const URL_BASE_ALBUM = "https://script.google.com/macros/s/AKfycbxJHcrl-Z_8TBgDaVSlbnBPto5VV1AkRsla2BxMzHknmgfolZdJiiZXzlT2Vc3YGSE9Ew/exec";

// 📊 CONFIGURACIÓN DE COLUMNAS PARA EL TIPO DE EVENTO (Pestaña ALBUM_B_EVENTOS)
// Si el texto "Boda", "Bautizo", etc. está en la columna D, deja el 3.
// Si está en la columna E, pon un 4. Si está en la columna F, pon un 5.
const COLUMNA_TEXTO_EVENTO = 4; // Ajustado a 4 (Columna E) o 3 (Columna D) según corresponda

// =================================================================================
// 💰 CONFIGURACIÓN DE PRECIOS, PESTAÑAS Y COLUMNAS EXACTAS
// =================================================================================
const CONFIG_PACKS = {
  EXPRESS: {
    nombrePestana: "PACK EXPRESS",
    precio: 4.99,
    asuntoBizum: "Bizum recibido",
    columnas: {
      email:   "B", 
      nombre:  "C", 
      estilo:  "E", 
      fileIds: "G", 
      estado:  "H", 
      importe: "I"  
    }
  },
  EVENTOS: {
    nombrePestana: "ALBUM_B_EVENTOS",
    precio: 79, 
    asuntoBizum: "Bizum evento",
    columnas: {
      email:       "B", 
      nombre:      "C", 
      estilo:      "G", 
      fileIds:     "H", // Aquí se escribe el CODIGO EVENTO generado
      estado:      "I", // Estado Servicio
      enlaceAlbum: "J", // ¡NUEVO! Columna J para guardar el link dinámico
      importe:     "K"  
    }
  }
};

const ESTILOS_PROMPT = { 
  "Cinematic Drama": "Aplica una iluminación cinematográfica impecable y clara sobre los sujetos o el sujeto principal...",
  "Nostalgia Film": "Post-procesamiento fotográfico avanzado para imitar una película analógica de la era de los 70s...",
  "Vogue Chic": "ANULA EL CONTRALUZ POR COMPLETO...",
  "Magic Wonderland": "Aísla a los sujetos o al sujeto principal y colócalos en un bosque nocturno místico.",
  "Finca Cristalina": "Aísla a los sujetos o al sujeto principal de esta foto manteniendo la silueta intacta...",
  "Bohemio Orgánico": "Aplica un procesamiento puramente limpio y orgánico con una paleta de colores tierra...",
  "Ruta Vintage": "Estilo cinematográfico de carretera clásica...",
  "Elegancia Monocroma": "Conversión digital pura a blanco y negro de estilo bellas artes...",
  "Cyber Noir": "Aplica una reiluminación digital purista, pulida y de ultra-alta definición..."
};

// =================================================================================
// 🚦 FUNCIÓN MAESTRA: ENRUTADOR AUTOMÁTICO DE FORMULARIOS (ACTIVADOR PRINCIPAL)
// =================================================================================

function activadorPrincipal(e) {
  if (!e) {
    console.error("❌ Error: Este script debe ejecutarse a través del activador automático de la hoja.");
    return;
  }

  const sheet = e.range.getSheet();
  const nombrePestana = sheet.getName().trim().toUpperCase(); 

  console.log(`📩 Formulario recibido en la pestaña real: "${sheet.getName()}"`);

  if (nombrePestana === "PACK EXPRESS") {
    pedidoPackExpress(e); 
  } else if (nombrePestana === "PRUEBA GRATIS") {
    ejecutarPruebaGratis(e); 
  } else if (nombrePestana === "ALBUM_B_EVENTOS") {
    enviarPeticionBizumEvento(e);
  } else {
    console.log(`ℹ️ Formulario omitido. La pestaña "${sheet.getName()}" no requiere acciones.`);
  }
}

// =================================================================================
// FASE 1: RECEPCIÓN DEL PEDIDO PACK EXPRESS (ENVÍO DE PETICIÓN DE PAGO BIZUM)
// =================================================================================

function pedidoPackExpress(e) {
  try {
    // Validar que el evento existe
    if (!e || !e.range) {
      //console.error("El script no fue invocado por un evento de hoja.");
      //return;
    }

    const sheet = e.range.getSheet();
    const fila = e.range.getRow(); 
    
    // Validar que estamos en la fila correcta (opcional, evita ejecutar en cabeceras)
    if (fila < 2) return;

    const emailCliente   = sheet.getRange(fila, 2).getValue().toString().trim().toLowerCase(); 
    const nombreTitular  = sheet.getRange(fila, 3).getValue().toString().trim();               

    if (!emailCliente) return;

    // Escribir el estado
    sheet.getRange(fila, 8).setValue("Pendiente");
    
    // Forzar la actualización de la hoja para que el valor se guarde antes de enviar el mail
    SpreadsheetApp.flush(); 

    const asunto = "¡Tus fotos ya están en la mesa de revelado! - El Álbum B";
    const cuerpoHtml = `
      <p>¡Hola!</p>
      <p>Ya tenemos tus fotos en la mesa de revelado de <b>El Álbum B</b>.</p>
      <p>Para activar tu pedido de <b>4,99 €</b> realiza un Bizum al teléfono <b>${TELEFONO_BIZUM}</b>.</p>
      <p><i>Cruzaremos el ingreso automáticamente con tu nombre: <b>${nombreTitular}</b>.</i></p>
    `;
    
    GmailApp.sendEmail(emailCliente, asunto, "", { htmlBody: cuerpoHtml });

  } catch (error) { 
    console.error("Error en Fase 1 Express: " + error.toString()); 
  }
}

function enviarPeticionBizumEvento(e) {
  // ESCUDO: Solo se ejecuta si viene de la pestaña correcta
  const sheet = e.range.getSheet();
  if (sheet.getName().trim().toUpperCase() !== "ALBUM_B_EVENTOS") {
    return; // Si no es la pestaña de eventos, no hace nada
  }
  try {
    const sheet = e.range.getSheet();
    const fila = e.range.getRow();
    const emailCliente = sheet.getRange(fila, 2).getValue().toString().trim();
    const nombreCliente = sheet.getRange(fila, 3).getValue().toString().trim();
    const tipoEvento = sheet.getRange(fila, COLUMNA_TEXTO_EVENTO + 1).getValue().toString().trim() || "Evento";
    
    const colEstadoNum = letraAIndice(CONFIG_PACKS.EVENTOS.columnas.estado) + 1;
    sheet.getRange(fila, colEstadoNum).setValue("Pendiente");

    const asunto = `Activa tu Álbum de Evento: ${tipoEvento} - El Álbum B`;
    const cuerpoHTML = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eeeeee; border-radius: 10px;">
        <h2 style="color: #2c3e50; text-align: center;">¡Tu álbum de ${tipoEvento} está casi listo!</h2>
        <p>¡Hola, <b>${nombreCliente}</b>!</p>
        <p>Para activar el sistema y generar el formulario de subida para tus invitados, por favor realiza el ingreso:</p>
        <div style="background-color: #f4f6f7; padding: 15px; border-left: 4px solid #3498db;">
          <p>Importe exacto: <b>${CONFIG_PACKS.EVENTOS.precio} €</b></p>
          <p>Teléfono Bizum: <b>${TELEFONO_BIZUM}</b></p>
        </div>
      </div>
    `;
    GmailApp.sendEmail(emailCliente, asunto, "", { htmlBody: cuerpoHTML });
  } catch(err) { console.error("Error enviando petición de evento: " + err); }
}


function probarPedido() {
  // Creamos un objeto "mock" (falso) que simula el evento 'e'
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const eventoFalso = {
    range: sheet.getRange("A20") // Cambia "A2" por una fila real que tenga datos
  };
  
  // Llamamos a tu función pasando el objeto falso
  pedidoPackExpress(eventoFalso);
}


// =================================================================================
// FASE 2: VERIFICADOR AUTOMÁTICO DE GMAIL (CADA 5 MIN)
// =================================================================================

function revisarGmailYProcesarTodosLosPedidos() {
  procesarPedidosPorPack(CONFIG_PACKS.EXPRESS);
  procesarPedidosPorPack(CONFIG_PACKS.EVENTOS);
}

function procesarPedidosPorPack(config) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheets().find(s => s.getName().trim().toUpperCase() === config.nombrePestana.toUpperCase());

  if (!sheet) return;

  // Índices de columnas
  const idx = {
    email:       letraAIndice(config.columnas.email),
    nombre:      letraAIndice(config.columnas.nombre),
    estilo:      letraAIndice(config.columnas.estilo),
    fileIds:     letraAIndice(config.columnas.fileIds), 
    estado:      letraAIndice(config.columnas.estado),
    enlaceAlbum: config.columnas.enlaceAlbum ? letraAIndice(config.columnas.enlaceAlbum) : -1,
    importe:     letraAIndice(config.columnas.importe)
  };

  const datos = sheet.getDataRange().getValues();
  const hilos = GmailApp.search(`is:unread subject:"${config.asuntoBizum}"`, 0, 10);
  
  if (hilos.length === 0) return;

  for (let h = 0; h < hilos.length; h++) {
    const ultimoMensaje = hilos[h].getMessages().pop();
    const cuerpoEmailRaw = ultimoMensaje.getPlainBody();
    const cuerpoEmailLimpio = normalizarTextoLegacy(cuerpoEmailRaw);
    let correoProcesado = false;

    for (let i = 1; i < datos.length; i++) {
      const emailCliente      = datos[i][idx.email] ? datos[i][idx.email].toString().trim().toLowerCase() : ""; 
      const nombreClienteForm = datos[i][idx.nombre] ? datos[i][idx.nombre].toString().trim() : "";               
      const estiloElegido     = datos[i][idx.estilo] ? datos[i][idx.estilo].toString().trim() : "";               
      const fileIdsRaw        = datos[i][idx.fileIds];                                                     
      const estado            = datos[i][idx.estado] ? datos[i][idx.estado].toString().trim() : "";               
      
      let importePagadoAnterior = datos[i][idx.importe] ? parseFloat(datos[i][idx.importe].toString().replace(',', '.')) : 0;
      if (isNaN(importePagadoAnterior)) importePagadoAnterior = 0;

      if ((estado === "Pendiente" || estado === "Error: Importe Incorrecto") && nombreClienteForm !== "") {
        if (cuerpoEmailLimpio.includes(normalizarTextoLegacy(nombreClienteForm))) {
          
          const matchImporte = cuerpoEmailRaw.match(/(?:(?:€|EUR|euros)\s*(\d+(?:[\.,]\d{1,2})?)|(\d+(?:[\.,]\d{1,2})?)\s*(?:€|EUR|euros))/i);

          if (matchImporte) {
            const importeEsteBizum = parseFloat((matchImporte[1] || matchImporte[2]).replace(',', '.'));
            const totalPagadoHastaAhora = importePagadoAnterior + importeEsteBizum;

            if (totalPagadoHastaAhora >= config.precio) {
              sheet.getRange(i + 1, idx.estado + 1).setValue("Procesando"); 
              sheet.getRange(i + 1, idx.importe + 1).setValue(totalPagadoHastaAhora); 
              
              let codigoEventoFinal = fileIdsRaw ? fileIdsRaw.toString().trim() : "";
              
              // ⚡ CONTROL EXCLUSIVO PARA EVENTOS TRAS EL PAGO
              if (config.nombrePestana === "ALBUM_B_EVENTOS") {
                const colCodigoNum = idx.fileIds + 1;
                
                if (codigoEventoFinal === "" || codigoEventoFinal.startsWith("EVT-") || !codigoEventoFinal.includes("_")) {
                  // Mapeamos el tipo de evento (Columna H -> índice 5 en base cero)
                  let tipoEventoForm = datos[i][5] ? datos[i][5].toString().trim() : "FIESTA";
                  
                  let eventoLimpio = tipoEventoForm.toUpperCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, "_")
                    .replace(/[^A-Z0-9_]/g, "");

                  if (!eventoLimpio) eventoLimpio = "EVENTO";

                  const hashAleatorio = generarHashAlfanumerico(8);
                  codigoEventoFinal = `${eventoLimpio}_${hashAleatorio}`;
                  
                  sheet.getRange(i + 1, colCodigoNum).setValue(codigoEventoFinal);
                }

                // 🌐 AQUÍ SE GENERA Y GUARDA LA URL EN LA COLUMNA J ("Enlace album")
                if (idx.enlaceAlbum !== -1) {
                  const urlFinalAlbum = URL_BASE_ALBUM + "?codigo=" + encodeURIComponent(codigoEventoFinal);
                  sheet.getRange(i + 1, idx.enlaceAlbum + 1).setValue(urlFinalAlbum);
                  console.log(`   🔗 Enlace de álbum guardado con éxito en columna J: ${urlFinalAlbum}`);
                }
              }

              SpreadsheetApp.flush();
              
              if (config.nombrePestana === "ALBUM_B_EVENTOS") {
                sheet.getRange(i + 1, idx.estado + 1).setValue("Activo");
                
                // -----------------------------------------------------------------
                // 📸 GENERACIÓN EN CALIENTE DEL CÓDIGO QR E INYECCIÓN DEL EMAIL
                // -----------------------------------------------------------------
                const urlFinalAlbum = URL_BASE_ALBUM + "?codigo=" + encodeURIComponent(codigoEventoFinal);
                const urlApiQR = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + encodeURIComponent(urlFinalAlbum);
                
                try {
                  // Descargamos el QR para incrustarlo de forma interna y nativa
                  const respuestaQR = UrlFetchApp.fetch(urlApiQR);
                  const blobQR = respuestaQR.getBlob().setName("qr_evento.png");

                  const cuerpoHTML = `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eeeeee; border-radius: 10px;">
                      <h2 style="color: #27ae60; text-align: center; margin-bottom: 25px;">&#161;Pago Recibido Correctamente! &#129395;</h2>
                      <p>&#161;Hola, <b>${nombreClienteForm}</b>!</p>
                      <p>Hemos procesado con &eacute;xito tu Bizum. Tu pack de Eventos para <b>El &Aacute;lbum B</b> ya se encuentra totalmente activo.</p>
                      
                      <div style="background-color: #f4f6f7; padding: 15px; border-radius: 8px; border-left: 4px solid #27ae60; margin: 20px 0;">
                        <p style="margin: 0; font-weight: bold; color: #2c3e50;">Tu C&oacute;digo de Evento es: <b>${codigoEventoFinal}</b></p>
                      </div>

                      <p>El laboratorio inteligente ya est&aacute; abierto. Aqu&iacute; tienes el <b>C&oacute;digo QR oficial</b> de tu evento. Tus invitados podr&aacute;n escanearlo directamente con sus m&oacute;viles para empezar a subir sus fotos instant&aacute;neamente:</p>
                      
                      <!-- QR Incrustado -->
                      <div style="text-align: center; margin: 30px 0; padding: 15px; background-color: #ffffff; border: 2px dashed #27ae60; display: inline-block; width: 100%; box-sizing: border-box; border-radius: 10px;">
                        <img src="cid:qrIncrustadoNativo" alt="C&oacute;digo QR" style="width: 250px; height: 250px; display: block; margin: 0 auto;" />
                        <p style="margin-top: 10px; font-size: 12px; color: #7f8c8d; font-weight: bold;">&#128242; &#161;Escanea este QR para subir tus fotos!</p>
                      </div>

                      <p style="text-align: center; margin: 25px 0;">
                        <a href="${urlFinalAlbum}" style="background-color: #27ae60; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Enlace directo para Subir Archivos</a>
                      </p>

                      <p style="font-size: 13px; color: #555555; word-break: break-all;">O copia y pega este link para compartirlo:<br><a href="${urlFinalAlbum}">${urlFinalAlbum}</a></p>
                      <p>&#161;Muchas gracias por confiar en El &Aacute;lbum B! Si tienes cualquier duda, responde directamente a este correo.</p>
                    </div>
                  `;

                  // Envío forzando el formato correcto
                  GmailApp.sendEmail(emailCliente, "¡Tu Álbum de Evento ya está activo! - El Álbum B", "", {
                    htmlBody: cuerpoHTML,
                    inlineImages: { qrIncrustadoNativo: blobQR }
                  });
                  console.log("✉️ Email con QR nativo enviado correctamente.");

                } catch (eQR) {
                  // Plan B de emergencia (Texto plano si falla la red)
                  GmailApp.sendEmail(emailCliente, "¡Tu Álbum de Evento ya está activo! - El Álbum B", `¡Hola! Tu pago ha sido recibido. Tu código es ${codigoEventoFinal}. Accede desde aquí: ${urlFinalAlbum}`);
                  console.error("Fallo al generar el QR, se envió texto alternativo: " + eQR.toString());
                }

              } else {
                let estiloElegido = datos[i][idx.estilo] ? datos[i][idx.estilo].toString().trim() : "";
                ejecutarReveladoGemini(sheet, i + 1, emailCliente, estiloElegido, codigoEventoFinal);
              }
              
              correoProcesado = true;
              break; 
            } else {
              sheet.getRange(i + 1, idx.estado + 1).setValue("Error: Importe Incorrecto"); 
              sheet.getRange(i + 1, idx.importe + 1).setValue(totalPagadoHastaAhora); 
              enviarCorreoInvitacionReintento(emailCliente, nombreClienteForm, (config.precio - totalPagadoHastaAhora).toFixed(2), config.nombrePestana);
              correoProcesado = true; 
              break;
            }
          }
        }
      }
    }
    if (correoProcesado) { hilos[h].markRead(); hilos[h].moveToArchive(); } else { hilos[h].markRead(); }
  }
}



// =================================================================================
// FASE 3: EL MOTOR DE REVELADO E INTEGRACIÓN GEMINI (PACK EXPRESS / PRUEBAS)
// =================================================================================

function ejecutarReveladoGemini(sheet, filaIndex, emailCliente, estiloElegido, fileIdsRaw) {
  const nombrePestana = sheet.getName().trim().toUpperCase();
  // Col H (8) = Estado en PACK EXPRESS | Col F (6) = Estado en PRUEBA GRATIS / Form responses
  const colEstado = (nombrePestana === "PACK EXPRESS") ? 8 : 6;

  try {
    let fileIds = Array.isArray(fileIdsRaw) ? fileIdsRaw : (fileIdsRaw ? fileIdsRaw.toString().split(",") : []);
    
    // Extraemos los IDs de Drive limpiamente sin que los guiones bajos del ID bucleen o rompan el script
    fileIds = fileIds.map(id => extraerIdDrive(id.trim())).filter(id => id !== "");

    if (!fileIds.length) {
      console.error(`❌ No se encontraron IDs de fotos válidos en la fila ${filaIndex}`);
      sheet.getRange(filaIndex, colEstado).setValue("Error: Sin Fotos");
      return null;
    }

    if (!estiloElegido || !ESTILOS_PROMPT[estiloElegido]) {
      estiloElegido = "Cinematic Drama";
    }

    let carpetaRaiz = DriveApp.getFolderById(CARPETA_RAIZ_ID.trim());
    let carpetaCliente;
    const carpetasExistentes = carpetaRaiz.getFoldersByName(emailCliente);
    
    if (carpetasExistentes.hasNext()) {
      carpetaCliente = carpetasExistentes.next();
    } else {
      carpetaCliente = carpetaRaiz.createFolder(emailCliente);
      carpetaCliente.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }

    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) {
      console.error("🔴 ERROR: No existe la propiedad 'GEMINI_API_KEY' en la configuración del script.");
      sheet.getRange(filaIndex, colEstado).setValue("Error Gemini");
      return null;
    }

    const BlackboxPrompt = ESTILOS_PROMPT[estiloElegido];
    
    let promptFinal = `Mejora esta foto: ${BlackboxPrompt}. Devuelve la imagen editada correspondiente.`;
    
    if (nombrePestana === "PRUEBA GRATIS") {
      promptFinal += ` CRÍTICO: Añade obligatoriamente una marca de agua de texto distribuida en un patrón de varias líneas diagonales y paralelas repetidas de forma oblicua por toda la superficie de la imagen. Cada línea debe mostrar de forma idéntica, nítida y perfectamente deletreada el siguiente texto exacto en letras MAYÚSCULAS y SIN ACENTOS: "EL ALBUM B - PRUEBA GRATIS". Asegúrate de que los caracteres estén bien impresos en tipografía clara y sin deformaciones. El patrón de líneas debe ser translúcido y sutil pero perfectamente legible sobre la fotografía para proteger los derechos de autor.`;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${apiKey}`;

    let fotosOk = 0;
    let fotosError = 0;

    for (let i = 0; i < fileIds.length; i++) {
      const fileId = fileIds[i];
      try {
        const archivoOriginal = DriveApp.getFileById(fileId);
        const blob = archivoOriginal.getBlob();
        const base64Image = Utilities.base64Encode(blob.getBytes());
        const mimeType = blob.getContentType();

        const payload = {
          contents: [{
            parts: [
              { text: promptFinal },
              { inlineData: { mimeType: mimeType, data: base64Image } }
            ]
          }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
          safetySettings: [
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" }
          ]
        };

        const options = {
          method: "post",
          contentType: "application/json",
          payload: JSON.stringify(payload),
          muteHttpExceptions: true
        };

        let json;
        let intentos = 0;
        const MAX_INTENTOS = 3;
        let llamadaExitosa = false;

        while (intentos < MAX_INTENTOS && !llamadaExitosa) {
          const response = UrlFetchApp.fetch(url, options);
          json = JSON.parse(response.getContentText());

          if (json.error && (json.error.code === 503 || json.error.code === 429)) {
            intentos++;
            Utilities.sleep(intentos * 4000);
          } else {
            llamadaExitosa = true;
          }
        }

        if (json.error) {
          console.error(`🔴 ERROR DE API GEMINI EN FOTO ${i+1}: ` + JSON.stringify(json.error));
          fotosError++;
          continue;
        }

        const parts = json.candidates && json.candidates[0].content.parts;
        const imagePart = parts ? parts.find(p => p.inlineData) : null;

        if (imagePart) {
          const imageData = imagePart.inlineData;
          const nombreBase = `${estiloElegido.replace(/\s+/g, '_')}_${i + 1}_${archivoOriginal.getName()}`;
          const nombreModificado = nombreBase.replace("Kairos Art", "elAlumB");

          const imagenMejoradaBlob = Utilities.newBlob(
            Utilities.base64Decode(imageData.data),
            imageData.mimeType,
            nombreModificado
          );
          carpetaCliente.createFile(imagenMejoradaBlob);
          fotosOk++;
          console.log(`✅ Foto ${i+1} procesada y guardada con éxito por la IA.`);
        } else {
          console.error(`🔴 DETALLE: Gemini respondió con texto pero NO generó una imagen.`);
          if (parts && parts[0] && parts[0].text) {
            console.warn(`💬 Mensaje de texto devuelto por Gemini: "${parts[0].text}"`);
          }
          fotosError++;
        }

        if (i < fileIds.length - 1) Utilities.sleep(2000);

      } catch (err) {
        console.error(`🔴 ERROR PROCESANDO FOTO INDIVIDUAL ${i+1}: ` + err.toString());
        fotosError++;
      }
    }

    if (fotosOk > 0) {
      const urlCarpeta = carpetaCliente.getUrl();
      
      if (nombrePestana === "PACK EXPRESS") {
        const asuntoEntrega = "✨ ¡Tu Galería Express está lista! - El Álbum B";
        const cuerpoEntrega = `
          <p>¡Buenas noticias! Tu pago ha sido verificado y tus fotos ya han salido de la mesa de revelado.</p>
          <p>Puedes verlas y descargarlas a máxima calidad en tu carpeta personalizada de Drive de El Álbum B:</p>
          <p><a href="${urlCarpeta}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;"> Ver Mis Fotos Editadas</a></p>
          <p>⚠️ <b>Importante:</b> Por motivos de privacidad y almacenamiento, esta carpeta se eliminará automáticamente en <b>15 días</b>. Asegúrate de guardarlas antes de esa fecha.</p>
          <p>¡Muchísimas gracias por confiar en El Álbum B!</p>
        `;
        GmailApp.sendEmail(emailCliente, asuntoEntrega, "", { htmlBody: cuerpoEntrega });
        sheet.getRange(filaIndex, colEstado).setValue("Entregado");
      } else if (nombrePestana === "PRUEBA GRATIS") {
        sheet.getRange(filaIndex, colEstado).setValue("Procesado IA");
      }
      return urlCarpeta;
    } else {
      sheet.getRange(filaIndex, colEstado).setValue("Error Gemini");
      return null;
    }

  } catch (error) {
    console.error("🔴 ERROR CRÍTICO EN MOTOR: " + error.toString());
    sheet.getRange(filaIndex, colEstado).setValue("Error Crítico");
    return null;
  }
}


// =================================================================================
// PROMO: MOTOR PARA 1 SOLA FOTO GRATIS (FORMULARIO PRUEBA GRATIS)
// =================================================================================

function ejecutarPruebaGratis(e) {
  const sheet = e.range.getSheet();
  const fila = e.range.getRow();
  const datos = sheet.getRange(fila, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Columnas reales PRUEBA GRATIS:
  // A(0)=Timestamp | B(1)=Email | C(2)=Estilo | D(3)=Aviso | E(4)=Foto | F(5)=Estado
  const emailCliente  = datos[1] ? datos[1].toString().trim().toLowerCase() : "";
  const estiloElegido = datos[2] ? datos[2].toString().trim() : "";
  const urlFotoRaw    = datos[4] ? datos[4].toString().trim() : "";

  console.log(`🎁 PRUEBA GRATIS recibida — email: ${emailCliente} | estilo: ${estiloElegido} | foto: ${urlFotoRaw}`);

  if (!emailCliente || !urlFotoRaw) {
    console.log("⚠️ Datos incompletos en la fila de la promoción.");
    sheet.getRange(fila, 6).setValue("Error: Datos incompletos");
    return;
  }

  // ✅ FIX anti-abuso: solo buscar si hay filas previas con datos (fila > 2 Y al menos 1 fila de datos)
  if (fila > 2) {
    const numFilasPrevias = fila - 2; // filas entre cabecera y la actual
    if (numFilasPrevias > 0) {
      const rangoEmails = sheet.getRange(2, 2, numFilasPrevias, 1).getValues().flat();
      const emailsProcesados = rangoEmails.map(item => item.toString().trim().toLowerCase()).filter(Boolean);
      if (emailsProcesados.includes(emailCliente)) {
        sheet.getRange(fila, 6).setValue("Bloqueado: Ya pidió prueba");
        console.log(`🛑 Intento de abuso bloqueado para: ${emailCliente}`);
        enviarCorreoBloqueado(emailCliente);
        return;
      }
    }
  }

  sheet.getRange(fila, 6).setValue("Procesando");
  SpreadsheetApp.flush();

  try {
    const fileId = extraerIdDeUrlDrive(urlFotoRaw);
    if (!fileId) throw new Error("No se pudo extraer la ID de la imagen");

    console.log(`🎁 Procesando 1 foto gratis para [${emailCliente}] con estilo [${estiloElegido}]`);

    const urlCarpetaCliente = ejecutarReveladoGemini(sheet, fila, emailCliente, estiloElegido, fileId);

    if (urlCarpetaCliente) {
      enviarCorreoPromoGratis(emailCliente, urlCarpetaCliente);
      sheet.getRange(fila, 6).setValue("Prueba Entregada 🎉");
      console.log(`✨ Prueba gratis enviada con éxito a: ${emailCliente}`);
    }

  } catch (error) {
    console.error("❌ Error en la prueba gratis: " + error);
    sheet.getRange(fila, 6).setValue("Error: " + error.message);
  }
}


function enviarCorreoPromoGratis(emailDestinatario, urlCarpetaCliente) {
  const asunto = "¡Aquí tienes tu prueba gratis de El Álbum B!";
  const urlFormularioPago = "https://forms.gle/ctMuhsF4sLuLrw4k6"; 

  const cuerpoHTML = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eeeeee; border-radius: 10px;">
      <h2 style="color: #2c3e50; text-align: center; margin-bottom: 25px;"> ¡Tu revelado de El Álbum B está listo!</h2>
      <p>¡Hola!</p>
      <p>Muchas gracias por probar nuestro sistema de revelado analógico con IA. Hemos procesado la foto que nos enviaste aplicando el estilo que elegiste.</p>
      <p>Puedes ver y descargar tu foto totalmente gratis haciendo clic en el siguiente botón verde:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${urlCarpetaCliente}" style="background-color: #2ecc71; color: #ffffff; text-decoration: none; padding: 15px 30px; font-size: 18px; font-weight: bold; border-radius: 5px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          VER MI FOTO EDITADA
        </a>
      </div>
      <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #3498db;">
        <h3 style="color: #2980b9; margin-top: 0;">⚡ ¿Te ha gustado el resultado? No lo dejes a medias</h3>
        <p style="margin-bottom: 20px;">Esto ha sido solo una pequeña muestra con una sola foto. No dejes que los mejores recuerdos se queden olvidados en el carrete del móvil sin el acabado profesional que se merecen.</p>
        <p>Por solo <b>4,99 €</b>, puedes subir <b>todas las fotos de tu álbum</b> y nuestro motor las revelará al completo con este mismo estilo premium.</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="${urlFormularioPago}" style="color: #3498db; font-weight: bold; text-decoration: underline; font-size: 16px;">
            Quiero revelar mi álbum completo por 4,99 €
          </a>
        </div>
      </div>
      <p style="font-size: 12px; color: #7f8c8d; text-align: center; margin-top: 30px;">
        El Álbum B - Revelado Inteligente de Fotografía.<br>
        <em>Nota: Tu carpeta temporal de prueba gratis estará disponible durante 15 días.</em>
      </p>
    </div>
  `;

  GmailApp.sendEmail(emailDestinatario, asunto, "", { htmlBody: cuerpoHTML });
}

function enviarCorreoBloqueado(emailDestinatario) {
  const asunto = "¡Vaya! Ya has disfrutado de tu prueba gratis - El Álbum B";
  const urlFormularioPago = "https://forms.gle/ctMuhsF4sLuLrw4k6"; 
  
  const cuerpoHTML = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #e74c3c;">¡Hola!</h2>
      <p>Hemos recibido una nueva solicitud de revelado gratuito para esta cuenta de correo electrónico.</p>
      <p>Sin embargo, nuestro sistema ha detectado que <strong>ya has disfrutado de una prueba gratuita anteriormente</strong>.</p>
      <p>Para garantizar que todo el mundo pueda probar la experiencia de nuestro revelado analógico con IA, la promoción está estrictamente limitada a <strong>una sola foto gratis por usuario</strong>.</p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
      
      <h3 style="color: #2c3e50;">⚡ ¿Te quedaste con ganas de más?</h3>
      <p>¡No dejes tus mejores recuerdos olvidados en el carrete del móvil! Por solo <strong>4,99 €</strong>, puedes subir todas las fotos de tu viaje o evento y nuestro motor las revelará al completo con calidad premium.</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="${urlFormularioPago}" style="background-color: #27ae60; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
          Quiero revelar mi álbum completo por 4,99 €
        </a>
      </p>
      
      <p style="font-size: 0.85em; color: #7f8c8d; text-align: center; margin-top: 40px;">
        El Álbum B - Revelado Inteligente de Fotografía.
      </p>
    </div>
  `;
  
  GmailApp.sendEmail(emailDestinatario, asunto, "", { htmlBody: cuerpoHTML });
}


/**
 * Función para limpiar automáticamente los registros bloqueados de la prueba gratis.
 * Se ejecutará cada hora mediante un disparador de tiempo.
 */
function limpiarRegistrosBloqueadosPruebaGratis() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("PRUEBA GRATIS");
  
  if (!sheet) return; // Si no existe la pestaña, no hacemos nada

  const datos = sheet.getDataRange().getValues();
  // El estado está en la columna F, que es el índice 5 (0=A, 1=B, 2=C, 3=D, 4=E, 5=F)
  const COL_ESTADO = 5; 
  
  // Recorremos las filas desde abajo hacia arriba para poder borrar sin alterar los índices de las filas superiores
  for (let i = datos.length - 1; i >= 1; i--) {
    const estado = datos[i][COL_ESTADO] ? datos[i][COL_ESTADO].toString().trim() : "";
    
    if (estado === "Bloqueado: Ya pidió prueba") {
      sheet.deleteRow(i + 1); // deleteRow es 1-indexed (la fila 1 es la 1)
      console.log(`🧹 Registro bloqueado eliminado en la fila ${i + 1}`);
    }
  }
}

// FIN PROMO: MOTOR PARA 1 SOLA FOTO GRATIS (FORMULARIO PRUEBA GRATIS)


// =================================================================================
// UTILIDADES Y LIMPIEZA
// =================================================================================
function letraAIndice(letra) {
  let base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let num = 0;
  letra = letra.toUpperCase().trim();
  for (let i = 0; i < letra.length; i++) {
    num = num * 26 + (base.indexOf(letra[i]) + 1);
  }
  return num - 1; 
}

function normalizarTextoLegacy(texto) {
  if (!texto) return "";
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, ""); 
}

function generarHashAlfanumerico(longitud) {
  let resultado = '';
  let caracteres = '0123456789ABCDEF';
  for (let i = 0; i < longitud; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
}

function extraerIdDrive(urlOId) {
  const coincidencia = urlOId.match(/[-\w]{25,}(?!.*[-\w]{25,})/);
  return coincidencia ? coincidencia[0] : urlOId;
}

function extraerIdDeUrlDrive(url) {
  if (url.includes('/d/')) return url.split('/d/')[1].split('/')[0];
  if (url.includes('id=')) return url.split('id=')[1].split('&')[0];
  return url.trim();
}


/**
 * Realiza una limpieza automatizada y selectiva de archivos y carpetas en Google Drive.
 * 
 * LOGICA DE FUNCIONAMIENTO:
 * 1. Define una lista de carpetas "raíz" seguras que nunca serán eliminadas.
 * 2. Calcula una fecha límite (15 días de antigüedad desde hoy).
 * 3. Recorre de forma recursiva (profunda) el contenido de las carpetas raíz.
 * 4. Para cada archivo:
 *    - Si su fecha de última modificación es anterior a la fecha límite, lo mueve a la papelera.
 * 5. Para cada subcarpeta:
 *    - Si al finalizar la limpieza de sus archivos internos queda vacía, la elimina.
 * 6. Reporta el resultado total de archivos y carpetas eliminados vía email.
 */

function limpiarCarpetasSeleccionadasConReporte() {
  const carpetasRaizALimpiar = [
    "1qTcREG-ebMeKcjtOHI-nA2y4UEwM69RK", // EVENTOS ACTIVOS
    "1iYNK-3rFyXVysONlVf9VhIa0nvWbS8Es", // EVENTOS
    "1si9vyULBO5C4encWGX0814F8CdeePtqo1VaDoPKhz-4JA4IDNVQ4L610cW6bUDrhYVdzo5wW", //  Pack Express
    "1_je93_U_SHcpeEz96NO9v8LSNmzO7qqfBLjWChvl3AxfAVVDbqNbrBvPqGl6pxvmF03aBH0_", // PRUEBA GRATIS
    "17aA-10hZDrc4RtnDaLZRTnEJBXw92YKe" // CLIENTES
  ];
  
  const DIAS_DE_VIDA = 15;
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - DIAS_DE_VIDA);
  
  let informe = { html: "<h2>🧹 Informe de Limpieza Profunda</h2>", total: 0 };

  carpetasRaizALimpiar.forEach(id => {
    try {
      const carpeta = DriveApp.getFolderById(id);
      recursivaLimpiar(carpeta, fechaLimite, informe);
    } catch (e) {
      informe.html += `<p style="color:red;">Error en raíz ${id}: ${e.message}</p>`;
    }
  });

  if (informe.total > 0) {
    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: `🧹 Limpieza completada: ${informe.total} items eliminados`,
      htmlBody: informe.html
    });
  }
}

/**
 * Función recursiva que entra en carpetas, borra archivos viejos
 * y elimina la carpeta si al final queda vacía.
 */
function recursivaLimpiar(carpeta, fechaLimite, informe) {
  // 1. Limpiar subcarpetas primero (recursividad)
  const subCarpetas = carpeta.getFolders();
  while (subCarpetas.hasNext()) {
    const subCarpeta = subCarpetas.next();
    recursivaLimpiar(subCarpeta, fechaLimite, informe);
  }

  // 2. Limpiar archivos en la carpeta actual
  const archivos = carpeta.getFiles();
  let archivosEnCarpeta = 0;
  
  while (archivos.hasNext()) {
    const archivo = archivos.next();
    if (archivo.getLastUpdated() < fechaLimite) {
      archivo.setTrashed(true);
      informe.html += `<li>Eliminado archivo: ${archivo.getName()}</li>`;
      informe.total++;
    } else {
      archivosEnCarpeta++;
    }
  }

  // 3. Si la carpeta está vacía y NO es una de las raíces principales, se borra
  // NOTA: No borramos las carpetas raíces que pusiste en la lista, solo las subcarpetas
  const esRaiz = [/* Pega aquí los IDs de tus raíces para protegerlas */].includes(carpeta.getId());
  
  if (archivosEnCarpeta === 0 && !carpeta.getFolders().hasNext() && !esRaiz) {
    informe.html += `<li><b>Eliminada carpeta vacía: ${carpeta.getName()}</b></li>`;
    carpeta.setTrashed(true);
  }
}

function enviarCorreoInvitacionReintento(email, nombre, restante, pack) {
  GmailApp.sendEmail(email, "Falta pago restante", "", { htmlBody: `<p>Faltan ${restante} € para activar el pack ${pack}.</p>` });
}