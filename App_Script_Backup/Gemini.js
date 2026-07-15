// Llamada a la API de Gemini (modelo gemini-2.5-flash-image, "Nano Banana")
// para editar una foto en el estilo artístico elegido para la boda.

/**
 * Traduce los nombres "de marketing" del desplegable del formulario
 * (ej. "Cyber Noir", "Finca cristalina") a una descripción visual real
 * que Gemini pueda interpretar, ya que el nombre por sí solo no le dice
 * nada sobre iluminación, color o atmósfera.
 *
 * Si el estilo no está en el diccionario (por ejemplo, si se añade una
 * opción nueva al formulario y aún no se ha traducido aquí), se usa el
 * texto tal cual como fallback en lugar de romper el flujo.
 */
const ESTILOS_FOTOS = {
  "CINEMATIC DRAMA": "estilo cinematográfico y dramático, iluminación de cine, contraste marcado, tonos teal y naranja, atmósfera de película",
  "NOSTALGIA FILM": "estilo de película analógica nostálgica, grano de película sutil, tonos cálidos desaturados, aspecto vintage",
  "VOGUE CHIC": "estilo editorial de revista de moda, elegante y sofisticado, iluminación de estudio, colores ricos y contrastados",
  "MAGIC WONDERLAND": "estilo mágico y onírico, luces cálidas y brillantes, atmósfera de cuento de hadas, colores vibrantes",
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

/**
 * Lee el estilo configurado para un evento desde ALBUM_B_EVENTOS (columna "Estilo").
 * Si no hay estilo configurado, usa un prompt genérico por defecto según el tipo de evento.
 */
function obtenerEstiloBoda(codigoEvento) {
  const evento = buscarEventoPorCodigo(codigoEvento);
  if (evento.encontrado && evento.estilo && String(evento.estilo).trim().length > 0) {
    return traducirEstiloAPrompt(evento.estilo);
  }
  return estiloPorDefectoSegunTipo(evento.tipoEvento);
}

/**
 * Convierte el nombre de estilo elegido en el formulario en una
 * descripción visual real para el prompt de Gemini. Ver ESTILOS_FOTOS.
 */
function traducirEstiloAPrompt(nombreEstilo) {
  const clave = normalizarTexto(nombreEstilo);
  return ESTILOS_FOTOS[clave] || String(nombreEstilo).trim();
}

function estiloPorDefectoSegunTipo(tipoEvento) {
  const tipo = normalizarTexto(tipoEvento);
  const defaults = {
    "BODA": "estilo editorial de boda, tonos cálidos y naturales, alta calidad fotográfica",
    "BAUTIZO": "estilo tierno y luminoso, tonos suaves y pastel, propio de un bautizo",
    "COMUNION": "estilo elegante y luminoso, tonos claros, propio de una comunión",
    "CONFIRMACION": "estilo elegante y luminoso, tonos claros, propio de una confirmación",
    "CUMPLEANOS": "estilo vibrante y festivo, colores vivos",
    "FIESTA": "estilo vibrante y festivo, colores vivos, ambiente de celebración",
    "COMIDA EMPRESA": "estilo profesional y elegante, tonos neutros, propio de un evento de empresa",
    "COMIDA FAMILIAR": "estilo cálido y cercano, tonos naturales, propio de una reunión familiar",
    "ANIVERSARIO DE BODA": "estilo romántico y elegante, tonos cálidos, propio de un aniversario",
    "COMPROMISO": "estilo romántico y luminoso, tonos suaves, propio de una pedida de mano",
    "GRADUACION": "estilo luminoso y orgulloso, colores vivos, propio de una graduación",
    "JUBILACION": "estilo cálido y festivo, tonos cercanos, propio de una celebración de jubilación"
  };
  return defaults[tipo] || "estilo editorial cálido y natural, alta calidad fotográfica";
}

/**
 * Envía una foto (File de Drive) a Gemini para editarla en el estilo indicado.
 * Devuelve un Blob con la imagen editada, listo para guardar en Drive.
 */
function procesarFotoConGemini(file, estiloPrompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  if (!apiKey) throw new Error("Falta GEMINI_API_KEY en Propiedades del Script");

  const blob = file.getBlob();
  const base64 = Utilities.base64Encode(blob.getBytes());
  const mimeType = blob.getContentType() || "image/jpeg";

  const prompt = `Edita esta fotografía aplicando este estilo: ${estiloPrompt}. Mantén el sujeto principal y la composición reconocibles, mejora luz y color de forma artística.`;
  const payload = {
    contents: [{
      parts: [
        { inline_data: { mime_type: mimeType, data: base64 } },
        { text: prompt }
      ]
    }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"]
    }
  };

  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=" + apiKey;

  const response = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const codigo = response.getResponseCode();
  const texto = response.getContentText();
  if (codigo !== 200) {
    throw new Error("Gemini API error " + codigo + ": " + texto);
  }

  const data = JSON.parse(texto);
  const parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
  if (!parts) throw new Error("Respuesta de Gemini sin contenido: " + texto);

  const imagenPart = parts.find(p => p.inlineData || p.inline_data);
  if (!imagenPart) throw new Error("Gemini no devolvió ninguna imagen: " + texto);

  const inline = imagenPart.inlineData || imagenPart.inline_data;
  const bytes = Utilities.base64Decode(inline.data);
  const mimeSalida = inline.mimeType || inline.mime_type || "image/png";

  return Utilities.newBlob(bytes, mimeSalida, "editada.jpg");
}