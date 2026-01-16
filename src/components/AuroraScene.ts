import * as THREE from "three";
import { auroraVertex, auroraFragment } from "./auroraShaders";

export function initAurora(container: HTMLDivElement) {
    console.log("INIT AURORA");
  const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -50, 50);


  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Fondo "noche"
  scene.background = new THREE.Color(0x03060f);

  // Plano que ocupa la pantalla
  const geometry = new THREE.PlaneGeometry(2, 2);

const material = new THREE.ShaderMaterial({
  vertexShader: auroraVertex,
  fragmentShader: auroraFragment,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  glslVersion: THREE.GLSL1, // 🔥 CLAVE
  uniforms: {
    uTime: { value: 0 },
    uResolution: {
      value: new THREE.Vector2(
        container.clientWidth,
        container.clientHeight
      ),
    },
  },
});


  const aurora = new THREE.Mesh(geometry, material);
  aurora.position.set(0, 0, 0);
  scene.add(aurora);

  // Estrellas simples (opcional pero queda muy bien)
  const starsGeo = new THREE.BufferGeometry();
  const count = 800;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
    positions[i * 3 + 2] = -Math.random() * 1.5;
  }
  starsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const starsMat = new THREE.PointsMaterial({
    color: 0xfff2b0, //amarillo
    size: 1,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  });
  const stars = new THREE.Points(starsGeo, starsMat);
  scene.add(stars);
  

  const clock = new THREE.Clock();

  function render() {
    const t = clock.getElapsedTime();
    material.uniforms.uTime.value = t;

    // sutil movimiento de estrellas
    stars.rotation.y = t * 0.01;
    

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();

  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;

 
    renderer.setSize(w, h);
    material.uniforms.uResolution.value.set(w, h);
  };

  window.addEventListener("resize", onResize);

  return () => {
    window.removeEventListener("resize", onResize);
    geometry.dispose();
    material.dispose();
    starsGeo.dispose();
    starsMat.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
