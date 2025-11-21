// -------------------------------------------------------------
// modal.js — модальное окно (открытие, закрытие, навигация)
// -------------------------------------------------------------

import { galleryData } from "./gallery.js";
import { playSound, sounds } from "./audio.js";
import { upscale4x } from "./pixelate.js";
import {downloadImage, exportZip} from "./download.js";
import { log } from "./utils.js";

/**
 * Текущее положение модалки в массиве galleryData
 */
let currentIndex = 0;

/**
 * DOM элементы
 */
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");

const closeBtn = document.querySelector(".close");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const downloadBtn = document.getElementById("download-btn");
const downloadX4Btn = document.getElementById("download-x4");
const downloadZipBtn = document.getElementById("download-zip"); // появится в шаге 7

/* -------------------------------------------------------------
   ОТКРЫТИЕ МОДАЛКИ
------------------------------------------------------------- */
export function openModal(index) {
    currentIndex = index;

    const item = galleryData[currentIndex];
    if (!item) return;

    modalImg.src = item.thumb;
    modalTitle.textContent = item.title;
    modalDesc.textContent = item.desc;

    modal.style.display = "flex";

    // звук открытия
    playSound(sounds.click);

    log("Modal opened:", item.title);
}

/* -------------------------------------------------------------
   ЗАКРЫТИЕ МОДАЛКИ
------------------------------------------------------------- */
export function closeModal() {
    modal.style.display = "none";
    log("Modal closed");
}

/* -------------------------------------------------------------
   ПРОШЛАЯ / СЛЕДУЮЩАЯ КАРТИНКА
------------------------------------------------------------- */
function showPrev() {
    const newIndex =
        (currentIndex - 1 + galleryData.length) % galleryData.length;
    openModal(newIndex);
}

function showNext() {
    const newIndex = (currentIndex + 1) % galleryData.length;
    openModal(newIndex);
}

/* -------------------------------------------------------------
   ОБРАБОТЧИКИ КНОПОК
------------------------------------------------------------- */

// закрыть модалку
closeBtn.addEventListener("click", closeModal);

// навигация
prevBtn.addEventListener("click", showPrev);
nextBtn.addEventListener("click", showNext);

// клик по фону — закрыть
window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});

/* -------------------------------------------------------------
   КНОПКА: СКАЧАТЬ ОРИГИНАЛ (пикселизированный)
------------------------------------------------------------- */
downloadBtn.addEventListener("click", () => {
    const item = galleryData[currentIndex];
    if (!item) return;

    downloadImage(item.thumb, item.title);
});

/* -------------------------------------------------------------
   КНОПКА: СКАЧАТЬ ×4 (upscale)
------------------------------------------------------------- */
downloadX4Btn.addEventListener("click", async () => {
    const item = galleryData[currentIndex];
    if (!item) return;

    const upscaled = await upscale4x(item.thumb);

    downloadImage(upscaled, item.title + "-x4");
});

/* -------------------------------------------------------------
   ZIP экспорт появится в шаге 7
------------------------------------------------------------- */
if (downloadZipBtn) {
    downloadZipBtn.addEventListener("click", exportZip);
}
