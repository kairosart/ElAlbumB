# =====================================================================
# 🚀 PROYECTO: EL ÁLBUM B (VERSION 9.8 MASTER - PRODUCTION READY)
# CORRECCIONES APLICADAS:
#   [FIX-1] Orden de operaciones: sharpening DESPUÉS del compositing
#   [FIX-2] Descontaminación trabaja sobre RGBA correctamente
#   [FIX-3] Light Wrap aplicado sobre composición final, no sobre sujetos aislados
#   [FIX-4] Marco con compensación lateral correcta
#   [FIX-5] Compatibilidad con rembg >= 2.0.50 (new_session deprecado)
# =====================================================================

import os
import time
import glob
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageChops

try:
    import rembg
    # [FIX-5] new_session fue renombrado a new_session en algunas versiones,
    # pero en rembg >= 2.0.50 el import correcto es desde rembg directamente.
    # Usamos getattr para compatibilidad con ambas versiones.
    _new_session = getattr(rembg, "new_session", None)
    if _new_session is None:
        from rembg.session_factory import new_session as _new_session
    from rembg import remove
    from google.colab import drive, userdata
    from huggingface_hub import InferenceClient
    print("✅ Motores de ultra-definición y descontaminación V9.8 listos.")
except ModuleNotFoundError as e:
    print(f"❌ Error: Instala las librerías necesarias en tu entorno Colab.\n   Faltante: {e}")
    raise SystemExit


class ElAlbumB_V9_8_Master:
    def __init__(self):
        print("\n🔗 Conectando con Google Drive...")
        drive.mount('/content/drive', force_remount=True)
        self.ruta_base = "/content/drive/MyDrive/ElAlbumB_Clientes/"

        # [1] ALPHA MATTING MEJORADO: Sesión dedicada con red de segmentación fina
        self.session = _new_session("u2net_human_seg")

        try:
            hf_token = userdata.get('HF_TOKEN')
            self.client = InferenceClient(
                model="black-forest-labs/FLUX.1-schnell", token=hf_token
            )
            print("✅ Conexión con FLUX.1 establecida.")
        except Exception as e:
            print("❌ Error de autenticación con el HF_TOKEN.")
            raise e

        self.banco_prompts = {
            "finca": (
                "Wide-angle professional studio photography of beautiful rolling green hills, "
                "clean vibrant sunset sky, sharp focus, rich natural colors, cinematic lighting, "
                "8k, no people"
            ),
            "vogue": (
                "Wide-angle luxury modern villa open terrace overlooking a breathtaking coastal "
                "ocean sunset, professional editorial photography, sharp focus, vibrant golden "
                "hour, no people"
            ),
            "nostalgia": (
                "Wide-angle professional photography of an empty charming private colonial "
                "courtyard at sunset, warm terracotta walls, romantic golden ambient light, "
                "sharp focus, 8k, no people"
            ),
            "magic": (
                "Wide-angle editorial landscape of a mystical beautiful green valley during "
                "twilight, soft glowing lighting, dramatic sky with intense warm clouds, "
                "sharp focus, no people"
            ),
            "cinematic": (
                "Wide-angle dramatic cinematic landscape framing, rolling hills under an epic "
                "saturated twilight sunset sky, deep rich contrast, professional photography, "
                "8k, no people"
            ),
        }

    # ------------------------------------------------------------------
    # UTILIDADES
    # ------------------------------------------------------------------

    def _calcular_dimensiones_flux(self, ancho_orig, alto_orig):
        """[6] Proporción correcta para FLUX (múltiplos de 16)."""
        proporcion = ancho_orig / alto_orig
        if proporcion >= 1.0:
            ancho_flux = 1024
            alto_flux = int(1024 / proporcion)
        else:
            alto_flux = 1024
            ancho_flux = int(1024 * proporcion)
        return (ancho_flux // 16) * 16, (alto_flux // 16) * 16

    def _inyectar_micro_grano_fondo(self, img_pil, intensidad=3.0):
        """Añade grano fotográfico sutil al fondo generado."""
        arr = np.array(img_pil).astype(np.float32)
        luma = (
            0.299 * arr[..., 0]
            + 0.587 * arr[..., 1]
            + 0.114 * arr[..., 2]
        )
        modulador = np.clip(1.0 - (np.abs(luma - 120.0) / 150.0), 0.2, 1.0)
        ruido_base = np.random.normal(0, intensidad, luma.shape)
        ruido_modulado = ruido_base * modulador
        for i in range(3):
            arr[..., i] += ruido_modulado
        return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

    def _aplicar_high_pass_sharpen(self, img_pil, radio=2, fuerza=1.1):
        """[3] High Pass Sharpen estilo Photoshop sobre imagen RGB."""
        arr_orig = np.array(img_pil).astype(np.float32)
        arr_blur = np.array(
            img_pil.filter(ImageFilter.GaussianBlur(radius=radio))
        ).astype(np.float32)
        arr_high = arr_orig - arr_blur
        arr_result = np.clip(arr_orig + fuerza * arr_high, 0, 255)
        return Image.fromarray(arr_result.astype(np.uint8))

    def _optimizar_nitidez_rostros(self, img_pil):
        """[2] Micro-contraste y enfoque localizado para presencia facial."""
        fino = img_pil.filter(
            ImageFilter.UnsharpMask(radius=1.2, percent=140, threshold=2)
        )
        pop = ImageEnhance.Contrast(fino).enhance(1.08)
        return ImageEnhance.Brightness(pop).enhance(1.04)

    def _aislar_region_clara_vestido(self, img_original_rgb, alpha_mask):
        """[5] Segmentación por siembra luminosa para vestidos y velos."""
        arr_alpha = np.array(alpha_mask)
        arr_luma = np.array(img_original_rgb.convert("L"))
        arr_seed = (
            ((arr_alpha > 240) & (arr_luma > 125)).astype(np.uint8) * 255
        )
        img_seed = Image.fromarray(arr_seed)
        return img_seed.filter(ImageFilter.MaxFilter(35))

    def _descontaminar_halos_negros(
        self, img_rgb, alpha_mask, mascara_vestido_velo
    ):
        """[FIX-2] Elimina halos negros en bordes de tejidos claros.
        Trabaja sobre RGB puro + alpha separado (sin asumir RGBA en entrada).
        """
        arr = np.array(img_rgb).astype(np.float32)
        arr_alpha = np.array(alpha_mask).astype(np.float32) / 255.0
        arr_zona = np.array(mascara_vestido_velo)

        frontera_velo = (
            (arr_alpha > 0.01) & (arr_alpha < 0.96) & (arr_zona > 0)
        )
        factor = (1.0 - arr_alpha) * 0.95
        marfil = [246.0, 244.0, 240.0]

        for i in range(3):
            reconstruido = arr[..., i] + (marfil[i] - arr[..., i]) * factor
            arr[..., i] = np.where(
                frontera_velo,
                np.clip(reconstruido, 0, 255),
                arr[..., i],
            )
        return Image.fromarray(arr.astype(np.uint8))

    def _aplicar_light_wrap(
        self, composicion_rgb, alpha_mask, fondo_pil, radio=4, intensidad=0.18
    ):
        """[FIX-3] Light Wrap aplicado sobre la COMPOSICIÓN FINAL (no sobre
        los sujetos aislados). Esto produce el sangrado de luz correcto porque
        ya existe el contraste borde-sujeto / borde-fondo en la imagen mezclada.
        """
        radio_impar = radio if radio % 2 != 0 else max(3, radio - 1)
        fondo_blur = fondo_pil.filter(
            ImageFilter.GaussianBlur(radius=radio_impar * 2)
        )

        alpha_encogido = alpha_mask.filter(ImageFilter.MinFilter(radio_impar))
        borde_interno = ImageChops.subtract(alpha_mask, alpha_encogido)
        borde_suave = borde_interno.filter(
            ImageFilter.GaussianBlur(radius=radio_impar / 2)
        )
        if intensidad < 1.0:
            borde_suave = ImageEnhance.Brightness(borde_suave).enhance(
                intensidad
            )

        resultado = composicion_rgb.copy()
        resultado.paste(fondo_blur, (0, 0), borde_suave)
        return resultado

    # ------------------------------------------------------------------
    # PIPELINE PRINCIPAL
    # ------------------------------------------------------------------

    def revelar_foto_master(self, ruta_entrada, ruta_salida, tema):
        try:
            img_original = Image.open(ruta_entrada).convert("RGB")
            ancho_orig, alto_orig = img_original.size

            # --- [1] Extracción de sujetos con Alpha Matting ---
            print("   [⏳] [1] Alpha Matting de alta precisión...")
            img_rgba = remove(
                img_original,
                session=self.session,
                alpha_matting=True,
                alpha_matting_erode_size=3,
                alpha_matting_foreground_threshold=242,
                alpha_matting_background_threshold=12,
            )
            alpha_nativo = img_rgba.split()[3]
            alpha_rasurada = alpha_nativo.filter(ImageFilter.MinFilter(3))
            alpha_final = alpha_rasurada.filter(
                ImageFilter.GaussianBlur(radius=0.4)
            )
            # Extraer RGB puro de los sujetos (sin canal alpha)
            sujetos_rgb = img_rgba.convert("RGB")

            # --- [6] Generación de fondo con FLUX ---
            ancho_flux, alto_flux = self._calcular_dimensiones_flux(
                ancho_orig, alto_orig
            )
            print(
                f"   [⏳] [6] Generando fondo FLUX ({ancho_flux}×{alto_flux})..."
            )
            fondo_ia = self.client.text_to_image(
                prompt=self.banco_prompts[tema],
                width=ancho_flux,
                height=alto_flux,
            )
            fondo_ia = fondo_ia.resize(
                (ancho_orig, alto_orig), resample=Image.Resampling.LANCZOS
            )
            fondo_texturizado = self._inyectar_micro_grano_fondo(
                fondo_ia, intensidad=2.8
            )

            # --- [5] Máscara vestido/velo antes de compositing ---
            print(
                "   [⏳] [5] Discriminando áreas textiles para anti-halos..."
            )
            mascara_vestido = self._aislar_region_clara_vestido(
                img_original, alpha_final
            )
            sujetos_descontaminados = self._descontaminar_halos_negros(
                sujetos_rgb, alpha_final, mascara_vestido
            )

            # --- Composición base: fondo + sujetos descontaminados ---
            composicion = fondo_texturizado.copy()
            composicion.paste(sujetos_descontaminados, (0, 0), alpha_final)

            # --- [4] Light Wrap sobre la composición final ---
            # [FIX-3] Ahora actúa sobre la imagen ya compuesta, no sobre
            # los sujetos aislados, para que el wrap sea fotográficamente correcto.
            print("   [⏳] [4] Light Wrap adaptativo sobre composición...")
            composicion_con_wrap = self._aplicar_light_wrap(
                composicion,
                alpha_final,
                fondo_texturizado,
                radio=4,
                intensidad=0.18,
            )

            # --- [2] + [3] Sharpening DESPUÉS del compositing ---
            # [FIX-1] Aplicar nitidez sobre la imagen final mezclada evita
            # artefactos de borde y es más eficiente (una sola pasada).
            print("   [⏳] [2] Optimizando nitidez en rostros...")
            comp_enfocada = self._optimizar_nitidez_rostros(
                composicion_con_wrap
            )
            print("   [⏳] [3] High Pass micro-detalle estructural...")
            comp_high_pass = self._aplicar_high_pass_sharpen(
                comp_enfocada, radio=2, fuerza=1.1
            )

            # Toque final de contraste global
            img_final = ImageEnhance.Contrast(comp_high_pass).enhance(1.02)

            # --- Marco institucional con compensación lateral ---
            # [FIX-4] El grosor se aplica a los CUATRO lados por igual.
            grosor = int(alto_orig * 0.035)
            ancho_foto = ancho_orig - grosor * 2
            alto_foto = alto_orig - grosor * 2

            img_entregable = Image.new(
                "RGB", (ancho_orig, alto_orig), (14, 14, 15)
            )
            foto_reducida = img_final.resize(
                (ancho_foto, alto_foto), resample=Image.Resampling.LANCZOS
            )
            img_entregable.paste(foto_reducida, (grosor, grosor))

            # --- [7] JPEG de máxima calidad, sin submuestreo de color ---
            icc = img_original.info.get("icc_profile")
            save_kwargs = {
                "format": "JPEG",
                "quality": 100,
                "subsampling": 0,
            }
            if icc:
                save_kwargs["icc_profile"] = icc
            img_entregable.save(ruta_salida, **save_kwargs)
            return True

        except Exception as e:
            print(f"   ❌ Error en arquitectura V9.8: {e}")
            import traceback
            traceback.print_exc()
            return False

    # ------------------------------------------------------------------
    # PROCESADO EN LOTE
    # ------------------------------------------------------------------

    def procesar_lote_master(self, email_cliente, tema):
        carpeta_cliente = os.path.join(
            self.ruta_base, email_cliente.strip().lower()
        )
        # [8] Subcarpeta dedicada para Real-ESRGAN
        carpeta_upscale = os.path.join(carpeta_cliente, "pre_upscale")

        if not os.path.exists(carpeta_cliente):
            print(f"❌ Carpeta no encontrada: {carpeta_cliente}")
            return

        os.makedirs(carpeta_upscale, exist_ok=True)

        extensiones = ["*.jpg", "*.jpeg", "*.png", "*.JPG", "*.JPEG", "*.PNG"]
        archivos = []
        for ext in extensiones:
            archivos.extend(glob.glob(os.path.join(carpeta_cliente, ext)))

        # Excluir archivos ya procesados o intermedios
        excluir = ["_v", "_WRAP_", "_restored", "pre_upscale"]
        imagenes_validas = [
            f for f in archivos
            if not any(v in f for v in excluir)
        ]
        total = len(imagenes_validas)

        if total == 0:
            print("⚠️ No hay archivos originales válidos en la raíz del cliente.")
            return

        print(f"\n⚡ INICIANDO MOTOR COMPLETO V9.8 MASTER [PRODUCCIÓN] ⚡\n")
        exitosos = 0

        for indice, ruta_original in enumerate(imagenes_validas, start=1):
            nombre = os.path.basename(ruta_original)
            nombre_base, _ = os.path.splitext(nombre)
            ruta_salida = os.path.join(
                carpeta_upscale, f"{nombre_base}_{tema}_v98.jpg"
            )
            print(f"⏳ [{indice}/{total}] Procesando: {nombre}")
            if self.revelar_foto_master(ruta_original, ruta_salida, tema):
                print(f"   ✅ Guardado en: /pre_upscale/")
                exitosos += 1
            else:
                print(f"   ⚠️ Omitido por error.")

        print(f"\n📊 Resultado: {exitosos}/{total} fotos procesadas correctamente.")

        # --- [8] Instrucciones Real-ESRGAN ---
        carpeta_resultados = os.path.join(
            carpeta_cliente, "resultados_finales_x4"
        )
        print("\n" + "=" * 80)
        print("🚀 [8] PREPARACIÓN PARA REAL-ESRGAN LISTA")
        print("=" * 80)
        print(
            "Copia y ejecuta las siguientes líneas en tu próxima celda de Colab\n"
            "para procesar el lote completo con súper-resolución x4 neuronal:\n"
        )
        print("!git clone https://github.com/xinntao/Real-ESRGAN.git &> /dev/null")
        print("%cd Real-ESRGAN")
        print("!pip install basicsr facexlib gfpgan &> /dev/null")
        print("!pip install -r requirements.txt &> /dev/null")
        print("!python setup.py develop &> /dev/null")
        print(
            "!wget https://github.com/xinntao/Real-ESRGAN/releases/download/"
            "v0.1.0/RealESRGAN_x4plus.pth -P weights/ &> /dev/null"
        )
        print(
            f"!python inference_realesrgan.py "
            f"-n RealESRGAN_x4plus "
            f"-i '{carpeta_upscale}' "
            f"-o '{carpeta_resultados}' "
            f"--outscale 4 --face_enhance"
        )
        print("=" * 80 + "\n")


# ------------------------------------------------------------------
# PUNTO DE ENTRADA
# ------------------------------------------------------------------

if __name__ == "__main__":
    motor = ElAlbumB_V9_8_Master()
    email = input("\n📩 Email/Carpeta del cliente: ").strip()

    print("\n🌅 SELECCIÓN DE ENTORNO V9.8 MASTER:")
    print("  1. Finca Cristalina 🌾")
    print("  2. Vogue (Terraza Costa) 🌟")
    print("  3. Nostalgia (Patio Colonial) 🎞️")
    print("  4. Magic Wonderland 🌌")
    print("  5. Cinematic Master 🎬")

    opcion = input("\nSelecciona el entorno (1-5): ").strip()
    mapeo = {
        "1": "finca",
        "2": "vogue",
        "3": "nostalgia",
        "4": "magic",
        "5": "cinematic",
    }
    tema = mapeo.get(opcion, "finca")
    if opcion not in mapeo:
        print(f"⚠️ Opción inválida, usando 'finca' por defecto.")

    motor.procesar_lote_master(email, tema)
