#!/usr/bin/env python3
import os
import io
import time
import torch
from PIL import Image, ImageEnhance, ImageFilter

# Librerías oficiales de Google API
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload

# Motor de IA
from diffusers import StableDiffusionInstructPix2PixPipeline, EulerAncestralDiscreteScheduler

SCOPES = ['https://www.googleapis.com/auth/drive']
RUTA_CREDS = 'credenciales.json'
RUTA_TOKEN = 'token.json'

def obtener_servicio_drive():
    creds = None
    if os.path.exists(RUTA_TOKEN):
        creds = Credentials.from_authorized_user_file(RUTA_TOKEN, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(RUTA_CREDS):
                print(f"❌ Error: No se encuentra el archivo '{RUTA_CREDS}'.")
                return None
            flow = InstalledAppFlow.from_client_secrets_file(RUTA_CREDS, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(RUTA_TOKEN, 'w') as token:
            token.write(creds.to_json())
    return build('drive', 'v3', credentials=creds)

def gestionar_drive_cliente(drive_service, email_cliente, tema_elegido):
    query = f"name = '{email_cliente}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    resultados = drive_service.files().list(q=query, fields="files(id)").execute()
    items = resultados.get('files', [])
    
    if not items:
        print(f"❌ No se encontró ninguna carpeta para el correo: {email_cliente}")
        return None, None, None
    
    id_carpeta_cliente = items[0]['id']
    
    query_foto = f"name = 'foto_boda_original.jpg' and '{id_carpeta_cliente}' in parents and trashed = false"
    res_foto = drive_service.files().list(q=query_foto, fields="files(id)").execute()
    fotos = res_foto.get('files', [])
    
    if not fotos:
        print("❌ No se encontró 'foto_boda_original.jpg' en la carpeta.")
        return None, None, None
    
    id_foto_original = fotos[0]['id']
    ruta_local_entrada = "temp_original.jpg"
    
    print("📥 Descargando foto original...")
    request = drive_service.files().get_media(fileId=id_foto_original)
    with io.FileIO(ruta_local_entrada, 'wb') as fh:
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        while not done:
            status, done = downloader.next_chunk()
            
    ruta_local_salida = f"temp_resultado_{tema_elegido}.jpg"
    return ruta_local_entrada, ruta_local_salida, id_carpeta_cliente

def subir_resultado_drive(drive_service, ruta_local_resultado, id_carpeta_padre, tema):
    nombre_archivo_drive = f"foto_boda_{tema}.jpg"
    print(f"📤 Subiendo '{nombre_archivo_drive}' a Google Drive...")
    
    file_metadata = {
        'name': nombre_archivo_drive,
        'parents': [id_carpeta_padre]
    }
    media = MediaFileUpload(ruta_local_resultado, mimetype='image/jpeg', resumable=True)
    
    try:
        archivo_subido = drive_service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id'
        ).execute()
        print(f"🎉 ¡Foto guardada con éxito en Drive! ID: {archivo_subido.get('id')}")
    except Exception as e:
        print(f"❌ Error crítico en la subida: {e}")

# 🌟 NUEVA FUNCIÓN: Recuperación automática de sombras (Flash de relleno digital)
def iluminar_sombras_contraluz(imagen_pil):
    print("🔦 Aplicando balance dinámico de exposición en sombras (Curva Gamma)...")
    
    # Separamos los canales de la imagen (Red, Green, Blue)
    r, g, b = imagen_pil.split()
    
    # Exponente Gamma < 1.0 estira los tonos oscuros (saca luz de donde no la hay)
    gamma = 0.55
    
    r_corregido = r.point(lambda i: int(((i / 255.0) ** gamma) * 255))
    g_corregido = g.point(lambda i: int(((i / 255.0) ** gamma) * 255))
    b_corregido = b.point(lambda i: int(((i / 255.0) ** gamma) * 255))
    
    # Reconstruimos la imagen con los canales ya iluminados
    foto_iluminada = Image.merge('RGB', (r_corregido, g_corregido, b_corregido))
    
    # Le devolvemos un punto de contraste para que no quede lavada o grisácea
    potenciador_contraste = ImageEnhance.Contrast(foto_iluminada)
    foto_final = financiero = potenciador_contraste.enhance(1.2)
    
    # 🌟 CORREGIDO: Devolvemos la imagen correctamente para que la IA la reciba
    return foto_final

def editar_foto_con_ia_local(ruta_entrada, ruta_salida, tema_elegido):
    # Optimizamos los prompts eliminando ambigüedades de contraste duro
    banco_prompts = {
        "vogue": (
            "High-end fashion magazine editorial photography, Vogue style. Beautiful natural full color, "
            "professional studio lighting on the couple, soft golden hour sunset glow, elegant fill light, "
            "crisp sharp details, sophisticated look, commercial wedding photography. Perfectly balanced skin tones. "
            "Strictly avoid black and white, do not desaturate."
        ),
        "nostalgia": "Vintage 35mm warm film photograph, beautiful 70s wedding colors, soft nostalgic cinematic lighting.",
        "cinematic": "Moody cinematic movie still, clear faces, teal and orange color grade, rich colorful lighting.",
        "bw": "Classic high-contrast elegant black and white photography, studio lighting.",
        "magic": "Magical fairytale wonderland scene, vibrant fantasy colors, soft glow."
    }

    print(f"\n🤖 Inicializando Inteligencia Artificial en modo CPU...")
    torch.set_num_threads(os.cpu_count()) 
    
    pipe = StableDiffusionInstructPix2PixPipeline.from_pretrained(
        "timbrooks/instruct-pix2pix", 
        safety_checker=None
    ).to("cpu")
    
    pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(pipe.scheduler.config)
    pipe.enable_attention_slicing() 

    # Cargar y redimensionar imagen original
    image = Image.open(ruta_entrada).convert("RGB")
    image.thumbnail((512, 512)) 

    # 🌟 PASO CLAVE: Ejecutamos el bypass antes de que la IA procese la foto
    image = iluminar_sombras_contraluz(image)

    
    # Ajustes de fuerza dinámicos para clavar el estilo de la muestra
    if tema_elegido == "vogue":
        guidance = 7.0       # Qué tanto caso le hace al texto del prompt
        img_guidance = 1.7   # Qué tan fiel es a los colores y formas de la foto original (Alto = mantiene el color)
    elif tema_elegido == "cinematic":
        guidance = 8.0
        img_guidance = 1.4   # Más bajo para que la IA se atreva a cambiar radicalmente el color grading a teal/orange
    else:
        guidance = 7.5
        img_guidance = 1.5

    print("⚡ Procesando píxeles en local...")
    tiempo_inicio = time.time()
    
    # Pasamos los parámetros optimizados al modelo
    result = pipe(
        banco_prompts[tema_elegido], 
        image=image, 
        num_inference_steps=30,
        guidance_scale=guidance,
        image_guidance_scale=img_guidance
    ).images[0]
    result.save(ruta_salida)
    print(f"⏱️ Revelado local terminado en {time.time() - tiempo_inicio:.2f} segundos.")

if __name__ == "__main__":
    print("====================================")
    print(" 🚀 EL ÁLBUM B: MOTOR LOCAL PRO v2 ")
    print("====================================")
    
    drive_service = obtener_servicio_drive()
    if not drive_service:
        exit()

    email = input("📩 Introduce el email del cliente a procesar: ").strip().lower()
    
    print("\nSelecciona el estilo:")
    print("1. Vogue / 2. Nostalgia / 3. Cinematic / 4. B&W / 5. Magic")
    opcion = input("Número (1-5): ")
    mapeo = {"1": "vogue", "2": "nostalgia", "3": "cinematic", "4": "bw", "5": "magic"}
    tema = mapeo.get(opcion, "vogue")

    ruta_in, ruta_out, id_carpeta = gestionar_drive_cliente(drive_service, email, tema)
    
    if ruta_in and ruta_out and id_carpeta:
        try:
            editar_foto_con_ia_local(ruta_in, ruta_out, tema)
            subir_resultado_drive(drive_service, ruta_out, id_carpeta, tema)
        except Exception as e:
            print(f"❌ Ocurrió un error: {e}")
        finally:
            print("\n🧹 Limpiando temporales locales...")
            if os.path.exists(ruta_in): os.remove(ruta_in)
            if os.path.exists(ruta_out): os.remove(ruta_out)
            print("✨ Proceso completado.")