// -------------------------------------------------------------
// sparks.js — эффект "искры" при включении карточки
// -------------------------------------------------------------

import { CONFIG } from './config.js';
import { rand, randInt } from './utils.js';

/**
 * Создание вспышки искр
 * Вызывается в gallery.js → activateCard()
 */
export function createSparkBurst(cardEl) {
    if (!cardEl) return;

    const rect = cardEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    for (let i = 0; i < CONFIG.SPARK_COUNT; i++) {
        createSingleSpark(originX, originY);
    }
}

/**
 * Создаёт одну искру, которая улетает от центра
 */
function createSingleSpark(x, y) {
    const spark = document.createElement("div");
    spark.className = "spark";

    // стартовая позиция
    spark.style.left = x + "px";
    spark.style.top = y + "px";

    document.body.appendChild(spark);

    // случайное направление
    const angle = rand(0, Math.PI * 2);
    const dist = rand(CONFIG.SPARK_DISTANCE_MIN, CONFIG.SPARK_DISTANCE_MAX);

    const targetX = x + Math.cos(angle) * dist;
    const targetY = y + Math.sin(angle) * dist;

    spark.animate(
        [
            {
                transform: "translate(-50%, -50%) scale(1)",
                opacity: 1,
            },
            {
                transform: `translate(${targetX - x}px, ${targetY - y}px) scale(0)`,
                opacity: 0,
            }
        ],
        {
            duration: randInt(250, 450),
            easing: "ease-out",
        }
    ).onfinish = () => {
        spark.remove();
    };
}
