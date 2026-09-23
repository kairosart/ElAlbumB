/************************************************************
 *  ARCHIVO DE TESTS COMPLETO — EL ÁLBUM B
 *  Permite probar TODO sin rellenar el formulario
 ************************************************************/


/************************************************************
 * 1. TEST — PRUEBA GRATIS (evento falso)
 ************************************************************/
function test_PruebaGratis() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("PRUEBA GRATIS");

  const fila = 2; // cambia la fila que quieras probar

  const e = {
    range: sheet.getRange(fila, 1),
    namedValues: {
      "Dirección de correo electrónico": ["cliente@test.com"],
      "Estilo": ["Cinematic Drama"],
      "Foto": ["https://drive.google.com/file/d/1A0CbemkNty0uwmlofYbBEQJLtE0uhSm5/view?usp=sharing"]
    }
  };

  ejecutarPruebaGratis(e);
}



/************************************************************
 * 2. TEST — PACK EXPRESS (evento falso)
 ************************************************************/
function test_PackExpress() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("PACK EXPRESS");

  const fila = 57;

  const e = {
    range: sheet.getRange(fila, 1),
    namedValues: {
      "Dirección de correo electrónico": ["cliente@test.com"],
      "Nombre": ["Cliente Test"]
    }
  };

  onFormSubmit(e);
}

function testWebhookPackExpressManual() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("PACK EXPRESS");
  const filaPrueba = 58; // Cambia a la fila donde esté tu prueba del Pack Express
  
  const emailCliente = sheet.getRange(filaPrueba, 2).getValue();
  const estiloElegido = sheet.getRange(filaPrueba, 5).getValue();
  const fileIdsRaw = sheet.getRange(filaPrueba, 7).getValue();

  Logger.log("Simulando pago completado para: " + emailCliente);
  
  // Cambiamos el estado a Revelando y ejecutamos directamente el motor de Vertex AI
  sheet.getRange(filaPrueba, 8).setValue("Revelando...");
  
  const urlCarpeta = ejecutarReveladoGemini(sheet, filaPrueba, emailCliente, estiloElegido, fileIdsRaw);
  const nombreCliente = sheet.getRange(filaPrueba, 3).getValue() || "Cliente";
  
  // Crear la sesión de Stripe y enviar el enlace de pago por correo al cliente
  const referenciaUnica = "PACK_EXPRESS_FILA_" + filaPrueba;
  const urlPagoDinamica = crearSesionStripeDinamica("Pack Express", CONFIG_PACKS.EXPRESS.precio, emailCliente, referenciaUnica);

  enviarEmailPagoStripe(emailCliente, nombreCliente, urlPagoDinamica);

  if (urlCarpeta) {
    Logger.log("¡Pack Express procesado con éxito! Carpeta: " + urlCarpeta);
  } else {
    Logger.log("Error en el procesado del Pack Express.");
  }
}

/************************************************************
 * 3. TEST — Revelado Gemini directo (sin formulario)
 ************************************************************/
function test_GeminiDirecto() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("PRUEBA GRATIS");

  const fila = 5;
  const email = "cliente@test.com";
  const estilo = "Cinematic Drama";
  const fileId = "ID_DE_FOTO_EN_DRIVE";

  ejecutarReveladoGemini(sheet, fila, email, estilo, fileId);
}



/************************************************************
 * 4. TEST — Webhook Stripe (simulación de pago completado)
 ************************************************************/
function test_WebhookStripe() {
  const e = {
    postData: {
      contents: JSON.stringify({
        type: "checkout.session.completed",
        data: {
          object: {
            customer_email: "cliente@test.com",
            client_reference_id: "PACK EXPRESS_FILA_10"
          }
        }
      })
    }
  };

  doPost(e);
}



/************************************************************
 * 5. TEST — Extraer ID de Drive
 ************************************************************/
function test_ExtraerID() {
  const url = "https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz123456/view?usp=sharing";
  const id = extraerIdDrive(url);
  Logger.log("ID extraído: " + id);
}



/************************************************************
 * 6. TEST — Crear carpeta y guardar archivo
 ************************************************************/
function test_CrearCarpetaYGuardar() {
  const carpetaRaiz = DriveApp.getFolderById(CARPETA_RAIZ_ID);
  const carpeta = carpetaRaiz.createFolder("test_cliente@test.com");

  const blob = Utilities.newBlob("Hola mundo", "text/plain", "test.txt");
  const archivo = carpeta.createFile(blob);

  Logger.log("Carpeta: " + carpeta.getUrl());
  Logger.log("Archivo: " + archivo.getUrl());
}




/************************************************************
 * 7. TEST — Envío de email
 ************************************************************/
function test_Email() {
  GmailApp.sendEmail(
    "cliente@test.com",
    "Test Email",
    "Este es un email de prueba enviado desde Apps Script."
  );
}



/************************************************************
 * 8. TEST — Evento sin formulario (solo namedValues)
 ************************************************************/
function test_EventoSinFormulario() {
  const e = {
    namedValues: {
      "Dirección de correo electrónico": ["cliente@test.com"],
      "Nombre": ["Cliente Test"]
    }
  };

  onFormSubmit(e);
}



/************************************************************
 * 9. TEST — PRUEBA GRATIS con múltiples fotos
 ************************************************************/
function test_PruebaGratis_MultiplesFotos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("PRUEBA GRATIS");

  const fila = 6;

  const e = {
    range: sheet.getRange(fila, 1),
    namedValues: {
      "Dirección de correo electrónico": ["cliente@test.com"],
      "Estilo": ["Fine Art"],
      "Foto": [
        "https://drive.google.com/file/d/ID1/view",
        "https://drive.google.com/file/d/ID2/view",
        "https://drive.google.com/file/d/ID3/view"
      ]
    }
  };

  ejecutarPruebaGratis(e);
}


/************************************************************
 * 10. TEST — PRUEBA ESTILOS FIJOS Y OTROS
 ************************************************************/

function probarFuncionEstilos() {
  // 1. Simula un archivo existente en tu Google Drive para la prueba
  // (Reemplaza 'PON_AQUI_UN_ID_DE_IMAGEN' por el ID real de una foto de prueba que tengas en tu Drive)
  const archivoPrueba = DriveApp.getFileById("1cQfOxh8q3LzvAMnWRsrceK8URVZUPJCH");
  const carpetaRaiz = DriveApp.getRootFolder();
  
  /* 2. Probar con un estilo fijo de tu diccionario y guardarlo en la raíz
  Logger.log("--- PROBANDO ESTILO FIJO ---");
  try {
    const resultadoFijo = procesarFotoConVertexAI(archivoPrueba, "Vogue Chic");
    const archivoGuardadoFijo = carpetaRaiz.createFile(resultadoFijo);
    Logger.log("✅ Éxito con estilo fijo. Guardado en la raíz con ID: " + archivoGuardadoFijo.getId());
  } catch (error) {
    Logger.log("❌ Error con estilo fijo: " + error.message);
  }*/

  // 3. Probar con texto personalizado simulando la opción "Otro" y guardarlo en la raíz
  Logger.log("--- PROBANDO TEXTO PERSONALIZADO (OTRO) ---");
  try {
    const resultadoOtro = procesarFotoConVertexAI(archivoPrueba, "Retro Pop Art");
    const archivoGuardadoOtro = carpetaRaiz.createFile(resultadoOtro);
    Logger.log("✅ Éxito con texto personalizado. Guardado en la raíz con ID: " + archivoGuardadoOtro.getId());
  } catch (error) {
    Logger.log("❌ Error con texto personalizado: " + error.message);
  }
}

/************************************************************
 * 11. TEST — PRUEBA TODOS ESTILOS FIJOS
 ************************************************************/

function revelarTodosLosEstilos() {
  // ID de la foto original en Google Drive que has proporcionado
  const fileId = "1cQfOxh8q3LzvAMnWRsrceK8URVZUPJCH";
  
  Logger.log("🚀 Iniciando prueba masiva de estilos con la imagen ID: " + fileId);
  // 1. Obtener el archivo de imagen original desde Drive
  const archivoOriginal = DriveApp.getFileById(fileId);
  
  // 2. Buscar o crear la carpeta "Test estilos" en el directorio raíz
  let carpetaTest;
  const carpetas = DriveApp.getFoldersByName("Test estilos");
  if (carpetas.hasNext()) {
    carpetaTest = carpetas.next();
  } else {
    carpetaTest = DriveApp.createFolder("Test estilos");
  }
  
  Logger.log("📁 Carpeta de destino lista: 'Test estilos'");

  // 3. Diccionario con todos los estilos solicitados
  const estilosMap = ESTILOS_PROMPT;

  // 4. Iterar sobre cada estilo, procesar con Vertex AI y guardar en la carpeta
  for (const [nombreEstilo, promptEstilo] of Object.entries(estilosMap)) {
    Logger.log(`🎨 Procesando estilo: ${nombreEstilo}...`);
    
    try {
      // Llamamos a tu función de procesamiento pasando el prompt específico del estilo
      const blobEditado = procesarFotoConVertexAI(archivoOriginal, promptEstilo);
      
      // Renombramos el blob para identificar claramente cada estilo generado
      const nombreArchivoLimpio = nombreEstilo.toLowerCase().replace(/\s+/g, '_');
      blobEditado.setName(`editada_${nombreArchivoLimpio}.jpg`);
      
      // Guardamos el archivo resultante dentro de la carpeta "Test estilos"
      const archivoGuardado = carpetaTest.createFile(blobEditado);
      Logger.log(`✅ Guardado con éxito: ${archivoGuardado.getName()} (ID: ${archivoGuardado.getId()})`);
      
      // Pequeña pausa opcional entre llamadas masivas para evitar saturación de la API
      Utilities.sleep(2000);
      
    } catch (error) {
      Logger.log(`❌ Error procesando el estilo [${nombreEstilo}]: ${error.message}`);
    }
  }

  Logger.log("🎉 ¡Proceso de revelado masivo completado!");
}



/************************************************************
 * 12. TEST — Probar el control de plazos y cupos
 * Esto verifica si un evento permite subir fotos actualmente (según la fecha y el límite de 200 fotos).
 ************************************************************/


function probarVerificarPlazo() {
  // REEMPLAZA "BODA_123456" por un código de evento real
  const codigoDePrueba = "Ruta Vintage_F932501C"; 
  
  // Simulamos la fecha actual (puedes cambiarla para probar si el evento está caducado o aún no empieza)
  const fechaActualFalsa = new Date().getTime(); 

  const resultado = verificarPlazoSubida(codigoDePrueba, fechaActualFalsa);
  
  // Imprime el resultado en los "Registros de ejecución" (Logs)
  Logger.log(JSON.stringify(resultado, null, 2));
}


/************************************************************
 * 13. TEST — Probar el tipo de evento: EVENTO o GRAN FIESTA
 ************************************************************/


function probarSimulacion() {
  // Simulamos el objeto de evento 'e' que manda Google Forms al rellenar
  var eSimulado = {
    namedValues: {
      "Dirección de correo electrónico": ["elalbumb@gmail.com"], // Pon tu correo real aquí para recibir el email de prueba
      "Nombre": ["Probador de El Álbum B"],
      "Selecciona tu pack": ["GRAN FIESTA"] // Cambia esto a "EVENTOS" o "GRAN FIESTA" para probar ambos
    },
    range: {
      getSheet: function() {
        // Devuelve la hoja activa o búscala por su nombre exacto
        return SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ALBUM_B_EVENTOS");
      },
      getRow: function() {
        // Elige una fila de prueba en tu hoja (asegúrate de que sea una fila vacía o de prueba para no pisar datos)
        return 27; 
      }
    }
  };

  // Llamamos a tu función principal pasándole el evento simulado
  // (Asegúrate de que el nombre de tu función principal sea el que maneja el onFormSubmit, por ejemplo: handleFormSubmit(eSimulado))
  onFormSubmit(eSimulado);
  
  Logger.log("¡Prueba de simulación ejecutada con éxito!");
}