// -------------------------------------------------------------
// storage.js — сохранение состояния (localStorage + IndexedDB)
// -------------------------------------------------------------

import { CONFIG } from "./config.js";
import { log } from "./utils.js";

/* -------------------------------------------------------------
   LOCAL STORAGE: сохраняем, какие карточки включены
------------------------------------------------------------- */

/**
 * Сохраняем состояние powered-карточек
 */
export function saveState(galleryData) {
    const poweredIds = galleryData
        .filter((item) => item.powered)
        .map((item) => item.id);

    localStorage.setItem("pixelGallery", JSON.stringify(poweredIds));

    log("State saved:", poweredIds);
}

/**
 * Загружаем powered-состояние
 */
export function loadPoweredState(defaultData) {
    const saved = JSON.parse(localStorage.getItem("pixelGallery") || "[]");

    return defaultData.map((item) => ({
        ...item,
        powered: saved.includes(item.id),
    }));
}

/* -------------------------------------------------------------
   INDEXEDDB — хранение пиксель-артов пользователя
------------------------------------------------------------- */

let db = null;

/**
 * Инициализация базы данных
 */
export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(CONFIG.DB_NAME, 1);

        request.onupgradeneeded = (e) => {
            db = e.target.result;

            if (!db.objectStoreNames.contains(CONFIG.DB_STORE)) {
                db.createObjectStore(CONFIG.DB_STORE, {
                    keyPath: "id",
                });
            }
        };

        request.onsuccess = (e) => {
            db = e.target.result;
            log("IndexedDB opened");
            resolve();
        };

        request.onerror = (e) => {
            console.error("IndexedDB error:", e.target.error);
            reject(e.target.error);
        };
    });
}

/**
 * Сохраняем один пиксель-арт
 */
export function saveToDB(item) {
    return new Promise((resolve, reject) => {
        if (!db) return resolve(false);

        const tx = db.transaction(CONFIG.DB_STORE, "readwrite");
        const store = tx.objectStore(CONFIG.DB_STORE);

        store.put(item);

        tx.oncomplete = () => resolve(true);
        tx.onerror = reject;
    });
}
export const storage = {
    get(key, defaultValue = null) {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return defaultValue;

            if (raw.startsWith("{") || raw.startsWith("[")) {
                return JSON.parse(raw);
            }

            return raw;
        } catch (e) {
            console.warn("storage.get error:", e);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            if (typeof value === "object") {
                localStorage.setItem(key, JSON.stringify(value));
            } else {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            console.warn("storage.set error:", e);
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn("storage.remove error:", e);
        }
    }
};
/**
 * Загружаем все пиксель-арты
 */
export function loadFromDB() {
    return new Promise((resolve, reject) => {
        if (!db) return resolve([]);

        const tx = db.transaction(CONFIG.DB_STORE, "readonly");
        const store = tx.objectStore(CONFIG.DB_STORE);

        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result || []);
        };

        request.onerror = reject;
    });
}

/**
 * Удалить один элемент из IndexedDB
 */
export function deleteFromDB(id) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(CONFIG.DB_STORE, "readwrite");
        const store = tx.objectStore(CONFIG.DB_STORE);

        const req = store.delete(id);

        tx.oncomplete = () => resolve(true);
        tx.onerror = reject;
    });
}

/**
 * Полная очистка галереи
 */
export function clearDB() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(CONFIG.DB_STORE, "readwrite");
        const store = tx.objectStore(CONFIG.DB_STORE);

        const req = store.clear();

        tx.oncomplete = () => resolve(true);
        tx.onerror = reject;
    });
}
