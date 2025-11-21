// -------------------------------------------------------------
// main.js — сбор всех модулей Retro Pixel Gallery
// -------------------------------------------------------------

import { initAudioUnlock } from "./audio.js";
import { initCRT } from "./crt.js";

import { pixelateFile  } from "./pixelate.js";
import { initCookies } from "./cookies.js";
import { initShare } from "./share.js";
import { galleryData, setGalleryData, renderGallery, addImage } from "./gallery.js";
import { loadPoweredState  } from "./storage.js";
import { initDB, loadFromDB, saveToDB } from "./storage.js";

import { log } from "./utils.js";

/* -------------------------------------------------------------
   1) ДЕФОЛТНЫЕ ДАННЫЕ ГАЛЕРЕИ
------------------------------------------------------------- */

const defaultGallery = [
    {
        id: 1,
        title: "Космический кот",
        thumb: "./assets/images/green_cat-cosmos.png",
        desc: "Кот, который полетел к звёздам в 1987",
    },
    {
        id: 2,
        title: "Ретро-робот",
        thumb: "./assets/images/green_robot-old.png",
        desc: "Друг из 8-битного детства",
    },
    {
        id: 3,
        title: "Пиксельный дракон",
        thumb: "./assets/images/green_dragon.png",
        desc: "Страж подземелий",
    },
    {
        id: 4,
        title: "Ниндзя 16×16",
        thumb: "./assets/images/green_ninzj.png",
        desc: "Тень в ночи",
    },
    {
        id: 5,
        title: "Грибной воин",
        thumb: "./assets/images/green_marh.png",
        desc: "Из подземного царства",
    },
    {
        id: 6,
        title: "Кибер-город",
        thumb: "./assets/images/green_kiber-city.png",
        desc: "Неон 2088 года",
    }
];

/* -------------------------------------------------------------
   2) ПОЛНАЯ ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
------------------------------------------------------------- */

async function initApp() {
    log("Инициализация Retro Pixel Gallery...");

    initAudioUnlock();

    initCRT();

    await initDB();

    const userImages = await loadFromDB();

    let merged = [
        ...loadPoweredState(defaultGallery),
        ...loadPoweredState(userImages)
    ];

    setGalleryData(merged);

    initDragAndDrop();
    initCookies();
    initShare();
    log("Галерея готова!");
}

/* -------------------------------------------------------------
   DRAG & DROP И ЗАГРУЗКА ФАЙЛОВ
------------------------------------------------------------- */
document.addEventListener("gallery:add", (e) => {
    const item = e.detail;
    saveToDB(item);
});
function initDragAndDrop() {
    const dropZone = document.getElementById("drop-zone");

    const events = ["dragenter", "dragover", "dragleave", "drop"];
    events.forEach(ev => {
        dropZone.addEventListener(ev, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    dropZone.addEventListener("dragenter", () => {
        dropZone.style.background = "rgba(0,255,0,0.15)";
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.style.background = "";
    });

    dropZone.addEventListener("drop", (e) => {
        dropZone.style.background = "";

        const files = [...e.dataTransfer.files];
        for (const f of files) {
            if (f.type.startsWith("image/")) {
                pixelateFile(f); // только запускаем пикселизацию
            }
        }
    });
}

/* -------------------------------------------------------------
   СТАРТ
------------------------------------------------------------- */

initApp();
