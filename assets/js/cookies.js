import { $ } from "./dom.js";
import { storage } from "./storage.js";

export function initCookies() {
    const modal = $("#cookieModal");
    const btn = $("#acceptCookies");
    if (!modal || !btn) return;

    const consent = storage.get("cookieConsent");

    if (!consent) {
        setTimeout(() => modal.classList.add("show"), 500);
    }

    btn.addEventListener("click", () => {
        storage.set("cookieConsent", "accepted");
        modal.classList.remove("show");
    });
}
