// -------------------------------------------------------------
// config.js — Общие настройки Retro Pixel Gallery
// -------------------------------------------------------------

/**
 * Здесь хранятся все параметры, которые могут понадобиться
 * для тонкой настройки проекта.
 *
 * Ты можешь менять значения под себя — без изменения других модулей.
 */

export const CONFIG = {
    // Размер базового пиксель-арта
    PIXEL_SIZE: 180,

    // Размер одного «квадрата пикселя» при пикселизации
    PIXEL_BLOCK: 2,

    // Яркость CRT лампы (для CSS классов)
    BRIGHT_ON: 1.1,
    BRIGHT_OFF: 0.25,

    // Настройки WebGL Noise (скорость анимации)
    NOISE_INTENSITY: 0.25,

    // IndexedDB название БД
    DB_NAME: 'retro_pixel_gallery',
    DB_STORE: 'images',

    // Параметры ZIP экспорта
    ZIP_FILENAME: 'pixel-gallery.zip',

    // Настройки искр
    SPARK_COUNT: 10,
    SPARK_DISTANCE_MIN: 30,
    SPARK_DISTANCE_MAX: 60,

    // Масштаб upscale ×4
    UPSCALE_FACTOR: 4,

    // Настройки для анимации галереи
    ENABLE_GLITCH_ON_HOVER: true,

    // Debug режим (показывать логи)
    DEBUG: false
};
