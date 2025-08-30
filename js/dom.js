// js/dom.js
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function showAlert(el, message, durationMs = 5000){
  el.textContent = message;
  el.hidden = false;
  // Clear any existing timer
  if (el._t) clearTimeout(el._t);
  el._t = setTimeout(() => { el.hidden = true; el.textContent = ""; }, durationMs);
}
