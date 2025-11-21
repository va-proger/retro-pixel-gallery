// -------------------------------------------------------------
// download.js — скачивание PNG, скачивание ×4, экспорт ZIP
// -------------------------------------------------------------

import { CONFIG } from "./config.js";
import { safeFilename, log } from "./utils.js";
import { galleryData } from "./gallery.js";

/* -------------------------------------------------------------
   ЗАГРУЗКА ОДНОГО PNG
------------------------------------------------------------- */

/**
 * Скачивает любое PNG изображение
 * @param {string} dataURL
 * @param {string} filenameWithoutExt
 */
export function downloadImage(dataURL, filenameWithoutExt = "pixel-art") {
    const filename = safeFilename(filenameWithoutExt, "png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    log("Downloaded:", filename);
}

/* -------------------------------------------------------------
   ЗАГРУЗКА ×4 (делается в pixelate.js → upscale4x)
------------------------------------------------------------- */
// Здесь ничего не нужно — upscale4x вызывается из modal.js
// но этот модуль предоставляет downloadImage()


/* -------------------------------------------------------------
   ЗАГРУЗКА ВСЕЙ ГАЛЕРЕИ ZIP-АРХИВОМ
------------------------------------------------------------- */

import JSZip from "./vendor/jszip.esm.js"; // локальная версия JSZip

/**
 * Экспорт всех изображений галереи в ZIP
 */
export async function exportZip() {
    const zip = new JSZip();
    const folder = zip.folder("retro_pixel_gallery");

    for (const item of galleryData) {
        try {
            const base64 = item.thumb.split(",")[1];

            const filename = safeFilename(item.title, "png");

            folder.file(filename, base64, { base64: true });
        } catch (error) {
            console.error("Ошибка упаковки файла:", item.title, error);
        }
    }

    const blob = await zip.generateAsync({ type: "blob" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = CONFIG.ZIP_FILENAME;
    link.click();

    log("ZIP exported:", CONFIG.ZIP_FILENAME);
}
