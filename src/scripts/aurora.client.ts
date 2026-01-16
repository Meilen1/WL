import { initAurora } from "../components/AuroraScene";

export function startAurora(element: HTMLDivElement) {
  console.log("startAurora llamado con:", element);
  
  // Asegurarse de que el elemento tenga dimensiones
  if (element.clientWidth === 0 || element.clientHeight === 0) {
    console.warn("El contenedor no tiene dimensiones, esperando...");
    requestAnimationFrame(() => startAurora(element));
    return;
  }
  
  initAurora(element);
}