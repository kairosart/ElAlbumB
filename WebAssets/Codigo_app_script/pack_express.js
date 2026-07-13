// @ts-nocheck
// =================================================================================
// CONFIGURACIÓN GLOBAL (Ajusta estos datos si cambias de carpeta o modelo)
// =================================================================================

const CARPETA_RAIZ_ID = "17aA-10hZDrc4RtnDaLZRTnEJBXw92YKe";
const MODELO = "gemini-2.5-flash-image";

// ⚠️ El asunto que lee MacroDroid (ej: si en MacroDroid pusiste "Bizum", aquí se queda igual)
const ASUNTO_EMAIL_BIZUM = "Bizum";
// ⚠️ Tu número de teléfono real para las instrucciones del correo
const TELEFONO_BIZUM = "634404631";

const ESTILOS_PROMPT = { 
  "Cinematic Drama": "Aplica una iluminación cinematográfica impecable y clara sobre los sujetos o el sujeto principal usando una luz ámbar cálida y direccional que ilumine los rostros presentes con total nitidez y resalte de forma brillante los detalles de las vestimentas y atuendos. El cielo crepuscular debe ser el protagonista con un degradado de alto contraste, limpio y completamente suave, transitando de un azul cian/turquesa intenso en la parte superior a un tono naranja dorado en el horizonte, totalmente libre de ruido digital o granulado. El paisaje y el entorno deben mantener tonos oscuros, ricos y texturizados, logrando una toma pulida, nítida y perfectamente expuesta.",

  "Nostalgia Film": "Post-procesamiento fotográfico avanzado para imitar una película analógica de la era de los 70s de alta fidelidad. Aplica una reiluminación frontal técnica utilizando un softbox grande con un filtro de ámbar cálido invisible para equilibrar la exposición de los sujetos o el sujeto principal, revelando detalles nítidos y luminosidad en los rostros presentes, los encajes, texturas y detalles de los atuendos, pero con un tinte sepia. Ejecuta una reducción de ruido agresiva seguida de una reconstrucción facial de alta resolución. Reemplaza el degradado del cielo por un degradado desvaído y melancólico de ámbar/sepia y dorado, con una viñeta suave. Añade un grano de película orgánico, denso y visible en toda la toma.",

  "Vogue Chic": "ANULA EL CONTRALUZ POR COMPLETO. Reilumina a los sujetos o al sujeto principal con flashes de estudio potentes, frontales y brillantes. Los rostros presentes deben ser BRILLANTES, COMPLETAMENTE CLAROS y VISIBLES en alta resolución, sin rastro de silueta o sombra oscura. Recupera y muestra nítidamente el detalle de las texturas, encajes y colores de las vestimentas. Mantén el cielo crepuscular y el entorno idénticos, pero las personas presentes deben estar expuestas como en una sesión de estudio diurna, nítida, pulida y sin ruido digital.",

  "Magic Wonderland": "Aísla a los sujetos o al sujeto principal y colócalos en un bosque nocturno místico.",

  "Finca Cristalina": "Aísla a los sujetos o al sujeto principal de esta foto manteniendo la silueta intacta y reemplaza el fondo por completo. El nuevo fondo debe ser un paisaje idílico de colinas verdes y doradas, muy suaves, limpias y onduladas de estilo cinematográfico, bajo un cielo despejado durante el atardecer (golden hour) con el sol poniente iluminando desde un lateral. Crucial: Aplica una reiluminación cálida sobre las personas o la persona presente para eliminar el contraluz oscuro original, haciendo que la luz dorada impacte de forma natural en los rostros y la vestimenta.",

  "Bohemio Orgánico": "Aplica un procesamiento puramente limpio y orgánico con una paleta de colores tierra, ocres y verdes apagados. Reilumina al sujeto principal de forma sutil con una luz difusa y suave, realzando con nitidez extrema pero suavidad sedosa las texturas mate de la ropa (como lino o lana) y los rasgos faciales. Las sombras deben ser suaves, profundas pero completamente limpias, sin rastro de artefactos. El acabado general debe ser de alta resolución y pureza cromática, eliminando radicalmente cualquier rastro de ruido digital, grano de película o artefactos de compresión, asegurando superficies completamente lisas y pulidas, especialmente en los degradados del fondo.",

  "Ruta Vintage": "Estilo cinematográfico de carretera clásica. Introduce una iluminación lateral baja y dorada que emule un atardecer en el asfalto, haciendo que la luz barra los rostros con total claridad y genere reflejos limpios e intensos en cualquier superficie metálica, cromada o de cuero visible. Aplica una paleta cromática de alto contraste basada en tonos verdes botella, amarillos tostados y negros densos. Ejecuta una reducción de ruido agresiva en los sujetos principales mediante reconstrucción facial de alta fidelidad, manteniendo un microcontraste nítido.",

  "Elegancia Monocroma": "Conversión digital pura a blanco y negro de estilo bellas artes de ultra-alta resolución, con un acabado completamente limpio y pulido. Elimina por completo la información de color y maximiza el rango dinámico para obtener negros profundos y ricos y blancos luminosos pero controlados, sin rastro de artefactos. Reilumina los rostros presentes con una luz clave frontal-lateral nítida y brillante que esculpa las facciones con definición milimétrica, destacando la claridad de los ojos y los detalles minuciosos de las vestimentas en alta resolución. Aplica una reducción de ruido agresiva y una reconstrucción facial de alta fidelidad, asegurando que los degradados de la piel y el fondo sean ultrasuaves, lisos y sedosos, totalmente libres de grano digital o rugosidad.",

  "Cyber Noir": "Aplica una reiluminación digital purista, pulida y de ultra-alta definición, enfocada en la visibilidad cristalina absoluta de los rostros presentes. *No debe haber haces físicos de luz, rayos ni efectos atmospheric (niebla, lluvia) que oscurezcan, tapen o cubran las caras.* En su lugar, aplica una iluminación puramente cromática: los rostros presentes deben estar esculpidos y definidos por lavados nítidos y limpios de luz de neón cian y magenta, asegurando que los ojos, la expresión y los detalles de las facciones sigan siendo perfectamente visibles, luminosos y con nitidez milimétrica. Recupera y muestra nítidamente el detalle de las vestimentas en alta resolución. Ejecuta una reducción de ruido ultra-agresiva, reconstructiva y de limpieza cromática total, logrando superficies inmaculadas, ultrasuaves, lisas como un espejo y totalmente libres de grano digital, rugosidad o artefactos en toda la toma, especialmente en el fondo que debe mostrar un bokeh suave, limpio y puro de luces de la ciudad.",

  "Aura Ancestral": "Aísla al sujeto o sujetos principales conservando su silueta con precisión absoluta y colócalos frente a una imponente fachada de piedra antigua o muros históricos texturizados bajo una luz de tormenta dramática. Modifica la iluminación original de los sujetos aplicando una luz cenital suave que aclare los rostros y resalte las vestimentas en alta resolución. El fondo debe tener tonos grises, plomizos y verdes oscuros con una niebla baja y limpia que aporte profundidad, manteniendo un contraste pulido.",

  // BAUTIZOS
  "Bautizo Pureza angelical": "Una fotografía fotorrealista y cinemática de una ceremonia de bautismo en una iglesia de piedra medieval, basada en image_2.png. En el centro, una madre sonriente con una blusa beige sostiene a un bebé vestido con un faldón de cristianar blanco sobre una pila bautismal de piedra tallada. Un sacerdote de pie a la derecha, con vestiduras blancas y doradas, vierte agua de una jarra de plata sobre la cabeza del bebé. Dos hombres con chaquetas azules oscuras están detrás de la madre, uno con la mano en su hombro. Una pequeña multitud de familiares vestidos formalmente se sienta en bancos de madera al fondo, a la izquierda. La escena está bañada por una luz natural cálida y celestial que entra a través de una vidriera visible al fondo, proyectando rayos de luz de arco iris definidos y nítidos (god rays o crepuscular rays) a través de las partículas de polvo y sobre la arquitectura de piedra. Un anillo de luz de arco iris (areola) rodea el chorro de agua vertido y la cabeza del bebé, con una paloma blanca radiante y perfectamente definida emergiendo justo encima. El enfoque es nítido y detallado, capturando texturas y expresiones faciales con claridad, eliminando el desenfoque brumoso. La composición es limpia y equilibrada.",

  "Bautizo Jardín Secreto": "Aplica un post-procesamiento fotográfico de estilo natural (Nature & Bloom) sobre la escena. Realza el entorno con tonos verdes orgánicos y vivos, simulando una luz solar de mañana filtrada sutilmente a través de las hojas de los árboles. Crea un efecto de desenfoque de fondo (bokeh de jardín) suave y romántico con sutiles detalles florales, manteniendo un enfoque ultra nítido y perfectamente expuesto en el sujeto principal.",

  "Bautizo Retrato Clásico Atemporal": "Transforma la imagen en un retrato de estudio artístico de alta fidelidad (Fine Art). Sustituye o adapta el fondo hacia tonalidades neutras y limpias, aplicando una iluminación lateral suave que marque los volúmenes del rostro y la vestimenta de forma elegante y sin sombras duras. Utiliza una paleta cromática de alta definición basada en tonos monocromáticos cálidos o un sutil toque sepia clásico, enfocando de manera impecable la expresión y los detalles de los rostros presentes.",

  "Bautizo Celebración Cálida": "Aplica una correction de color profesional de estilo documental cinematográfico (Candid Moment) enfocada en capturar la emoción de los protagonistas y la interacción familiar. Introduce una reiluminación cálida y envolvente de tipo hora dorada (golden hour), con el sol poniente iluminando de forma natural. Los colores deben ser vibrantes, ricos y perfectamente equilibrados, transmitiendo alegría y calidez familiar, logrando una toma pulida, nítida y libre de granulado digital."
};






// =================================================================================
// 🚦 FUNCIÓN MAESTRA: ENRUTADOR AUTOMÁTICO DE FORMULARIOS (ACTIVADOR PRINCIPAL)
// =================================================================================

function onFormSubmit(e) {
  if (!e) {
    console.error("❌ Error: Este script debe ejecutarse a través del activador automático de la hoja.");
    return;
  }

  const sheet = e.range.getSheet();
  const nombrePestana = sheet.getName().trim().toUpperCase(); 

  console.log(`📩 Formulario recibido en la pestaña real: "${sheet.getName()}" (Evaluado como: "${nombrePestana}")`);

  if (nombrePestana === "PACK EXPRESS") {
    mejorarFotoBoda(e); 
  } else if (nombrePestana === "PRUEBA GRATIS") {
    ejecutarPruebaGratis(e); 
  } else {
    console.log(`ℹ️ Formulario omitido. La pestaña "${sheet.getName()}" no requiere acciones automatizadas.`);
  }
}

// =================================================================================
// FASE 1: RECEPCIÓN DEL PEDIDO DE PAGO (FORMULARIO PACK EXPRESS)
// =================================================================================

function mejorarFotoBoda(e) {
  try {
    const sheet = e.range.getSheet();
    const fila = e.range.getRow(); 

    const emailCliente = sheet.getRange(fila, 2).getValue().toString().trim().toLowerCase(); 
    const nombreTitular = sheet.getRange(fila, 3).getValue().toString().trim(); 

    if (!emailCliente) {
      console.error(`❌ Error en fila ${fila}: No se encontró un email válido en la columna B.`);
      return;
    }

    sheet.getRange(fila, 8).setValue("Pendiente");

    const asunto = "🎨 ¡Tus fotos ya están en la mesa de revelado! - El Álbum B";
    const cuerpoHtml = `
      <p>¡Hola!</p>
      <p>Ya tenemos tus fotos en la mesa de revelado de <b>El Álbum B</b>.</p>
      <p>Para activar tu pedido de <b>4,99 €</b> y que nuestro motor de IA se ponga en marcha, realiza un Bizum al teléfono <b>${TELEFONO_BIZUM}</b>.</p>
      <p>💡 <i>No te preocupes por el concepto del Bizum. Nuestro sistema N26 reconocerá automáticamente tu ingreso cruzándolo con el nombre del titular que indicaste: <b>${nombreTitular}</b>.</i></p>
      <p>En cuanto el banco nos notifique la transferencia, tus fotos se procesarán y recibirás tu galería privada de inmediato. ¡Muchas gracias!</p>
    `;

    GmailApp.sendEmail(emailCliente, asunto, "", { htmlBody: cuerpoHtml });
    console.log(`✉️ [PACK EXPRESS] Instrucciones enviadas a ${emailCliente}. Fila: ${fila}. Estado 'Pendiente'.`);

  } catch (error) {
    console.error("💥 Error en Fase 1 (Formulario de Pago): " + error.toString());
  }
}

// =================================================================================
// FASE 2: VERIFICADOR AUTOMÁTICO DE GMAIL (CADA 5 MIN)
// =================================================================================

function revisarGmailYProcesarPedidos() {
  console.log("🔍 Escaneando Gmail en busca de notificaciones de Bizum por Nombre (N26)...");
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("PACK EXPRESS");
  const datos = sheet.getDataRange().getValues();
  const queryGmail = `is:unread subject:"${ASUNTO_EMAIL_BIZUM}"`;
  const hilos = GmailApp.search(queryGmail, 0, 10);
  
  if (hilos.length === 0) {
    console.log("☕ Sin nuevos correos de Bizum sin leer.");
    return;
  }

  for (let h = 0; h < hilos.length; h++) {
    const mensajes = hilos[h].getMessages();
    const ultimoMensaje = mensajes[mensajes.length - 1];
    const cuerpoEmailLimpio = normalizarTexto(ultimoMensaje.getPlainBody());

    for (let i = 1; i < datos.length; i++) {
      const emailCliente = datos[i][1] ? datos[i][1].toString().trim().toLowerCase() : ""; 
      const estiloElegido = datos[i][3] ? datos[i][3].toString().trim() : ""; 
      const fileIdsRaw = datos[i][5]; 
      const nombreClienteForm = datos[i][2] ? datos[i][2].toString().trim() : ""; 
      const estado = datos[i][7] ? datos[i][7].toString().trim() : ""; 

      if (estado === "Pendiente" && nombreClienteForm !== "") {
        const nombreClienteLimpio = normalizarTexto(nombreClienteForm);

        if (cuerpoEmailLimpio.includes(nombreClienteLimpio)) {
          console.log(`💰 ¡Pago verificado en N26 para el titular: ${nombreClienteForm}!`);
          hilos[h].markRead();
          sheet.getRange(i + 1, 8).setValue("Procesando"); 
          SpreadsheetApp.flush();

          ejecutarReveladoGemini(sheet, i + 1, emailCliente, estiloElegido, fileIdsRaw);
          break;
        }
      }
    }
  }
}

// =================================================================================
// FASE 3: EL MOTOR DE REVELADO E INTEGRACIÓN (CUMPLIMIENTO DE PEDIDOS)
// =================================================================================

function ejecutarReveladoGemini(sheet, filaIndex, emailCliente, estiloElegido, fileIdsRaw) {
  const nombrePestana = sheet.getName().trim().toUpperCase();
  const colEstado = (nombrePestana === "PRUEBA GRATIS") ? 6 : 8;

  try {
    let fileIds = Array.isArray(fileIdsRaw) ? fileIdsRaw : (fileIdsRaw ? fileIdsRaw.toString().split(",") : []);
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
    
    let promptFinal = `Mejora esta foto de boda: ${BlackboxPrompt}. Devuelve la imagen editada correspondiente.`;
    
    // 🛠️ MODIFICACIÓN OPTIMIZADA: Texto en Mayúsculas, sin acentos y con orden estricto de tipografía para evitar fallos de renderizado de la IA
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
        } else {
          console.error(`🔴 DETALLE: Gemini respondió con texto pero NO generó una imagen.`);
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
      
      if (nombrePestana !== "PRUEBA GRATIS") {
        const asuntoEntrega = "✨ ¡Tu Galería Express está lista! - El Álbum B";
        const cuerpoEntrega = `
          <p>¡Buenas noticias! Tu pago ha sido verificado y tus fotos ya han salido de la mesa de revelado.</p>
          <p>Puedes verlas y descargarlas a máxima calidad en tu carpeta personalizada de Drive de El Álbum B:</p>
          <p><a href="${urlCarpeta}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">👉 Ver Mis Fotos Editadas</a></p>
          <p>⚠️ <b>Importante:</b> Por motivos de privacidad y almacenamiento, esta carpeta se eliminará automáticamente en <b>15 días</b>. Asegúrate de guardarlas antes de esa fecha.</p>
          <p>¡Muchísimas gracias por confiar en El Álbum B!</p>
        `;
        GmailApp.sendEmail(emailCliente, asuntoEntrega, "", { htmlBody: cuerpoEntrega });
        sheet.getRange(filaIndex, colEstado).setValue("Entregado");
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

  const emailCliente = datos[1] ? datos[1].toString().trim().toLowerCase() : ""; 
  const estiloElegido = datos[2] ? datos[2].toString().trim() : ""; 
  const urlFotoRaw = datos[4] ? datos[4].toString().trim() : ""; 

  if (!emailCliente || !urlFotoRaw) {
    console.log("⚠️ Datos incompletos en la fila de la promoción.");
    return;
  }

  if (fila > 2) {
    const rangoEmails = sheet.getRange(2, 2, fila - 2, 1).getValues().flat();
    const emailsProcesados = rangoEmails.map(item => item.toString().trim().toLowerCase());
    if (emailsProcesados.includes(emailCliente)) {
      sheet.getRange(fila, 6).setValue("Bloqueado: Ya pidió prueba"); 
      console.log(`🛑 Intento de abuso bloqueado para: ${emailCliente}`);
      enviarCorreoBloqueado(emailCliente);
      return;
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

// =================================================================================
// FUNCIONES AUXILIARES Y HERRAMIENTAS DE LIMPIEZA DE TEXTO
// =================================================================================

function extraerIdDrive(urlOId) {
  if (!urlOId) return "";
  const regExp = /[-\w]{25,}(?!.*[-\w]{25,})/;
  const coincidencia = urlOId.match(regExp);
  return coincidencia ? coincidencia[0] : urlOId;
}

function extraerIdDeUrlDrive(url) {
  const enlaceLlimpio = url.split(",")[0].trim();
  const match = enlaceLlimpio.match(/[\w_-]{25,}/);
  return match ? match[0] : null;
}
function normalizarTexto(texto) {
  if (!texto) return "";
  return texto.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^a-z0-9 ]/g, ""); 
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

function limpiarCarpetasCaducadas() {
  console.log("🧹 Iniciando limpieza diaria...");
  const DIAS_DE_VIDA = 15;
  const carpetaRaiz = DriveApp.getFolderById(CARPETA_RAIZ_ID.trim());
  const carpetas = carpetaRaiz.getFolders();
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - DIAS_DE_VIDA);
  
  while (carpetas.hasNext()) {
    const carpeta = carpetas.next();
    if (carpeta.getDateCreated() < fechaLimite) {
      console.log(`🗑️ Eliminando carpeta caducada de: ${carpeta.getName()}`);
      carpeta.setTrashed(true);
    }
  }
}


// =================================================================================
// 🎨 FUNCIÓN ESPECIAL: CREAR MUESTRARIO CON TODOS LOS ESTILOS (MANUAL)
// =================================================================================

/**
 * Función de control para ejecutar desde el editor.
 * Rellena la URL y el nombre/email, y dale a "Ejecutar" en la barra superior.
 */
function ejecutarMuestrarioManual() {
  // ⚠️ CONFIGURA ESTOS DOS DATOS ANTES DE EJECUTAR
  const urlFotoOriginal = "https://drive.google.com/file/d/1nrmVxHfUhk9mSbSaaRB-PJRh3e_BnWwe/view?usp=drive_link"; 
  const identificadorCarpeta = "Portfolio_Bautizos"; // Nombre para la carpeta
  
  generarTodosLosEstilos(urlFotoOriginal, identificadorCarpeta);
}

function generarTodosLosEstilos(urlFoto, nombreCarpeta) {
  try {
    const fileId = extraerIdDeUrlDrive(urlFoto);
    if (!fileId) {
      console.error("❌ Error: No se pudo extraer el ID de la URL proporcionada.");
      return;
    }

    // 1. Preparar la carpeta de destino
    let carpetaRaiz = DriveApp.getFolderById(CARPETA_RAIZ_ID.trim());
    let carpetaMuestrario;
    const carpetasExistentes = carpetaRaiz.getFoldersByName(nombreCarpeta);
    
    if (carpetasExistentes.hasNext()) {
      carpetaMuestrario = carpetasExistentes.next();
    } else {
      carpetaMuestrario = carpetaRaiz.createFolder(nombreCarpeta);
      carpetaMuestrario.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }

    // 2. Verificar API Key y obtener la foto original
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) {
      console.error("🔴 ERROR: No existe la clave API de Gemini.");
      return;
    }

    const archivoOriginal = DriveApp.getFileById(fileId);
    const blob = archivoOriginal.getBlob();
    const base64Image = Utilities.base64Encode(blob.getBytes());
    const mimeType = blob.getContentType();
    const urlLlamada = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${apiKey}`;

    // 3. Extraer SOLO los estilos de bautizos
    const listaEstilos = Object.keys(ESTILOS_PROMPT).filter(estilo => 
      estilo.toLowerCase().includes('bautizo')
    );

    if (listaEstilos.length === 0) {
      console.warn("⚠️ No se encontró ningún estilo que contenga la palabra 'bautizo' en ESTILOS_PROMPT.");
      return;
    }

    console.log(`🚀 Iniciando generación: ${listaEstilos.length} estilos de bautizo para la foto "${archivoOriginal.getName()}"`);

    // 4. Bucle para generar cada estilo
    for (let i = 0; i < listaEstilos.length; i++) {
      const nombreEstilo = listaEstilos[i];
      const descripcionPrompt = ESTILOS_PROMPT[nombreEstilo];
      
      console.log(`⏳ Procesando [${i+1}/${listaEstilos.length}]: Estilo "${nombreEstilo}"...`);

      // Se cambia la referencia de boda a bautizo en el prompt
      const promptFinal = `Mejora esta foto de bautizo: ${descripcionPrompt}. Devuelve la imagen editada correspondiente.`;

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

      // Sistema antibloqueo (Reintentos)
      while (intentos < MAX_INTENTOS && !llamadaExitosa) {
        const response = UrlFetchApp.fetch(urlLlamada, options);
        json = JSON.parse(response.getContentText());

        if (json.error && (json.error.code === 503 || json.error.code === 429)) {
          intentos++;
          console.warn(`⚠️ Servidor saturado. Reintento ${intentos} para "${nombreEstilo}" en breve...`);
          Utilities.sleep(intentos * 5000); // Pausa progresiva
        } else {
          llamadaExitosa = true;
        }
      }

      // Procesar respuesta
      if (json.error) {
        console.error(`🔴 ERROR en estilo "${nombreEstilo}": ` + JSON.stringify(json.error));
        continue; // Salta al siguiente estilo si este falla
      }

      const parts = json.candidates && json.candidates[0].content.parts;
      const imagePart = parts ? parts.find(p => p.inlineData) : null;

      if (imagePart) {
        const imageData = imagePart.inlineData;
        const nombreArchivo = `${nombreEstilo.replace(/\s+/g, '_')}_Muestrario.jpg`;

        const imagenMejoradaBlob = Utilities.newBlob(
          Utilities.base64Decode(imageData.data),
          imageData.mimeType,
          nombreArchivo
        );
        carpetaMuestrario.createFile(imagenMejoradaBlob);
        console.log(`✅ Estilo "${nombreEstilo}" guardado con éxito.`);
      } else {
        console.error(`🔴 Gemini no devolvió imagen para el estilo "${nombreEstilo}".`);
      }

      // ⏸️ Pausa obligatoria entre fotos para no agotar la cuota de la API de Google
      if (i < listaEstilos.length - 1) {
        Utilities.sleep(4000); 
      }
    }

    console.log(`🎉 ¡Muestrario de bautizos completado! Todas las fotos están en la carpeta: ${carpetaMuestrario.getUrl()}`);

  } catch (error) {
    console.error("💥 ERROR CRÍTICO EN MUESTRARIO: " + error.toString());
  }
}