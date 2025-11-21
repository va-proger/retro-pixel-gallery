// -------------------------------------------------------------
// pixelate.js — пикселизация, CRT recolor, upscale ×4
// -------------------------------------------------------------

import { CONFIG } from './config.js';
import { log, loadImage } from './utils.js';
import { addImage } from "./gallery.js";  // ← ВАЖНО: правильный импорт

/* -------------------------------------------------------------
   ПИКСЕЛИЗАЦИЯ КАРТИНКИ
------------------------------------------------------------- */

/**
 * Пикселизация загруженного файла
 * @param {File} file - входящая картинка
 */
export function pixelateFile(file) {
    const reader = new FileReader();

    reader.onload = async (e) => {
        const img = await loadImage(e.target.result);
        const thumb = pixelateImage(img);

        // ⛔ раньше было galleryData.push
        // ⭕ теперь — централизованное добавление
        addImage({
            id: Date.now(),
            title: file.name.replace(/\..+$/, '').slice(0, 14),
            thumb,
            desc: "Твоё фото в ретро-CRT",
            powered: false
        });
    };

    reader.readAsDataURL(file);
}

/**
 * Основная пикселизация
 * @param {HTMLImageElement} img
 * @returns dataURL
 */
export function pixelateImage(img) {
    const size = CONFIG.PIXEL_SIZE;
    const pixel = CONFIG.PIXEL_BLOCK;

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, size / pixel, size / pixel);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
        canvas,
        0, 0, size / pixel, size / pixel,
        0, 0, size, size
    );

    applyCRTColor(ctx, size);

    return canvas.toDataURL("image/png");
}

/* -------------------------------------------------------------
   CRT RECOLOR
------------------------------------------------------------- */

function applyCRTColor(ctx, size) {
    const imgData = ctx.getImageData(0, 0, size, size);
    const px = imgData.data;

    for (let i = 0; i < px.length; i += 4) {
        const brightness = 0.32 * px[i] + 0.5 * px[i+1] + 0.18 * px[i+2];
        const green = Math.min(255, brightness * 2);

        px[i]     = green * 0.1;
        px[i + 1] = green;
        px[i + 2] = green * 0.1;
    }

    ctx.putImageData(imgData, 0, 0);
}

/* -------------------------------------------------------------
   UPSCALE ×4
------------------------------------------------------------- */

export async function upscale4x(dataURL) {
    const img = await loadImage(dataURL);

    const base = CONFIG.PIXEL_SIZE;
    const factor = CONFIG.UPSCALE_FACTOR;

    const smallCanvas = document.createElement("canvas");
    const smallCtx = smallCanvas.getContext("2d");
    smallCanvas.width = smallCanvas.height = base / CONFIG.PIXEL_BLOCK;

    smallCtx.drawImage(img, 0, 0, smallCanvas.width, smallCanvas.height);

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = finalCanvas.height = base * factor;
    const finalCtx = finalCanvas.getContext("2d");
    finalCtx.imageSmoothingEnabled = false;

    finalCtx.drawImage(
        smallCanvas,
        0, 0, smallCanvas.width, smallCanvas.height,
        0, 0, finalCanvas.width, finalCanvas.height
    );

    applyCRTColor(finalCtx, finalCanvas.width);

    return finalCanvas.toDataURL("image/png");
}
