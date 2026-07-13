// Archivo Code.gs


// Archivo Backend_AlbumB.gs
// ==========================================
// CONFIGURACIÓN GLOBAL
// ==========================================
const MASTER_FOLDER_ID = "17aA-10hZDrc4RtnDaLZRTnEJBXw92YKe"; // Tu carpeta raíz de Drive

// ==========================================
// RECEPCIÓN DEL FORMULARIO DE COMPRA (doPost)
// ==========================================
function doPost(e) {
  try {
    var nombresNovios = e.parameter.nombre_cliente; 
    var emailNovios = e.paramet// @ts-nocheck
// =================================================================================
// CONFIGURACIÓN GLOBAL (Ajusta estos datos si cambias de carpeta o modelo)
// =================================================================================

const CARPETA_RAIZ_ID = "17aA-10hZDrc4RtnDaLZRTnEJBXw92YKe";
const MODELO = "gemini-2.5-flash-image";

const ASUNTO_EMAIL_BIZUM = "Bizum";
const TELEFONO_BIZUM = "634404631";

const ESTILOS_PROMPT = { 
  "Cinematic Drama": "Aplica una iluminación cinematográfica impecable y clara sobre los sujetos o el sujeto principal usando una luz ámbar cálida y direccional que ilumine los rostros presentes con total nitidez y resalte de forma brillante los detalles de las vestimentas y atuendos. El cielo crepuscular debe ser el protagonista con un degradado de alto contraste, limpio y completamente suave, transitando de un azul cian/turquesa intenso en la parte superior a un tono naranja dorado en el horizonte, totalmente libre de ruido digital o granulado. El paisaje y el entorno deben mantener tonos oscuros, ricos y texturizados, logrando una toma pulida, nítida y perfectamente expuesta.",

  "Nostalgia Film": "Post-procesamiento fotográfico avanzado para imitar una película analógica de la era de los 70s de alta fidelidad. Aplica una reiluminación frontal técnica utilizando un softbox grande con un filtro de ámbar cálido invisible para equilibrar la exposición de los sujetos o el sujeto principal, revelando detalles nítidos y luminosidad en los rostros presentes, los encajes, texturas y detalles de los atuendos, pero con un tinte sepia. Ejecuta una reducción de ruido agresiva seguida de una reconstrucción facial de alta resolución. Reemplaza el degradado del cielo por un degradado desvaído y melancólico de ámbar/sepia y dorado, con una viñeta suave. Añade un grano de película orgánico, denso y visible en toda la toma.",

  "Vogue Chic": "ANULA EL CONTRALUZ POR COMPLETO. Reilumina a los sujetos o al sujeto principal con flashes de estudio potentes, frontales y brillantes. Los rostros presentes deben ser BRILLANTES, COMPLETAMENTE CLAROS y VISIBLES en alta resolución, sin rastro de silueta o sombra oscura. Recupera y muestra nítidamente el detalle de las texturas, encajes y colores de las vestimentas. Mantén el cielo crepuscular y el entorno idénticos, pero las personas presentes deben estar expuestas como en una sesión de estudio diurna, nítida, pulida y sin ruido digital.",

  "Magic Wonderland": "Aísla a los sujetos o al sujeto principal y colócalos en un bosque nocturno místico.",

  "Finca Cristalina": "Aísla a los sujetos o al sujeto principal de esta foto manteniendo la silueta intacta y reemplaza el fondo por completo. El nuevo fondo debe ser un paisaje idílico de colinas verdes y doradas, muy suaves, limpias y onduladas de estilo cinematográfico, bajo un cielo despejado durante el atardecer (golden hour) con el sol poniente iluminando desde un lateral. Crucial: Aplica una reiluminación cálida sobre las personas o la persona presente para eliminar el contraluz oscuro original, haciendo que la luz dorada impacte de forma natural en los rostros y la vestimenta.",

  "Bohemio Orgánico": "Aplica un procesamiento puramente limpio y orgánico con una paleta de colores tierra, ocres y verdes apagados. Reilumina al sujeto principal de forma sutil con una luz difusa y suave, realzando con nitidez extrema pero suavidad sedosa las texturas mate de la ropa (como lino o lana) y los rasgos faciales. Las sombras deben ser suaves, profundas pero completamente limpias, sin rastro de artefactos. El acabado general debe ser de alta resolución y pureza cromática, eliminando radicalmente cualquier rastro de ruido digital, grano de película o artefactos de compresión, asegurando superficies completamente lisas y pulidas, especialmente en los degradados del fondo.",

  "Ruta Vintage": "Estilo cinematográfico de carretera clásica. Introduce una iluminación lateral baja y dorada que emule un atardecer en el asfalto, haciendo que la luz barra los rostros con total claridad y genere reflejos limpios e intensos en cualquier superficie metálica, cromada o de cuero visible. Aplica una paleta cromática de alto contraste basada en tonos verdes botella, amarillos tostados y negros densos. Ejecuta una reducción de ruido agresiva en los sujetos principales mediante reconstrucción facial de alta fidelidad, manteniendo un microcontraste nítido.",

  "Elegancia Monocroma": "Conversión digital pura a blanco y negro de estilo bellas artes de ultra-alta resolución, con un acabado completamente limpio y pulido. Elimina por completo la información de color y maximiza el rango dinámico para obtener negros profundos y ricos y blancos luminosos pero controlados, sin rastro de artefactos. Reilumina los rostros presentes con una luz clave frontal-lateral nítida y brillante que esculpa las facciones con definición milimétrica, destacando la claridad de los ojos y los detalles minuciosos de las vestimentas in alta resolución. Aplica una reducción de ruido agresiva y una reconstrucción facial de alta fidelidad, asegurando que los degradados de la piel y el fondo sean ultrasuaves, lisos y sedosos, totalmente libres de grano digital o rugosidad.",

  "Cyber Noir": "Aplica una reiluminación digital purista, pulida y de ultra-alta definición, enfocada en la visibilidad cristalina absoluta de los rostros presentes. *No debe haber haces físicos de luz, rayos ni efectos atmospheric (niebla, lluvia) que oscurezcan, tapen o cubran las caras.* En su lugar, aplica una iluminación puramente cromática: los rostros presentes deben estar esculpidos y definidos por lavados nítidos y limpios de luz de neón cian y magenta, asegurando que los ojos, la expresión y los detalles de las facciones sigan siendo perfectamente visibles, luminosos y con nitidez milimétrica. Recupera y muestra nítidamente el detalle de las vestimentas en alta resolución. Ejecuta una reducción de ruido ultra-agresiva, reconstructiva y de limpieza cromática total, logrando superficies inmaculadas, ultrasuaves, lisas como un espejo y totalmente libres de grano digital, rugosidad o artefactos en toda la toma, especialmente en el fondo que debe mostrar un bokeh suave, limpio y puro de luces de la ciudad.",

  "Aura Ancestral": "Aísla al sujeto o sujetos principales conservando su silueta con precisión absoluta y colócalos frente a una imponente fachada de piedra antigua o muros históricos texturizados bajo una luz de tormenta dramática. Modifica la iluminación original de los sujetos aplicando una luz cenital suave que aclare los rostros y resalte las vestimentas en alta resolución. El fondo debe tener tonos grises, plomizos y verdes oscuros con una niebla baja y limpia que aporte profundidad, manteniendo un contraste pulido.",

  // BAUTIZOS
  "Bautizo Pureza angelical": "Una fotografía fotorrealista y cinemática de una ceremonia de bautismo en una iglesia de piedra medieval, basada en image_2.png. En el centro, una madre sonriente con una blusa beige sostiene a un bebé vestido con un faldón de cristianar blanco sobre una pila bautismal de piedra tallada. Un sacerdote de pie a la derecha, con vestiduras blancas y doradas, vierte agua de una jarra de plata sobre la cabeza del bebé. Dos hombres con chaquetas azules oscuras están detrás de la madre, uno con la mano en su hombro. Una pequeña multitud de familiares vestidos formalmente se sienta en bancos de madera al fondo, a la izquierda. La escena está bañada por una luz natural cálida y celestial que entra a través de una vidriera visible al fondo, proyéctando rayos de luz de arco iris definidos y nítidos (god rays o crepuscular rays) a través de las partículas de polvo y sobre la arquitectura de piedra. Un anillo de luz de arco iris (areola) rodea el chorro de agua vertido y la cabeza del bebé, con una paloma blanca radiante y perfectamente definida emergiendo justo encima. El enfoque es nítido y detallado, capturando texturas y expresiones faciales con claridad, eliminando el desenfoque brumoso. La composición es limpia y equilibrada.",

  "Bautizo Jardín Secreto": "Aplica un post-procesamiento fotográfico de estilo natural (Nature & Bloom) sobre la escena. Realza el entorno con tonos verdes orgánicos y vivos, simulando una luz solar de mañana filtrada sutilmente a través de las hojas de los árboles. Crea un efecto de desenfoque de fondo (bokeh de jardín) suave y romántico con sutiles detalles florales, manteniendo un enfoque ultra nítido y perfectamente expuesto en el sujeto principal.",

  "Bautizo Retrato Clásico Atemporal": "Transforma la imagen en un retrato de estudio artístico de alta fidelidad (Fine Art). Sustituye o adapta el fondo hacia tonalidades neutras y limpias, aplicando una iluminación lateral suave que marque los volúmenes del rostro y la vestimenta de forma elegante y sin sombras duras. Utiliza una paleta cromática de alta definición basada en tonos monocromáticos cálidos o un sutil toque sepia clásico, enfocando de manera impecable la expresión y los detalles de los rostros presentes.",

  "Bautizo Celebración Cálida": "Aplica una correction de color profesional de estilo documental cinematográfico (Candid Moment) enfocada en capturar la emoción de los protagonistas y la interacción familiar. Introduce una reiluminación cálida y envolvente de tipo hora dorada (golden hour), con el sol poniente iluminando de forma natural. Los colores deben ser vibrantes, ricos y perfectamente equilibrados, transmitiendo alegría y calidez familiar, logrando una toma pulida, nítida y libre de granulado digital.",

  // COMUNIONES
  "Comunión Recuerdo Familiar": "Una toma fotorrealista y en primer plano de una pared de madera clásica que presenta un recuerdo familiar bellamente enmarcado. En el centro, hay un marco de fotos dorado vintage ornamentado con tallas elegantes y una sutil cruz cristiana en la parte superior. Dentro de este marco principal, muestra la imagen de foto_comunion_original.jpg con un tono sepia vintage cálido y ligeramente desaturado. Debajo del marco principal, hay una placa de latón metálica grabada que dice 'Mi Primera Comunión'. Colgando en la pared de madera junto al marco, se ve un rosario tradicional con un crucifijo de plata. A los lados, vistas parciales de otras fotografías familiares más pequeñas y antiguas en blanco y negro, en marcos de madera sencillos, completan la escena, creando una atmósfera acogedora y nostálgica. Iluminación ambiental suave y cálida.",
  
  "Comunión Fantasía": "Aísla a los sujetos o al sujeto principal y colócalos en un bosque nocturno místico, con animales y flores.",

  "Comunión Luz de Primavera": "Aplica una iluminación natural de mañana impecable y clara sobre el sujeto principal. El entorno debe transformarse en un jardín exterior luminoso con un fondo desenfocado sutil de flores blancas y vegetación verde suave, creando un bokeh orgánico limpio. Introduce tonos pastel suaves, eliminando por completo cualquier sombra dura, ruido digital o granulado en la imagen, logrando una toma perfectamente expuesta, nítida y pulida.",

  "Comunión Elegancia Atemporal": "Post-procesamiento de retrato de estudio profesional con un enfoque nítido centrado en el sujeto principal. Reemplaza el fondo por un lienzo artístico neutro y texturizado en tonos grises suaves o beige crema. Aplica una iluminación lateral clásica y difusa que resalte de manera impecable los detalles y texturas de la vestimenta, aislando cualquier distracción del fondo original para dar un acabado limpio, limpio y de alta gama.",

  // RESTAURAR FOTOS
  "Restauración en Blanco y Negro / Sepia Original": "Una fotografía analógica de época, meticulosamente restaurada y de ultra-alta resolución, basada fielmente en la. La imagen final está completamente limpia de todo daño físico, incluyendo rasgaduras severas, arrugas profundas, grietas superficiales, manchas de moho, suciedad y decoloración irregular. El encuadre debe estar limpio y redefinido, eliminando bordes deshilachados o dañados del papel original. El enfoque es nítido y claro en todos los sujetos y elementos de la escena, recuperando detalles perdidos en los rostros, expresiones y texturas (como ropa o arquitectura). La iluminación es natural y equilibrada, con un rango dinámico rico. La imagen mantiene su estética monocromática original (blanco y negro profundo o sepia rico y uniforme), pero con una claridad, profundidad y nitidez fotográfica modernas, como si la foto fuera nueva.",

  "Restaurar foto en color": "Una fotografía histórica de época, completamente restaurada y colorizada de forma fotorrealista, basada fielmente en [nombre_del_archivo.png]. La imagen está libre de cualquier rastro de daño físico, como rasgaduras, grietas, arañazos, manchas de moho o suciedad, con bordes limpios y definidos. Se ha aplicado un proceso de colorización realista y preciso, con tonos de piel naturales, colores de ropa auténticos para la época y un entorno vibrante pero fiel a la escena original. El enfoque es nítido y claro en todos los sujetos y elementos de fondo, recuperando detalles faciales y texturas con una resolución excepcional. La iluminación es natural, limpia y equilibrada, transformando la foto antigua en una imagen fotorrealista a color de alta calidad."
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

    // Columnas reales de la sheet:
    // A(1)=Timestamp | B(2)=Email | C(3)=Nombre titular | D(4)=Teléfono
    // E(5)=Estilo | F(6)=Aviso fotos | G(7)=Fotos subidas | H(8)=Estado
    const emailCliente   = sheet.getRange(fila, 2).getValue().toString().trim().toLowerCase(); // Col B
    const nombreTitular  = sheet.getRange(fila, 3).getValue().toString().trim();               // Col C

    if (!emailCliente) {
      console.error(`❌ Error en fila ${fila}: No se encontró un email válido en la columna B.`);
      return;
    }

    // ✅ FIX: Estado en columna H (8), que es donde está realmente el campo "Estado"
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
    console.log(`✉️ [PACK EXPRESS] Instrucciones enviadas a ${emailCliente}. Fila: ${fila}. Estado 'Pendiente' en Columna H.`);

  } catch (error) {
    console.error("💥 Error en Fase 1 (Formulario de Pago): " + error.toString());
  }
}

// =================================================================================
// FASE 2: VERIFICADOR AUTOMÁTICO DE GMAIL (CADA 5 MIN)
// =================================================================================

function revisarGmailYProcesarPedidos() {
  console.log("🔍 Escaneando Gmail en busca de notificaciones de Bizum por Nombre e Importe (N26)...");

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const todasLasPestanas = spreadsheet.getSheets();
  const sheet = todasLasPestanas.find(s =>
    s.getName().trim().toUpperCase() === "PACK EXPRESS"
  ) || null;

  if (!sheet) {
    Logger.log("❌ Error: No se encontró la pestaña 'PACK EXPRESS'.");
    return;
  }

  const datos = sheet.getDataRange().getValues();
  const queryGmail = `is:unread subject:"${ASUNTO_EMAIL_BIZUM}"`;
  const hilos = GmailApp.search(queryGmail, 0, 10);
  
  if (hilos.length === 0) {
    console.log("☕ Sin nuevos correos de Bizum sin leer en Gmail.");
    return;
  }

  console.log(`📬 Se encontraron ${hilos.length} correo(s) sin leer con el asunto correcto.`);

  for (let h = 0; h < hilos.length; h++) {
    const mensajes = hilos[h].getMessages();
    const ultimoMensaje = mensajes[mensajes.length - 1];
    
    const cuerpoEmailRaw = ultimoMensaje.getPlainBody();
    const cuerpoEmailLimpio = normalizarTexto(cuerpoEmailRaw);

    console.log(`📝 Texto del correo que estamos simulando: "${cuerpoEmailRaw}"`);
    let correoProcesado = false;

    for (let i = 1; i < datos.length; i++) {
      const emailCliente      = datos[i][1] ? datos[i][1].toString().trim().toLowerCase() : ""; 
      const nombreClienteForm = datos[i][2] ? datos[i][2].toString().trim() : "";               
      const estiloElegido     = datos[i][4] ? datos[i][4].toString().trim() : "";               
      const fileIdsRaw        = datos[i][6];                                                     
      const estado            = datos[i][7] ? datos[i][7].toString().trim() : "";               
      
      let importePagadoAnterior = datos[i][8] ? parseFloat(datos[i][8].toString().replace(',', '.')) : 0;
      if (isNaN(importePagadoAnterior)) importePagadoAnterior = 0;

      // LINEA CHIVATA 1: Ver qué lee en la hoja
      console.log(`📋 Fila ${i + 1} -> Nombre en hoja: "${nombreClienteForm}" | Estado en hoja: "${estado}"`);

      if ((estado === "Pendiente" || estado === "Error: Importe Incorrecto") && nombreClienteForm !== "") {
        const nombreClienteLimpio = normalizarTexto(nombreClienteForm);

        // LINEA CHIVATA 2: Ver si coincide el nombre
        console.log(`   🤔 ¿El texto del correo incluye "${nombreClienteLimpio}"?`);

        if (cuerpoEmailLimpio.includes(nombreClienteLimpio)) {
          console.log(`   ✅ ¡Nombre coincidente encontrado! Leyendo importe...`);
          
          const regexImporteDinamico = /(?:(?:€|EUR|euros)\s*(\d+(?:[\.,]\d{1,2})?)|(\d+(?:[\.,]\d{1,2})?)\s*(?:€|EUR|euros))/i;
          const matchImporte = cuerpoEmailRaw.match(regexImporteDinamico);

          if (matchImporte) {
            const textoImporte = matchImporte[1] || matchImporte[2];
            const importeEsteBizum = parseFloat(textoImporte.replace(',', '.'));
            const totalPagadoHastaAhora = importePagadoAnterior + importeEsteBizum;

            if (totalPagadoHastaAhora >= 4.99) {
              console.log(`   💰 ¡Pago completado! Total: ${totalPagadoHastaAhora}€`);
              sheet.getRange(i + 1, 8).setValue("Procesando"); 
              sheet.getRange(i + 1, 9).setValue(totalPagadoHastaAhora); 
              SpreadsheetApp.flush();
              ejecutarReveladoGemini(sheet, i + 1, emailCliente, estiloElegido, fileIdsRaw);
              correoProcesado = true;
              break; 
            } else {
              console.warn(`   ⚠️ Pago parcial. Total acumulado: ${totalPagadoHastaAhora}€.`);
              sheet.getRange(i + 1, 8).setValue("Error: Importe Incorrecto"); 
              sheet.getRange(i + 1, 9).setValue(totalPagadoHastaAhora); 
              SpreadsheetApp.flush();
              const restante = (4.99 - totalPagadoHastaAhora).toFixed(2);
              enviarCorreoInvitacionReintento(emailCliente, nombreClienteForm, restante);
              correoProcesado = true; 
              break;
            }
          } else {
            console.error(`   ❌ No se pudo localizar el importe en el texto.`);
          }
        }
      }
    }
    
    if (correoProcesado) {
      hilos[h].markRead();
    }
  }
}

// =================================================================================
// 📧 FUNCIÓN AUXILIAR: EMAIL AMISTOSO DE REINTENTO
// =================================================================================

function enviarCorreoInvitacionReintento(emailDestinatario, nombreTitular) {
  const asunto = "🎨 Un pequeño detalle con tu Bizum - El Álbum B";
  
  const cuerpoHTML = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eeeeee; border-radius: 10px;">
      <h2 style="color: #2c3e50; text-align: center; margin-bottom: 25px;">¡Casi lo tenemos! 🚀</h2>
      <p>¡Hola!</p>
      <p>Hemos recibido una notificación de Bizum asociada a tu nombre (<b>${nombreTitular}</b>) para activar el **Pack Express** de El Álbum B.</p>
      <p>Sin embargo, parece que ha habido un pequeño error con el importe y **no se han completado los 4,99 € exactos** necesarios para que el motor de Inteligencia Artificial empiece a revelar tus fotos.</p>
      
      <div style="background-color: #f4f6f7; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #2c3e50;">¡No te preocupes, tiene fácil solución!</p>
        <p style="margin: 5px 0 0 0;">Puedes volver a realizar un Bizum enviando la cantidad correcta (o la diferencia restante si te quedaste corto) al mismo teléfono de siempre: <b>${TELEFONO_BIZUM}</b>.</p>
      </div>

      <p>Nuestro sistema sigue escaneando las alertas. En cuanto detecte el importe correcto reflejado con tu nombre, tus fotos entrarán automáticamente en el laboratorio y recibirás tu galería privada de inmediato.</p>
      
      <p>Si crees que se trata de un error de tu aplicación bancaria o necesitas que lo revisemos contigo, solo tienes que responder directamente a este correo electrónico.</p>
      
      <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
      <p style="font-size: 12px; color: #7f8c8d; text-align: center;">
        El Álbum B - Revelado Inteligente de Fotografía.
      </p>
    </div>
  `;

  GmailApp.sendEmail(emailDestinatario, asunto, "", { htmlBody: cuerpoHTML });
  console.log(`✉️ Correo de invitación al reintento enviado a: ${emailDestinatario}`);
}

// =================================================================================
// FASE 3: EL MOTOR DE REVELADO E INTEGRACIÓN (CUMPLIMIENTO DE PEDIDOS)
// =================================================================================

function ejecutarReveladoGemini(sheet, filaIndex, emailCliente, estiloElegido, fileIdsRaw) {
  const nombrePestana = sheet.getName().trim().toUpperCase();
  // Col H (8) = Estado en PACK EXPRESS | Col F (6) = Estado en PRUEBA GRATIS / Form responses
  const colEstado = (nombrePestana === "PACK EXPRESS") ? 8 : 6;

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
        //  Cámbialo por esto para ver el motivo exacto:
        } else {
          console.error(`🔴 DETALLE: Gemini respondió con texto pero NO generó una imagen.`);
          
          // Extraemos y pintamos el texto que ha devuelto el modelo
          if (parts && parts[0] && parts[0].text) {
            console.warn(`💬 Mensaje de texto devuelto por Gemini: "${parts[0].text}"`);
          } else {
            console.warn(`💬 Ni siquiera hay texto disponible en la respuesta.`);
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
  if (!url || typeof url !== 'string') return null;
  
  try {
    if (url.includes('/d/')) {
      return url.split('/d/')[1].split('/')[0];
    } else if (url.includes('id=')) {
      return url.split('id=')[1].split('&')[0];
    }
    // ✅ FIX: Fallback para IDs crudos (sin URL)
    const match = url.trim().match(/^[\w_-]{25,}$/);
    return match ? url.trim() : null;
  } catch (e) {
    console.error("❌ Falló el procesamiento de la URL en extraerIdDeUrlDrive: " + e.message);
    return null;
  }
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
// 🎨 FUNCIÓN ESPECIAL: CREAR MUESTRARIO MULTI-EVENTO (MANUAL)
// =================================================================================

function ejecutarMuestrarioManual() {
  const urlFotoOriginal = "https://drive.google.com/file/d/1nrmVxHfUhk9mSbSaaRB-PJRh3e_BnWwe/view?usp=drive_link"; 
  const identificadorCarpeta = "Muestrario_Premium_Clientes";
  const tipoEvento = "todos"; 
  
  generarTodosLosEstilos(urlFotoOriginal, identificadorCarpeta, tipoEvento.toLowerCase().trim());
}

function generarTodosLosEstilos(urlFoto, nombreCarpeta, tipoEvento) {
  try {
    const fileId = extraerIdDeUrlDrive(urlFoto);
    if (!fileId) {
      console.error("❌ Error: No se pudo extraer el ID de la URL proporcionada.");
      return;
    }

    const sufijoEvento = tipoEvento.charAt(0).toUpperCase() + tipoEvento.slice(1);
    const nombreCarpetaFinal = `${nombreCarpeta}_${sufijoEvento}`;

    let carpetaRaiz = DriveApp.getFolderById(CARPETA_RAIZ_ID.trim());
    let carpetaMuestrario;
    const carpetasExistentes = carpetaRaiz.getFoldersByName(nombreCarpetaFinal);
    
    if (carpetasExistentes.hasNext()) {
      carpetaMuestrario = carpetasExistentes.next();
    } else {
      carpetaMuestrario = carpetaRaiz.createFolder(nombreCarpetaFinal);
      carpetaMuestrario.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }

    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) {
      console.error("🔴 ERROR: No existe la clave API de Gemini configurada en las propiedades del script.");
      return;
    }

    const archivoOriginal = DriveApp.getFileById(fileId);
    const blob = archivoOriginal.getBlob();
    const base64Image = Utilities.base64Encode(blob.getBytes());
    const mimeType = blob.getContentType();
    const urlLlamada = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${apiKey}`;

    let listaEstilos = Object.keys(ESTILOS_PROMPT);

    if (tipoEvento !== "todos") {
      listaEstilos = listaEstilos.filter(estilo => 
        estilo.toLowerCase().includes(tipoEvento)
      );
    }

    if (listaEstilos.length === 0) {
      console.warn(`⚠️ No se encontró ningún estilo que coincida con el filtro de evento: "${tipoEvento}" en ESTILOS_PROMPT.`);
      return;
    }

    console.log(`🚀 Iniciando generación: ${listaEstilos.length} estilo(s) tipo [${tipoEvento.toUpperCase()}] para la foto "${archivoOriginal.getName()}"`);

    for (let i = 0; i < listaEstilos.length; i++) {
      const nombreEstilo = listaEstilos[i];
      const descripcionPrompt = ESTILOS_PROMPT[nombreEstilo];
      
      console.log(`⏳ Procesando [${i+1}/${listaEstilos.length}]: Estilo "${nombreEstilo}"...`);

      let contextoInyectado = "evento";
      if (nombreEstilo.toLowerCase().includes("boda")) contextoInyectado = "boda";
      else if (nombreEstilo.toLowerCase().includes("bautizo")) contextoInyectado = "bautizo";
      else if (nombreEstilo.toLowerCase().includes("comunion") || nombreEstilo.toLowerCase().includes("primavera")) contextoInyectado = "comunión";

      const promptFinal = `Mejora esta foto de ${contextoInyectado}: ${descripcionPrompt}. Devuelve la imagen editada correspondiente de forma limpia y profesional.`;

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
        const response = UrlFetchApp.fetch(urlLlamada, options);
        json = JSON.parse(response.getContentText());

        if (json.error && (json.error.code === 503 || json.error.code === 429)) {
          intentos++;
          console.warn(`⚠️ Servidor saturado. Reintento ${intentos} para "${nombreEstilo}" en breve...`);
          Utilities.sleep(intentos * 5000); 
        } else {
          llamadaExitosa = true;
        }
      }

      if (json.error) {
        console.error(`🔴 ERROR en estilo "${nombreEstilo}": ` + JSON.stringify(json.error));
        continue; 
      }

      const parts = json.candidates && json.candidates[0].content.parts;
      const imagePart = parts ? parts.find(p => p.inlineData) : null;

      if (imagePart) {
        const imageData = imagePart.inlineData;
        const nombreArchivo = `${nombreEstilo.replace(/[\s/]+/g, '_')}_Muestrario.jpg`;

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

      if (i < listaEstilos.length - 1) {
        Utilities.sleep(4000); 
      }
    }

    console.log(`🎉 ¡Muestrario [${tipoEvento.toUpperCase()}] completado! Revisa la galería aquí: ${carpetaMuestrario.getUrl()}`);

  } catch (error) {
    console.error("💥 ERROR CRÍTICO EN GENERACIÓN DE MUESTRARIO: " + error.toString());
  }
}

// =================================================================================
// 🎨 FUNCIÓN ESPECIAL: CREAR MUESTRARIO CON TODOS LOS ESTILOS DE COMUNIONES
// =================================================================================

function ejecutarMuestrarioComunionesManual() {
  const urlFotoOriginal = "https://drive.google.com/file/d/1R5MdrmRvNYakmnzNDW9eDgCyeVyXF3jF/view?usp=drive_link"; 
  const identificadorCarpeta = "Portfolio_Comuniones";
  
  generarTodosLosEstilosComuniones(urlFotoOriginal, identificadorCarpeta);
}

function generarTodosLosEstilosComuniones(urlFoto, nombreCarpeta) {
  try {
    if (!urlFoto) {
      console.error("❌ Error: La URL de la foto original está vacía o es undefined.");
      return;
    }

    const fileId = extraerIdDeUrlDrive(urlFoto);
    if (!fileId) {
      console.error("❌ Error: No se pudo extraer el ID de la URL proporcionada. Verifica que sea un enlace válido de Drive.");
      return;
    }

    if (typeof CARPETA_RAIZ_ID === 'undefined' || !CARPETA_RAIZ_ID) {
      console.error("🔴 ERROR: La variable global CARPETA_RAIZ_ID no está definida o está vacía.");
      return;
    }

    let carpetaRaiz = DriveApp.getFolderById(CARPETA_RAIZ_ID.trim());
    let carpetaMuestrario;
    const carpetasExistentes = carpetaRaiz.getFoldersByName(nombreCarpeta);
    
    if (carpetasExistentes.hasNext()) {
      carpetaMuestrario = carpetasExistentes.next();
    } else {
      carpetaMuestrario = carpetaRaiz.createFolder(nombreCarpeta);
      carpetaMuestrario.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }

    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) {
      console.error("🔴 ERROR: No existe la clave API de Gemini.");
      return;
    }

    const archivoOriginal = DriveApp.getFileById(fileId);
    const blob = archivoOriginal.getBlob();
    const base64Image = Utilities.base64Encode(blob.getBytes());
    const mimeType = blob.getContentType();
    
    const modeloApi = typeof MODELO !== 'undefined' ? MODELO : 'gemini-1.5-flash';
    const urlLlamada = `https://generativelanguage.googleapis.com/v1beta/models/${modeloApi}:generateContent?key=${apiKey}`;

    if (typeof ESTILOS_PROMPT === 'undefined') {
      console.error("🔴 ERROR: El objeto global ESTILOS_PROMPT no está definido.");
      return;
    }

    const listaEstilos = Object.keys(ESTILOS_PROMPT).filter(estilo => 
      estilo && estilo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes('comunion')
    );

    if (listaEstilos.length === 0) {
      console.warn("⚠️ No se encontró ningún estilo que contenga la palabra 'comunion' en ESTILOS_PROMPT.");
      return;
    }

    console.log(`🚀 Iniciando generación: ${listaEstilos.length} estilos de comunión para la foto "${archivoOriginal.getName()}"`);

    for (let i = 0; i < listaEstilos.length; i++) {
      const nombreEstilo = listaEstilos[i];
      const descripcionPrompt = ESTILOS_PROMPT[nombreEstilo];
      
      console.log(`⏳ Procesando [${i+1}/${listaEstilos.length}]: Estilo "${nombreEstilo}"...`);

      const promptFinal = `Mejora esta foto de primera comunión: ${descripcionPrompt}. Devuelve la imagen editada correspondiente.`;

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
        const response = UrlFetchApp.fetch(urlLlamada, options);
        json = JSON.parse(response.getContentText());

        if (json.error && (json.error.code === 503 || json.error.code === 429)) {
          intentos++;
          console.warn(`⚠️ Servidor saturado. Reintento ${intentos} para "${nombreEstilo}" en breve...`);
          Utilities.sleep(intentos * 5000);
        } else {
          llamadaExitosa = true;
        }
      }

      if (json.error) {
        console.error(`🔴 ERROR en estilo "${nombreEstilo}": ` + JSON.stringify(json.error));
        continue;
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

      if (i < listaEstilos.length - 1) {
        Utilities.sleep(4000); 
      }
    }

    console.log(`🎉 ¡Muestrario de comuniones completado! Todas las fotos están en la carpeta: ${carpetaMuestrario.getUrl()}`);

  } catch (error) {
    console.error("💥 ERROR CRÍTICO EN MUESTRARIO DE COMUNIONES: " + error.toString());
  }
}



function procesarLoteMatutinoAlbumB() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetFotos = ss.getSheetByName("ALBUM_B_FOTOS");
  const sheetEventos = ss.getSheetByName("ALBUM_B_EVENTOS");
  
  if (!sheetFotos || !sheetEventos) return;

  const datosFotos = sheetFotos.getDataRange().getValues();
  const datosEventos = sheetEventos.getDataRange().getValues();
  const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');

  // 1. Buscamos qué eventos ocurrieron ayer y están en estado "Pagado" pero no "Terminado"
  for (let i = 1; i < datosEventos.length; i++) {
    let idBoda = datosEventos[i][0];
    let estadoEvento = datosEventos[i][5]; // Asumiendo Columna F para el estado del evento
    let carpetaGaleriaId = datosEventos[i][8]; // ID de la carpeta _GALERIA (Columna I)
    
    if (estadoEvento === "Pagado") { // Cambiar a "Pagado" o el estado que uses tras la validación
      
      // 2. Filtramos todas las fotos de ESTA boda que la IA marcó como APTAS
      let fotosAptas = [];
      for (let j = 1; j < datosFotos.length; j++) {
        if (datosFotos[j][0] === idBoda && datosFotos[j][3] === true) {
          fotosAptas.push({
            filaHoja: j + 1,
            idArchivo: datosFotos[j][1],
            puntuacion: datosFotos[j][4]
          });
        }
      }
      
      // 3. Ordenamos las fotos por puntuación de mayor a menor
      fotosAptas.sort((a, b) => b.puntuacion - a.puntuacion);
      
      // 4. Nos quedamos solo con las TOP 200
      let top200 = fotosAptas.slice(0, 200);
      
      // 5. Procesamos el revelado estético de este Top 200
      top200.forEach(foto => {
        try {
          const archivoRaw = DriveApp.getFileById(foto.idArchivo);
          const bytes = archivoRaw.getBlob().getBytes();
          const base64 = Utilities.base64Encode(bytes);
          
          // Llamamos a Gemini para el revelado estético definitivo
          const fotoEditadaBlob = aplicarReveladoEsteticoIA(base64, archivoRaw.getMimeType(), GEMINI_API_KEY);
          
          // Guardamos el resultado en la carpeta _GALERIA
          const carpetaGaleria = DriveApp.getFolderById(carpetaGaleriaId);
          carpetaGaleria.createFile(fotoEditadaBlob);
          
          // Actualizamos el estado de la foto en la hoja a "Editada"
          sheetFotos.getRange(foto.filaHoja, 6).setValue("Editada"); // Columna F
          
        } catch (err) {
          Logger.log(`Error revelando la foto ${foto.idArchivo}: ${err.toString()}`);
        }
      });
      
      // 6. Marcamos el evento como terminado en la hoja para que no se vuelva a procesar mañana
      sheetEventos.getRange(i + 1, 6).setValue("Entregado");
      
      // 7. Desconectamos el bucle enviando el email final
      enviarEmailEntregaNovios(datosEventos[i][2], idBoda); 
    }
  }
}

// Función auxiliar para el revelado (Look Álbum B)
function aplicarReveladoEsteticoIA(base64Data, mimeType, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const payload = {
    "contents": [{
      "parts": [
        { "text": "Actúa como un software de revelado fotográfico profesional. Aplica a esta imagen de boda un look cohesivo de fiesta: mejora la exposición si está oscura, equilibra los balances de blancos agresivos de las luces de discoteca, añade un contraste elegante y un ligero estilo analógico cálido. Devuelve únicamente el archivo de imagen procesado." },
        { "inlineData": { "mimeType": mimeType, "data": base64Data } }
      ]
    }]
  };

  const opciones = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  const respuesta = UrlFetchApp.fetch(url, opciones);
  // Nota técnica: Para recuperar el binario directo devuelto por la API si se usa transferencia de archivos, 
  // o procesar la respuesta base64 según el formato de salida configurado.
  return respuesta.getBlob(); 
}er.email_cliente;
    var fechaEvento = e.parameter.fecha_evento;
    
    var idEvento = nombresNovios.toLowerCase().replace(/[^a-z0-9]/g, '_') + "_" + fechaEvento; 
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetEventos = ss.getSheetByName("ALBUM_B_EVENTOS");
    
    if (!sheetEventos) {
      sheetEventos = ss.insertSheet("ALBUM_B_EVENTOS");
      sheetEventos.appendRow(["ID Boda", "Nombres", "Email", "Fecha Evento", "Precio", "Estado Pago", "Fecha Compra", "ID Carpeta RAW", "ID Carpeta GALERIA"]);
      sheetEventos.getRange("A1:I1").setFontWeight("bold");
    }
    
    sheetEventos.appendRow([
      idEvento, nombresNovios, emailNovios, fechaEvento, "79.00", "Pendiente", new Date(), "", ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({exito: true, id: idEvento})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({exito: false, error: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// SERVIDOR DE INTERFAZ WEB APP (doGet)
// ==========================================
function doGet(e) {
  var idBoda = e.parameter.boda; 
  
  if (!idBoda) {
    return HtmlService.createHtmlOutput("<script>window.top.location.href='https://elalbumb.com';</script>");
  }
  
  var template = HtmlService.createTemplateFromFile('InterfazInvitados');
  template.idBoda = idBoda; 
  
  return template.evaluate()
                 .setTitle("El Álbum B - Comparte tus fotos")
                 .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
                 .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ==========================================
// RECEPCIÓN DE IMÁGENES DESDE EL QR
// ==========================================
function recibirFotoInvitado(base64Data, nombreArchivo, idBoda) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetEventos = ss.getSheetByName("ALBUM_B_EVENTOS");
    const datosEventos = sheetEventos.getDataRange().getValues();
    
    let carpetaRawId = "";
    for (let i = 1; i < datosEventos.length; i++) {
      if (datosEventos[i][0] === idBoda) {
        carpetaRawId = datosEventos[i][7]; // Columna H
        break;
      }
    }
    
    if (!carpetaRawId) throw new Error("Infraestructura no encontrada para: " + idBoda);
    
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), "image/jpeg", nombreArchivo);
    const carpetaRaw = DriveApp.getFolderById(carpetaRawId);
    const archivoCreado = carpetaRaw.createFile(blob);
    const idArchivo = archivoCreado.getId();
    
    // Llamada al motor de IA (alojado en el otro archivo .gs)
    const evaluacionIA = evaluarFotoConIA(base64Data, "image/jpeg");
    
    let sheetFotos = ss.getSheetByName("ALBUM_B_FOTOS");
    if (!sheetFotos) {
      sheetFotos = ss.insertSheet("ALBUM_B_FOTOS");
      sheetFotos.appendRow(["ID Boda", "ID Archivo", "Nombre Archivo", "Apta", "Puntuación", "Estado Revelado", "Fecha Subida"]);
      sheetFotos.getRange("A1:G1").setFontWeight("bold");
    }
    
    sheetFotos.appendRow([idBoda, idArchivo, archivoCreado.getName(), evaluacionIA.apta, evaluacionIA.puntuacion, "Pendiente", new Date()]);
    
    if (evaluacionIA.apta === false) {
      archivoCreado.setTrashed(true); 
    }
    
    return { exito: true, filtrada: !evaluacionIA.apta };
  } catch (error) {
    Logger.log("Error en recibirFotoInvitado: " + error.toString());
    throw new Error("Error en el procesador de imágenes: " + error.message);
  }
}

// ==========================================
// CRON: SELECCIÓN TOP 200 Y REVELADO (8:00 AM)
// ==========================================
function procesarLoteMatutinoAlbumB() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetFotos = ss.getSheetByName("ALBUM_B_FOTOS");
  const sheetEventos = ss.getSheetByName("ALBUM_B_EVENTOS");
  
  if (!sheetFotos || !sheetEventos) return;

  const datosFotos = sheetFotos.getDataRange().getValues();
  const datosEventos = sheetEventos.getDataRange().getValues();
  const apiKey = getApiKey();

  for (let i = 1; i < datosEventos.length; i++) {
    let idBoda = datosEventos[i][0];
    let estadoEvento = datosEventos[i][5]; 
    let carpetaGaleriaId = datosEventos[i][8]; 
    
    if (estadoEvento === "Pagado") { 
      let fotosAptas = [];
      for (let j = 1; j < datosFotos.length; j++) {
        if (datosFotos[j][0] === idBoda && datosFotos[j][3] === true) {
          fotosAptas.push({ filaHoja: j + 1, idArchivo: datosFotos[j][1], puntuacion: datosFotos[j][4] });
        }
      }
      
      fotosAptas.sort((a, b) => b.puntuacion - a.puntuacion);
      let top200 = fotosAptas.slice(0, 200);
      
      top200.forEach(foto => {
        try {
          const archivoRaw = DriveApp.getFileById(foto.idArchivo);
          const bytes = archivoRaw.getBlob().getBytes();
          const base64 = Utilities.base64Encode(bytes);
          
          const fotoEditadaBlob = aplicarReveladoEsteticoIA(base64, archivoRaw.getMimeType(), apiKey);
          const carpetaGaleria = DriveApp.getFolderById(carpetaGaleriaId);
          carpetaGaleria.createFile(fotoEditadaBlob);
          
          sheetFotos.getRange(foto.filaHoja, 6).setValue("Editada"); 
        } catch (err) {
          Logger.log(`Error en revelado del archivo ${foto.idArchivo}: ${err.toString()}`);
        }
      });
      
      sheetEventos.getRange(i + 1, 6).setValue("Entregado");
      enviarEmailEntregaNovios(datosEventos[i][2], idBoda); 
    }
  }
}

// ==========================================
// SCRIPT DE MANTENIMIENTO Y PURGA (00:00)
// ==========================================
function mantenimientoYPurgaAutomatica() {
  const carpetaRaiz = DriveApp.getFolderById(MASTER_FOLDER_ID);
  const subcarpetas = carpetaRaiz.getFolders();
  const hoy = new Date();
  
  while (subcarpetas.hasNext()) {
    const carpeta = subcarpetas.next();
    const nombreCarpeta = carpeta.getName();
    const fechaCreacion = carpeta.getDateCreated();
    const diferenciaTiempo = hoy.getTime() - fechaCreacion.getTime();
    const diasDeVida = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));
    
    if (nombreCarpeta.indexOf("ALBUMB_") === 0) {
      if (diasDeVida > 30) {
        carpeta.setTrashed(true);
        Logger.log("Purgada galería de El Álbum B: " + nombreCarpeta);
      }
    } else {
      if (diasDeVida > 15) {
        carpeta.setTrashed(true);
        Logger.log("Purgado Pack Express: " + nombreCarpeta);
      }
    }
  }
}

function enviarCartelQR(idEvento, nombresNovios) { Logger.log(`QR Enviado: ${idEvento}`); }
function enviarEmailEntregaNovios(email, idBoda) { Logger.log(`Entrega enviada a: ${email}`); }

// Archivo IA_analisis.gs
// ==========================================
// EXTRACCIÓN SEGURA DE CREDENCIALES
// ==========================================
function getApiKey() {
  const key = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!key) {
    throw new Error("CRÍTICO: Configura 'GEMINI_API_KEY' en las Script Properties de tu proyecto.");
  }
  return key;
}

// ==========================================
// FILTRO DE CALIDAD Y CONTENIDO (Criba nocturna)
// ==========================================
function evaluarFotoConIA(base64Data, mimeType) {
  const apiKey = getApiKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const promptInstrucciones = 
    "Analiza esta imagen subida por un invitado a una boda. Evaluará si es apta para el álbum y vierte una puntuación de calidad de 0 a 100. " +
    "Una foto NO es apta (apta = false) si es una captura de pantalla, un meme, un pantallazo de WhatsApp, está completamente negra, " +
    "extremadamente borrosa o es un disparo accidental al suelo o bolsillo. Si muestra personas divirtiéndose, baile, comida o ambiente, " +
    "es apta (apta = true). La puntuación (0 a 100) premia la nitidez y el valor emocional. Devuelve ÚNICAMENTE un objeto JSON con las " +
    "claves exactas 'apta' (boolean) y 'puntuacion' (number). Sin textos markdown ni explicaciones adicionales.";

  const payload = {
    "contents": [{ "parts": [{ "text": promptInstrucciones }, { "inlineData": { "mimeType": mimeType, "data": base64Data } }] }],
    "generationConfig": { "responseMimeType": "application/json" }
  };

  const opciones = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    const respuesta = UrlFetchApp.fetch(url, opciones);
    const jsonRespuesta = JSON.parse(respuesta.getContentText());
    return JSON.parse(jsonRespuesta.candidates[0].content.parts[0].text);
  } catch (error) {
    Logger.log("Fallo API Gemini Criba: " + error.toString());
    return { apta: true, puntuacion: 50 }; // Red de seguridad
  }
}

// ==========================================
// REVELADO CREATIVO EN LOTE (Estilo de la marca)
// ==========================================
function aplicarReveladoEsteticoIA(base64Data, mimeType, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const payload = {
    "contents": [{
      "parts": [
        { "text": "Actúa como un motor de procesado fotográfico profesional. Aplica a esta imagen un look cohesivo de reportaje social: corrige subexposiciones, suaviza balances cromáticos estridentes derivados de luces artificiales/discoteca, aporta un contraste limpio y un sutil acabado analógico cálido. Devuelve únicamente el flujo de la nueva imagen procesada." },
        { "inlineData": { "mimeType": mimeType, "data": base64Data } }
      ]
    }]
  };

  const opciones = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  const respuesta = UrlFetchApp.fetch(url, opciones);
  return respuesta.getBlob(); 
}







// Archivo: Backend_Bodas.gs
// ==========================================
// CONFIGURACIÓN GLOBAL MODO BODAS
// ==========================================
const MASTER_FOLDER_ID = "17aA-10hZDrc4RtnDaLZRTnEJBXw92YKe"; // Tu carpeta raíz de Drive para bodas
const PRECIO_BODA = 79; // Tu precio para el Pack Bodas
const ASUNTO_EMAIL_BIZUM = "Notificación de Bizum"; // El asunto exacto que envía N26
const TELEFONO_BIZUM = "634404631"; // Tu teléfono para que aparezca en el mail de reintento


/**
 * Crea el activador automático cada 5 minutos
 */
function crearTriggerCronJob() {
  // Evitamos duplicar activadores si le das varias veces al botón
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'revisarGmailYProcesarBodas') return;
  }
  ScriptApp.newTrigger('revisarGmailYProcesarBodas').timeBased().everyMinutes(5).create();
  SpreadsheetApp.getUi().alert('¡Activado! El sistema buscará Bizums de bodas de N26 automáticamente cada 5 minutos.');
}

/**
 * TU MOTOR CLONADO Y ADAPTADO: Escanea N26 por Nombre e Importe (Modo Bodas)
 */
function revisarGmailYProcesarBodas() {
  console.log("🔍 Escaneando Gmail en busca de Bizums para BODAS...");

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheets()[0]; // Primera pestaña (Respuestas del Formulario de Bodas)

  const datos = sheet.getDataRange().getValues();
  const headers = datos[0];
  
  // Forzamos la creación de columnas de control interno si no existen
  var idxEstado = headers.indexOf("Estado Servicio");
  if (idxEstado === -1) {
    setupColumnasControl(sheet);
    return; 
  }

  const queryGmail = `is:unread subject:"${ASUNTO_EMAIL_BIZUM}"`;
  const hilos = GmailApp.search(queryGmail, 0, 10);
  
  if (hilos.length === 0) {
    console.log("☕ Sin nuevos correos de Bizum para bodas.");
    return;
  }

  for (let h = 0; h < hilos.length; h++) {
    const mensajes = hilos[h].getMessages();
    const ultimoMensaje = mensajes[mensajes.length - 1];
    const cuerpoEmailRaw = ultimoMensaje.getPlainBody();
    const cuerpoEmailLimpio = normalizarTexto(cuerpoEmailRaw);

    let correoProcesado = false;

    for (let i = 1; i < datos.length; i++) {
      const emailCliente      = datos[i][1] ? datos[i][1].toString().trim().toLowerCase() : ""; 
      const nombreClienteForm = datos[i][2] ? datos[i][2].toString().trim() : "";               
      const estado            = datos[i][idxEstado] ? datos[i][idxEstado].toString().trim() : "";               
      
      // El importe acumulado se guarda dos columnas a la derecha de "Estado Servicio"
      let importePagadoAnterior = datos[i][idxEstado + 1] ? parseFloat(datos[i][idxEstado + 1].toString().replace(',', '.')) : 0;
      if (isNaN(importePagadoAnterior)) importePagadoAnterior = 0;

      if ((estado === "Pendiente" || estado === "" || estado === "Error: Importe Incorrecto") && nombreClienteForm !== "") {
        const nombreClienteLimpio = normalizarTexto(nombreClienteForm);

        if (cuerpoEmailLimpio.includes(nombreClienteLimpio)) {
          
          const regexImporteDinamico = /(?:(?:€|EUR|euros)\s*(\d+(?:[\.,]\d{1,2})?)|(\d+(?:[\.,]\d{1,2})?)\s*(?:€|EUR|euros))/i;
          const matchImporte = cuerpoEmailRaw.match(regexImporteDinamico);

          if (matchImporte) {
            const textoImporte = matchImporte[1] || matchImporte[2];
            const importeEsteBizum = parseFloat(textoImporte.replace(',', '.'));
            const totalPagadoHastaAhora = importePagadoAnterior + importeEsteBizum;

            // COMPROBACIÓN CON TU NUEVO PRECIO DE BODA
            if (totalPagadoHastaAhora >= PRECIO_BODA) {
              console.log(`   💰 ¡Boda Pagada! Total: ${totalPagadoHastaAhora}€`);
              
              sheet.getRange(i + 1, idxEstado + 1).setValue("Activa (Recibiendo Fotos)"); 
              sheet.getRange(i + 1, idxEstado + 2).setValue(totalPagadoHastaAhora); 
              SpreadsheetApp.flush();
              
              // 🚀 LA RECOMPENSA DE BODAS: Creamos carpetas y generamos la URL para el QR
              activarInfraestructuraBoda(sheet, i + 1, datos[i]);
              
              correoProcesado = true;
              break; 
            } else {
              console.warn(`   ⚠️ Pago parcial de boda: ${totalPagadoHastaAhora}€.`);
              sheet.getRange(i + 1, idxEstado + 1).setValue("Error: Importe Incorrecto"); 
              sheet.getRange(i + 1, idxEstado + 2).setValue(totalPagadoHastaAhora); 
              SpreadsheetApp.flush();
              
              const restante = (PRECIO_BODA - totalPagadoHastaAhora).toFixed(2);
              enviarCorreoInvitacionReintentoBodas(emailCliente, nombreClienteForm, restante);
              
              correoProcesado = true; 
              break;
            }
          }
        }
      }
    }
    
    if (correoProcesado) {
      hilos[h].markRead();
    }
  }
}

/**
 * Lógica que fabrica las carpetas en Drive para los invitados y genera el token del QR
 */
function activarInfraestructuraBoda(sheet, filaNum, filaDatos) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  var idxIdBoda = headers.indexOf("ID Boda") + 1;
  var idxEstado = headers.indexOf("Estado Servicio") + 1;
  var idxRaw = headers.indexOf("ID Carpeta RAW") + 1;
  var idxGaleria = headers.indexOf("ID Carpeta GALERIA") + 1;
  var idxUrlQr = headers.indexOf("Enlace Web App / QR") + 1;

  var titular = filaDatos[headers.indexOf("Nombre y apellidos del titular de la cuenta (Tal como aparece en tu app del banco al hacer el Bizum)")];
  var fecha = filaDatos[headers.indexOf("Fecha del evento")];
  
  var fechaTexto = (fecha instanceof Date) ? Utilities.formatDate(fecha, Session.getScriptTimeZone(), "yyyy-MM-dd") : fecha.toString();
  var idBoda = titular.toLowerCase().replace(/[^a-z0-9]/g, '_') + "_" + fechaTexto.replace(/[^a-z0-9]/g, '_');

  var carpetaRaiz = DriveApp.getFolderById(MASTER_FOLDER_ID);
  var carpetaBodaPrincipal = carpetaRaiz.createFolder("BODA_" + titular.toString().toUpperCase());
  var carpetaRaw = carpetaBodaPrincipal.createFolder("RAW_INVITADOS");
  var carpetaGaleria = carpetaBodaPrincipal.createFolder("GALERIA_EDITADA");

  var webAppUrl = ScriptApp.getService().getUrl() + "?boda=" + idBoda;

  sheet.getRange(filaNum, idxIdBoda).setValue(idBoda);
  sheet.getRange(filaNum, idxEstado).setValue("Activa (Recibiendo Fotos)");
  sheet.getRange(filaNum, idxRaw).setValue(carpetaRaw.getId());
  sheet.getRange(filaNum, idxGaleria).setValue(carpetaGaleria.getId());
  sheet.getRange(filaNum, idxUrlQr).setValue(webAppUrl);
  
  SpreadsheetApp.flush();
}

/**
 * Failsafe manual: Activa la infraestructura desde el botón por si pagan desde el banco de un familiar
 */
function forzarActivaciónManual() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var fila = sheet.getActiveCell().getRow();
  if (fila === 1) return;
  
  var filaDatos = sheet.getRange(fila, 1, 1, sheet.getLastColumn()).getValues()[0];
  activarInfraestructuraBoda(sheet, fila, filaDatos);
  SpreadsheetApp.getUi().alert('Boda activada de forma manual con éxito.');
}

/**
 * Servidor del Frontend móvil para invitados
 */
function doGet(e) {
  var idBoda = e.parameter.boda; 
  if (!idBoda) {
    return HtmlService.createHtmlOutput("<script>window.top.location.href='https://elalbumb.com';</script>");
  }
  
  var template = HtmlService.createTemplateFromFile('InterfazInvitados');
  template.idBoda = idBoda; 
  return template.evaluate()
                 .setTitle("El Álbum B - Sube tus fotos")
                 .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
                 .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Receptor asíncrono de los archivos de los invitados
 */
function recibirFotoInvitado(base64Data, nombreArchivo, idBoda) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetNovios = ss.getSheets()[0]; 
    const datosNovios = sheetNovios.getDataRange().getValues();
    const headers = datosNovios[0];
    
    let idxIdBoda = headers.indexOf("ID Boda");
    let idxRaw = headers.indexOf("ID Carpeta RAW");
    let carpetaRawId = "";
    
    for (let i = 1; i < datosNovios.length; i++) {
      if (datosNovios[i][idxIdBoda] === idBoda) {
        carpetaRawId = datosNovios[i][idxRaw];
        break;
      }
    }
    
    if (!carpetaRawId) throw new Error("ID de boda no válido.");
    
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), "image/jpeg", nombreArchivo);
    const carpetaRaw = DriveApp.getFolderById(carpetaRawId);
    const archivoCreado = carpetaRaw.createFile(blob);
    
    const evaluacionIA = evaluarFotoConIA(base64Data, "image/jpeg");
    
    let sheetFotos = ss.getSheetByName("CONTROL_FOTOS_INVITADOS");
    if (!sheetFotos) {
      sheetFotos = ss.insertSheet("CONTROL_FOTOS_INVITADOS");
      sheetFotos.appendRow(["ID Boda", "ID Archivo", "Nombre", "Apta", "Puntuacion", "Estado Proceso"]);
    }
    
    sheetFotos.appendRow([idBoda, archivoCreado.getId(), archivoCreado.getName(), evaluacionIA.apta, evaluacionIA.puntuacion, "Pendiente"]);
    
    if (evaluacionIA.apta === false) {
      archivoCreado.setTrashed(true); 
    }
    
    return { exito: true };
  } catch (error) {
    throw new Error("Error en servidor: " + error.message);
  }
}

/**
 * Proceso matutino de revelado premium de las mejores 200 fotos
 */
function procesarLoteMatutinoAlbumB() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetNovios = ss.getSheets()[0];
  const sheetFotos = ss.getSheetByName("CONTROL_FOTOS_INVITADOS");
  
  if (!sheetFotos || !sheetNovios) return;

  const datosNovios = sheetNovios.getDataRange().getValues();
  const headersNovios = datosNovios[0];
  const datosFotos = sheetFotos.getDataRange().getValues();
  
  const idxIdBodaNovios = headersNovios.indexOf("ID Boda");
  const idxEstiloNovios = headersNovios.indexOf("¿Qué estilo prefieres para tus fotos?");
  const idxEstadoNovios = headersNovios.indexOf("Estado Servicio");
  const idxGaleriaNovios = headersNovios.indexOf("ID Carpeta GALERIA");

  const apiKey = getApiKey();

  for (let i = 1; i < datosNovios.length; i++) {
    let idBoda = datosNovios[i][idxIdBodaNovios];
    let estado = datosNovios[i][idxEstadoNovios];
    let estiloElegido = datosNovios[i][idxEstiloNovios];
    let carpetaGaleriaId = datosNovios[i][idxGaleriaNovios];
    
    if (estado === "Activa (Recibiendo Fotos)") {
      let poolFotos = [];
      
      for (let j = 1; j < datosFotos.length; j++) {
        if (datosFotos[j][0] === idBoda && datosFotos[j][3] === true && datosFotos[j][5] === "Pendiente") {
          poolFotos.push({ filaHoja: j + 1, idArchivo: datosFotos[j][1], puntuacion: datosFotos[j][4] });
        }
      }
      
      poolFotos.sort((a, b) => b.puntuacion - a.puntuacion);
      let top200 = poolFotos.slice(0, 200);
      
      top200.forEach((foto, index) => {
        try {
          const archivoRaw = DriveApp.getFileById(foto.idArchivo);
          const base64 = Utilities.base64Encode(archivoRaw.getBlob().getBytes());
          
          const fotoEditadaBlob = aplicarReveladoEsteticoIA(base64, archivoRaw.getMimeType(), estiloElegido, apiKey);
          fotoEditadaBlob.setName("AlbumB_Boda_" + (index + 1) + ".jpg");
          
          DriveApp.getFolderById(carpetaGaleriaId).createFile(fotoEditadaBlob);
          sheetFotos.getRange(foto.filaHoja, 6).setValue("Revelada ✨");
        } catch (e) {
          Logger.log("Error en revelado de foto: " + e.toString());
        }
      });
      
      sheetNovios.getRange(i + 1, idxEstadoNovios + 1).setValue("Entregado");
    }
  }
}

// ==========================================
// AUXILIARES
// ==========================================
function normalizarTexto(str) {
  if (!str) return "";
  return str.toString().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "").trim();
}

function setupColumnasControl(sheet) {
  sheet.getRange(1, sheet.getLastColumn() + 1).setValue("Estado Servicio").setFontWeight("bold");
  sheet.getRange(1, sheet.getLastColumn() + 1).setValue("Importe Pagado").setFontWeight("bold");
  sheet.getRange(1, sheet.getLastColumn() + 1).setValue("ID Boda").setFontWeight("bold");
  sheet.getRange(1, sheet.getLastColumn() + 1).setValue("ID Carpeta RAW").setFontWeight("bold");
  sheet.getRange(1, sheet.getLastColumn() + 1).setValue("ID Carpeta GALERIA").setFontWeight("bold");
  sheet.getRange(1, sheet.getLastColumn() + 1).setValue("Enlace Web App / QR").setFontWeight("bold");
  SpreadsheetApp.flush();
}

function enviarCorreoInvitacionReintentoBodas(emailDestinatario, nombreTitular, restante) {
  const asunto = "🎨 Un pequeño detalle con tu Bizum - El Álbum B";
  const cuerpoHTML = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eeeeee; border-radius: 10px;">
      <h2 style="color: #2c3e50; text-align: center; margin-bottom: 25px;">¡Casi lo tenemos! 🚀</h2>
      <p>Hola,</p>
      <p>Hemos recibido una notificación de Bizum asociada a tu nombre (<b>${nombreTitular}</b>) para activar tu Pack de Bodas de El Álbum B.</p>
      <p>Parece que ha habido un pequeño error y el total acumulado no llega a los <b>${PRECIO_BODA} €</b> necesarios para activar el servicio de invitados. Falta un remanente de <b>${restante} €</b>.</p>
      <div style="background-color: #f4f6f7; padding: 15px; border-radius: 8px; border-left: 4px solid #bba06b; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #2c3e50;">¡No te preocupes, se arregla fácil!</p>
        <p style="margin: 5px 0 0 0;">Puedes hacer un segundo Bizum enviando la diferencia restante al teléfono: <b>${TELEFONO_BIZUM}</b>.</p>
      </div>
      <p>En cuanto nuestro sistema detecte el saldo completo, tu QR quedará activo al instante.</p>
    </div>
  `;
  GmailApp.sendEmail(emailDestinatario, asunto, "", { htmlBody: cuerpoHTML });
}


