// -------------------------------------------------------------
// utils.js — Вспомогательные функции
// -------------------------------------------------------------

import { CONFIG } from './config.js';

/**
 * Безопасный логгер.
 * Показывает логи только если включён CONFIG.DEBUG = true
 */
export function log(...args) {
    if (CONFIG.DEBUG) console.log('[RetroPixel]', ...args);
}

/**
 * Асинхронная загрузка изображения.
 * Возвращает Promise<Image>
 */
export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * Создание DOM-элемента с классами и стилями
 */
export function createElement(tag, options = {}) {
    const el = document.createElement(tag);

    if (options.class) el.className = options.class;
    if (options.html) el.innerHTML = options.html;

    if (options.style) {
        Object.assign(el.style, options.style);
    }

    return el;
}

/**
 * Простой рандомный float в диапазоне
 */
export function rand(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Простой рандомный integer в диапазоне
 */
export function randInt(min, max) {
    return Math.floor(rand(min, max));
}

/**
 * Генерация безопасного имени файла для скачивания
 */
export function safeFilename(name, ext = 'png') {
    return (
        name
            .toLowerCase()
            .replace(/[^a-z0-9а-яё]+/gi, '-')
            .replace(/^-+|-+$/g, '') + '.' + ext
    );
}
