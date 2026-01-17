import TypeIt from "typeit";

const el = document.getElementById("typewriter");
const button = document.getElementById("startTyping");

if (el) {
  const text = el.getAttribute("data-text") ?? "";

  
  new TypeIt(el, {
    strings: text,
    speed: 50,
    cursor: true,
    waitUntilVisible: true,
  }).go();
}

if (el && button) {
    button.addEventListener("click", () => {
    el.style.opacity = "0";
    button.style.opacity = "0";

    setTimeout(() => {
        el.style.display = "none";
        button.style.display = "none";
    }, 500);
    });

}
