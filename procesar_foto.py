#!/usr/bin/env python3
import os
from google import genai
from google.genai import types
from PIL import Image
import io

def revelar_foto_express(ruta_entrada, ruta_salida):
    # 1. Inicializar cliente
    client = genai.Client()
    
    # 2. Cargar imagen original
    try:
        imagen_original = Image.open(ruta_entrada)
        print(f"📸 Leyendo imagen original: {ruta_entrada}")
    except Exception as e:
        print(f"❌ Error al abrir la imagen: {e}")
        return

    # Convertir la imagen de Pillow a bytes que es lo que acepta el modelo Imagen
    img_byte_arr = io.BytesIO()
    imagen_original.save(img_byte_arr, format='JPEG')
    imagen_bytes = img_byte_arr.getvalue()

    # 3. Prompt con el estilo comercial de El Álbum B
    prompt_estilo = (
        "Edit this wedding photo to look like a vintage 35mm film photograph (Kodak Portra 400 style). "
        "Warm golden tones, natural skin tones, soft matte shadows, and subtle film grain texture. "
        "Clean up the background by removing clutter like cables or signs naturally."
    )

    print("🤖 Enviando imagen a Imagen 3 para el revelado analógico...")
    
    try:
        # 4. Llamada al modelo oficial de edición de imágenes
        response = client.models.generate_images(
            model='imagen-3.0-generate-002', # El modelo real y disponible en la API
            prompt=prompt_estilo,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                output_mime_type="image/jpeg",
                # Pasamos la imagen original en los modos de edición permitidos
                image_input=imagen_bytes 
            )
        )

        # 5. Guardar el archivo Jpeg procesado
        for generated_image in response.generated_images:
            image = Image.open(io.BytesIO(generated_image.image.image_bytes))
            image.save(ruta_salida)
            print(f"🎉 ¡Revelado completado con éxito! Guardado en: {ruta_salida}")

    except Exception as e:
        print(f"❌ Error durante el procesamiento con la API: {e}")

if __name__ == "__main__":
    archivo_entrada = "foto_boda_original.jpg" 
    archivo_salida = "foto_boda_nostalgia.jpg"
    
    if os.path.exists(archivo_entrada):
        revelar_foto_express(archivo_entrada, archivo_salida)
    else:
        print(f"⚠️ Por favor, coloca una foto llamada '{archivo_entrada}' en esta carpeta.")