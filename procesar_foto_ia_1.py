#!/usr/bin/env python3
import os
import time
import torch
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
import numpy as np

from diffusers import StableDiffusionInstructPix2PixPipeline, EulerAncestralDiscreteScheduler

# Librerías oficiales de Google Drive
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload

# --- CONFIGURACIÓN DE SEGURIDAD Y ACCESO ---
SCOPES = ['https://www.googleapis.com/auth/drive']
RUTA_CLIENT_SECRET = 'credenciales_oauth.json'
RUTA_TOKEN = 'token.json'


def obtener_servicio_drive_usuario():
    creds = None
    if os.path.exists(RUTA_TOKEN):
        creds = Credentials.from_authorized_user_file(RUTA_TOKEN, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(RUTA_CLIENT_SECRET):
                print(f"❌ Error: Falta el archivo '{RUTA_CLIENT_SECRET}' en la carpeta.")
                return None
            flow = InstalledAppFlow.from_client_secrets_file(RUTA_CLIENT_SECRET, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(RUTA_TOKEN, 'w') as token:
            token.write(creds.to_json())
    return build('drive', 'v3', credentials=creds)


def gestionar_drive_cliente(drive_service, email_cliente, tema_elegido):
    query = f"name = '{email_cliente}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    resultados = drive_service.files().list(q=query, fields="files(id)").execute()
    items = resultados.get('files', [])
    
    if not items:
        print(f"❌ No se encontró la carpeta del cliente: {email_cliente}")
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
    print("📥 Descargando foto original desde Drive...")
    request = drive_service.files().get_media(fileId=id_foto_original)
    with open(ruta_local_entrada, 'wb') as f:
        downloader = MediaIoBaseDownload(f, request)
        done = False
        while not done:
            status, done = downloader.next_chunk()
            
    ruta_local_salida = f"temp_resultado_{tema_elegido}.jpg"
    return ruta_local_entrada, ruta_local_salida, id_carpeta_cliente


def subir_resultado_drive(drive_service, ruta_local_resultado, id_carpeta_padre, tema):
    nombre_archivo_drive = f"foto_boda_{tema}.jpg"
    print(f"📤 Subiendo '{nombre_archivo_drive}' a Drive...")
    file_metadata = {'name': nombre_archivo_drive, 'parents': [id_carpeta_padre]}
    media = MediaFileUpload(ruta_local_resultado, mimetype='image/jpeg')
    archivo_subido = drive_service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    print(f"🎉 ¡Subida completada con éxito! Archivo ID: {archivo_subido.get('id')}")


# --- MOTOR HÍBRIDO ESTABLE: PROTECCIÓN MATRICIAL DE SUJETOS (SIN MEDIAPIPE) ---
def editar_foto_con_ia_local(ruta_entrada, ruta_salida, tema_elegido):
    banco_prompts = {
        "vogue": "High-end Vogue fashion magazine style, luxury professional editorial lighting, intense warm golden hour sunset backlight, dramatic sky background",
        "nostalgia": "Warm nostalgic 35mm vintage analog film look, retro warm colors, distinct cinematic film grain, slightly soft background contrast",
        "cinematic": "Intense movie still scene, anamorphic lens flare, high contrast shadows, deep cinematic teal-and-orange color grading",
        "bw": "Masterfully crafted high-contrast black and white fine art photography, deep black levels, bright whites, dramatic dark sky background",
        "magic": "Magical fairytale wonderland atmosphere, vibrant emerald background forest, glowing ethereal light particles, soft mysterious dream mist"
    }

    print(f"\n🧠 Analizando estructura de la imagen original...")
    tiempo_inicio = time.time()

    try:
        # 1. Cargamos la imagen original y la ajustamos para la CPU
        img_original = Image.open(ruta_entrada).convert("RGB")
        img_original.thumbnail((512, 512))
        ancho, alto = img_original.size

        # 2. CREACIÓN DE MÁSCARA AUTOMÁTICA CENTRADA (Protección nativa del centro de encuadre)
        # En fotografía de bodas (plano general o medio), los novios ocupan el tercio central.
        print("🎭 Generando máscara de aislamiento analógica para los novios...")
        mascara_fusion = Image.new("L", (ancho, alto), 0)
        draw = ImageDraw.Draw(mascara_fusion)
        
        # Definimos una zona elíptica estilizada en el centro que cubre los cuerpos y rostros
        x1, y1 = int(ancho * 0.20), int(alto * 0.10)
        x2, y2 = int(ancho * 0.80), int(alto * 0.95)
        draw.ellipse([x1, y1, x2, y2], fill=255)
        
        # Desenfoque gaussiano ultra-ancho para que la transición entre la IA y los novios sea invisible
        mascara_fusion = mascara_fusion.filter(ImageFilter.GaussianBlur(radius=25))

        # 3. PROCESAMIENTO IA: Render local en CPU del fondo y atmósfera
        print("⚙️ Cargando motor IA local en CPU...")
        pipe = StableDiffusionInstructPix2PixPipeline.from_pretrained(
            "timbrooks/instruct-pix2pix", 
            torch_dtype=torch.float32, 
            safety_checker=None
        ).to("cpu")
        
        pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(pipe.scheduler.config)
        pipe.enable_attention_slicing()

        print("⚡ Modificando radicalmente el entorno e iluminación con la IA...")
        img_ia = pipe(
            prompt=banco_prompts[tema_elegido],
            image=img_original,
            num_inference_steps=6,
            guidance_scale=8.5,
            image_guidance_scale=1.1
        ).images[0]

        # 4. ACOPLAMIENTO HÍBRIDO INTELIGENTE
        print("🎭 Fusionando capas: Protegiendo nitidez central y aplicando fondo artístico...")
        # Combinamos la foto original (centro nítido) con el render de la IA (fondo cambiado)
        #img_final = Image.composite(img_original, img_ia, mascara_fusion)
        # Por esto otro (para usar solo lo que genera la IA):
        img_final = img_ia
        
        # Un toque extra de revelado global para unificar los colores de ambas capas
        img_final = ImageEnhance.Color(img_final).enhance(1.08)

        img_final.save(ruta_salida, "JPEG", quality=95)
        print(f"⏱️ ¡Proceso completado con éxito en {time.time() - tiempo_inicio:.2f} segundos!")

    except Exception as e:
        print(f"❌ Error crítico en el proceso híbrido: {e}")
        Image.open(ruta_entrada).save(ruta_salida)


if __name__ == "__main__":
    print("==================================================")
    print("   🎭   SISTEMA HÍBRIDO ESTABLE: EL ÁLBUM B       ")
    print("==================================================")
    
    drive_service = obtener_servicio_drive_usuario()
    if not drive_service:
        exit()

    email = input("📩 Email del cliente: ").strip().lower()
    print("\n1. Vogue / 2. Nostalgia / 3. Cinematic / 4. B&W / 5. Magic")
    opcion = input("Estilo (1-5): ")
    mapeo = {"1": "vogue", "2": "nostalgia", "3": "cinematic", "4": "bw", "5": "magic"}
    tema = mapeo.get(opcion, "nostalgia")

    ruta_in, ruta_out, id_carpeta = gestionar_drive_cliente(drive_service, email, tema)
    
    if ruta_in and ruta_out and id_carpeta:
        editar_foto_con_ia_local(ruta_in, ruta_out, tema)
        subir_resultado_drive(drive_service, ruta_out, id_carpeta, tema)
        
        if os.path.exists(ruta_in): os.remove(ruta_in)
        if os.path.exists(ruta_out): os.remove(ruta_out)
        print("✨ Tareas terminadas de forma limpia.")