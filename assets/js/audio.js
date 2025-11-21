// -------------------------------------------------------------
// audio.js — Звуки (включение ламп, клики, TV startup)
// -------------------------------------------------------------

import { log } from './utils.js';

let soundUnlocked = false;

/**
 * Кэшируем аудио элементы из DOM
 */
export const sounds = {
    power: document.getElementById("power-on"),
    click: document.getElementById("click"),
    tv: document.getElementById("tv-on")
};

/**
 * Безопасное воспроизведение звука
 * (чтобы не падало в iOS / Chrome autoplay restrictions)
 */
export function playSound(audioEl) {
    if (!audioEl) return;

    const play = audioEl.play();
    if (play instanceof Promise) {
        play.catch(() => {
            // игнорируем ошибки, это нормально для браузеров
        });
    }
}

/**
 * Разблокировка аудио после первого взаимодействия пользователя.
 * Это обязательно для iOS, Android и Chrome.
 */
export function unlockAudio() {
    if (soundUnlocked) return;

    soundUnlocked = true;
    log("Audio unlocked");

    // пробуем пустое воспроизведение
    playSound(sounds.tv);
}

/**
 * Активируем разблокировку только один раз
 */
export function initAudioUnlock() {
    document.body.addEventListener("click", unlockAudio, { once: true });
    document.body.addEventListener("touchstart", unlockAudio, { once: true });
}
