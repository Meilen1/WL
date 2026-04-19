import TypeIt from "typeit";

const el = document.getElementById("typewriter");
const button = document.getElementById("startTyping");

if (el && button) {
  const text = el.getAttribute("data-text") ?? "";

let instance: TypeIt | null = null;

  button.addEventListener("click", () => {
    if (instance) return; // evita múltiples clicks

    // crear instancia recién al hacer click
    instance = new TypeIt(el, {
      strings: text,
      speed: 50,
      cursor: true,
      waitUntilVisible: true,
    });

    instance.go();

    // opcional: ocultar botón
    button.style.opacity = "0";
    setTimeout(() => {
      button.style.display = "none";
    }, 500);
  });
}