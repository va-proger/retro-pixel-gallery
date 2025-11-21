import { $, $$ } from "./dom.js";

export function initShare() {
    const toggle = $("#shareToggle");
    const panel  = $("#sharePanel");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", () => {
        panel.classList.toggle("active");
    });

    const SHARE = {
        title: document.querySelector("meta[property='og:title']")?.content || document.title,
        desc:  document.querySelector("meta[name='description']")?.content || "",
        url:   document.querySelector("link[rel='canonical']")?.href || window.location.href
    };

    const links = {
        vk:      `https://vk.com/share.php?url=${SHARE.url}`,
        telegram:`https://t.me/share/url?url=${SHARE.url}&text=${SHARE.title}`,
        whatsapp:`https://wa.me/?text=${SHARE.title} ${SHARE.url}`,
        facebook:`https://www.facebook.com/sharer/sharer.php?u=${SHARE.url}`,
        twitter: `https://twitter.com/intent/tweet?url=${SHARE.url}&text=${SHARE.title}`,
        email:   `mailto:?subject=${SHARE.title}&body=${SHARE.url}`
    };

    $$.call(panel, "[data-share]").forEach(el => {
        el.addEventListener("click", () => {
            const type = el.dataset.share;
            if (links[type]) {
                window.open(links[type], "_blank", "width=600,height=500");
            }
        });
    });
}
