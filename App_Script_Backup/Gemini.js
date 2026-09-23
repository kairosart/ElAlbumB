/**
 * GEMINI.GS - Módulo de IA para El Álbum B
 * Versión mejorada con logging para diagnóstico de errores
 */


const ESTILOS_FOTOS = {
  "CINEMATIC DRAMA": "estilo cinematográfico y dramático, iluminación de cine, contraste marcado, tonos teal y naranja, atmósfera de película",
  "NOSTALGIA FILM": "estilo de película analógica nostálgica, grano de película sutil, tonos cálidos desaturados, aspecto vintage",
  "VOGUE CHIC": "estilo editorial de revista de moda, elegante y sofisticado, iluminación de estudio, colores ricos y contrastados",
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
  "RECUERDO FAMILIAR": "estilo cálido y cercano, tonos naturales suaves, luz cálida hogareña, ambiente entrañable y familiar"
};

function obtenerEstiloBoda(codigoEvento) {
  const evento = buscarEventoPorCodigo(codigoEvento);

  // Log de diagnóstico: confirma qué está devolviendo buscarEventoPorCodigo
  console.log("DEBUG obtenerEstiloBoda -> evento: " + JSON.stringify(evento));

  if (evento.encontrado && evento.estilo && String(evento.estilo).trim().length > 0) {
    const promptFinal = traducirEstiloAPrompt(evento.estilo);
    console.log("DEBUG -> Estilo encontrado: '" + evento.estilo + "' -> prompt: " + promptFinal);
    return promptFinal;
  }

  console.log("DEBUG -> Sin estilo específico, usando fallback por tipo de evento: " + evento.tipoEvento);
  return estiloPorDefectoSegunTipo(evento.tipoEvento);
}

function traducirEstiloAPrompt(nombreEstilo) {
  const clave = normalizarTexto(nombreEstilo);
  return ESTILOS_FOTOS[clave] || String(nombreEstilo).trim();
}

function estiloPorDefectoSegunTipo(tipoEvento) {
  const tipo = normalizarTexto(tipoEvento);
  const defaults = {
    "BODA": "estilo editorial de boda, tonos cálidos y naturales, alta calidad fotográfica",
    "BAUTIZO": "estilo tierno y luminoso, tonos suaves y pastel",
    "COMUNION": "estilo elegante y luminoso, tonos claros",
    "CONFIRMACION": "estilo elegante y luminoso, tonos claros",
    "CUMPLEANOS": "estilo vibrante y festivo, colores vivos",
    "FIESTA": "estilo vibrante y festivo, colores vivos, ambiente de celebración",
    "COMIDA EMPRESA": "estilo profesional y elegante, tonos neutros",
    "COMIDA FAMILIAR": "estilo cálido y cercano, tonos naturales",
    "ANIVERSARIO DE BODA": "estilo romántico y elegante, tonos cálidos",
    "COMPROMISO": "estilo romántico y luminoso, tonos suaves",
    "GRADUACION": "estilo luminoso y orgulloso, colores vivos",
    "JUBILACION": "estilo cálido y festivo, tonos cercanos"
  };
  return defaults[tipo] || "estilo editorial cálido y natural, alta calidad fotográfica";
}


/**
 * Prueba rápida para validar si tu GEMINI_API_KEY funciona.
 */
function probarConexionGemini() {
  Logger.log("✅ Probando conexión con Vertex AI mediante OAuth2...");

  const projectId = "project-68bfb742-df08-4dfb-ba3";
  const region = "global"; // Cambiado a 'global' para evitar errores 404 en modelos de imagen o experimentales
  const model = MODELO;

  // Construcción dinámica de la URL según si el endpoint es regional o global
  const host = region === "global" ? "aiplatform.googleapis.com" : `${region}-aiplatform.googleapis.com`;
  const url = `https://${host}/v1/projects/${projectId}/locations/${region}/publishers/google/models/${model}:generateContent`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: "Hola, ¿estás funcionando?" }]
      }
    ]
  };

  try {
    const token = ScriptApp.getOAuthToken();

    const options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "Authorization": "Bearer " + token
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const codigo = response.getResponseCode();
    const texto = response.getContentText();

    if (codigo === 200) {
      Logger.log("✅ ¡Conexión exitosa con Vertex AI usando tus créditos de Cloud!");
      Logger.log("Respuesta: " + texto.substring(0, 150) + "...");
    } else {
      Logger.log("❌ FALLO EN LA API (Código " + codigo + ")");
      Logger.log("Respuesta detallada: " + texto);
    }

  } catch (e) {
    Logger.log("❌ ERROR CRÍTICO DE RED: " + e.toString());
  }
}
/**
 * Envía la foto a Vertex AI con manejo de errores detallado, reintentos y autenticación OAuth.
 */

function procesarFotoConVertexAI(file, estiloPrompt) {
  console.log("DEBUG procesarFotoConVertexAI -> estiloPrompt recibido: " + estiloPrompt);

  const projectId = "project-68bfb742-df08-4dfb-ba3"; 
  const region = "global"; // Cambiado a 'global' para admitir modelos de imagen / experimentales y evitar errores 404
  const model = MODELO; 

  // Construcción dinámica de la URL según si el endpoint es regional o global
  const host = region === "global" ? "aiplatform.googleapis.com" : `${region}-aiplatform.googleapis.com`;
  const url = `https://${host}/v1/projects/${projectId}/locations/${region}/publishers/google/models/${model}:generateContent`;

  const blob = file.getBlob();
  const base64 = Utilities.base64Encode(blob.getBytes());
  const mimeType = blob.getContentType() || "image/jpeg";

  const prompt = `Edita esta fotografía aplicando este estilo: ${estiloPrompt}. Mantén el sujeto principal y la composición reconocibles, mejora luz y color de forma artística.`;

  const payload = {
    contents: [{
      role: "user",
      parts: [
        { inlineData: { mimeType: mimeType, data: base64 } },
        { text: prompt }
      ]
    }],
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      maxOutputTokens: 8192
    }
  };

  const maxIntentos = 3;
  let ultimoError;

  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      const token = ScriptApp.getOAuthToken();

      const options = {
        method: "post",
        contentType: "application/json",
        headers: { "Authorization": "Bearer " + token },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };

      const response = UrlFetchApp.fetch(url, options);
      const codigo = response.getResponseCode();
      const texto = response.getContentText();

      // Si da error 429 (saturación) o 503 (servicio ocupado)
      if (codigo === 429 || codigo === 503) {
        console.warn(`⚠️ VERTEX_API_ERROR [${codigo}] intento ${intento}/${maxIntentos}. Cuota excedida o servicio ocupado.`);
        if (intento < maxIntentos) {
          // Espera progresiva fuerte: 10s en el primer fallo, 20s en el segundo
          const tiempoEspera = intento * 10000; 
          console.log(`⏳ Esperando ${tiempoEspera / 1000} segundos antes de reintentar...`);
          Utilities.sleep(tiempoEspera);
          continue;
        }
      }

      if (codigo !== 200) {
        console.error("VERTEX_API_ERROR [" + codigo + "] intento " + intento + ": " + texto);
        if (codigo >= 500 && intento < maxIntentos) {
          Utilities.sleep(4000 * intento);
          continue;
        }
        throw new Error("Vertex AI error " + codigo + ": " + texto);
      }

      const data = JSON.parse(texto);
      const parts = data.candidates?.[0]?.content?.parts;
      if (!parts) throw new Error("Respuesta de Vertex AI sin contenido");

      const imagenPart = parts.find(p => p.inlineData || p.inline_data);
      if (!imagenPart) throw new Error("Vertex AI no devolvió imagen.");

      const inline = imagenPart.inlineData || imagenPart.inline_data;
      const bytes = Utilities.base64Decode(inline.data);
      const mimeSalida = inline.mimeType || inline.mime_type || "image/jpeg";

      return Utilities.newBlob(bytes, mimeSalida, "editada.jpg");

    } catch (e) {
      ultimoError = e;
      console.error("FATAL_ERROR_VERTEX intento " + intento + ": " + e.toString());
      if (intento < maxIntentos) Utilities.sleep(5000 * intento);
    }
  }

  throw new Error("Fallo en Vertex AI tras " + maxIntentos + " intentos: " + (ultimoError ? ultimoError.toString() : "Desconocido"));
}

function probarVertexAI() {
  // 1. Reemplaza este ID por el ID real de una imagen de prueba que tengas en tu Google Drive
  const idDeTuImagenEnDrive = "1ZkdPA_1fcguWPdqWzDZmP_2G8qLEkiBp"; 
  
  try {
    const archivo = DriveApp.getFileById(idDeTuImagenEnDrive);
    console.log("Imagen encontrada: " + archivo.getName());
    
    // 2. Ejecutamos la función de procesamiento con un prompt de prueba
    const resultadoBlob = procesarFotoConVertexAI(archivo, "Estilo fotográfico profesional, iluminación suave y elegante");
    
    // 3. Guardamos la imagen resultante en la misma carpeta para comprobar que ha funcionado
    const carpetaDestino = archivo.getParents().next();
    const archivoGuardado = carpetaDestino.createFile(resultadoBlob);
    
    console.log("¡ÉXITO! Imagen procesada y guardada con el nombre: " + archivoGuardado.getName());
    
  } catch (error) {
    console.error("Error durante la prueba: " + error.toString());
  }
}