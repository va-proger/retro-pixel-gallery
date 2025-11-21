// -------------------------------------------------------------
// gallery.js — рендер галереи, включение ламп, переход в модалку
// -------------------------------------------------------------

import { CONFIG } from './config.js';
import { log } from './utils.js';
import { playSound, sounds } from './audio.js';
import { createSparkBurst } from './sparks.js';
import { saveState } from './storage.js';
import { openModal } from './modal.js';

/**
 * Глобальный массив данных галереи.
 * Инициализируется в main.js
 */
export let galleryData = [];

/**
 * Ссылка на DOM-элемент галереи
 */
const galleryEl = document.getElementById("gallery");

/**
 * Передаём сюда новые данные (например — после загрузки IndexedDB)
 */
export function setGalleryData(data) {
    galleryData = data;
    renderGallery();
}

export function addImage(item) {
    galleryData.push(item);

    // уведомляем другие модули
    document.dispatchEvent(new CustomEvent("gallery:add", {
        detail: item
    }));

    saveState(galleryData);
    renderGallery();
}
/**
 * Основной рендер галереи
 */
export function renderGallery() {
    if (!galleryEl) return;

    galleryEl.innerHTML = "";

    galleryData.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = `card ${item.powered ? "powered" : ""}`;

        card.innerHTML = `
            <img src="${item.thumb}" alt="${item.title}">
        `;

        // Включение лампы:
        card.addEventListener("click", () => {
            if (item.powered) {
                openModal(index);
            } else {
                activateCard(index, card);
            }
        });

        // глитч эффект при наведении
        if (CONFIG.ENABLE_GLITCH_ON_HOVER) {
            card.addEventListener("mouseenter", () => card.classList.add("glitch"));
            card.addEventListener("mouseleave", () => card.classList.remove("glitch"));
        }

        galleryEl.appendChild(card);
    });

    log("Gallery rendered", galleryData);
}

/**
 * Метод включения лампы (карточки)
 */
export function activateCard(index, el) {
    const item = galleryData[index];

    if (!item.powered) {
        item.powered = true;
        saveState(galleryData);

        // эффект искр
        createSparkBurst(el);

        // звук включения
        playSound(sounds.power);

        // визуальный эффект "лампы ЭЛТ" через CSS
        el.classList.add("powered");

        // задержка перед открытием модалки (чтобы анимация видна)
        setTimeout(() => {
            openModal(index);
        }, 350);
    }
}
