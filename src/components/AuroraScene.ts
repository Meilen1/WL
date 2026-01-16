import * as THREE from "three";
import { auroraVertex, auroraFragment } from "./auroraShaders";

export function initAurora(container: HTMLDivElement) {
  console.log("INIT AURORA");

  /* ======================
     Scene
  ====================== */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x03060f);

  /* ======================
     Sizes
  ====================== */
  const getSize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    return { w, h, aspect: w / h };
  };

  const { w, h, aspect } = getSize();

  /* ======================
     Camera (ORTHOGRAPHIC ✔️)
  ====================== */
  const camera = new THREE.OrthographicCamera(
    -aspect,
     aspect,
     1,
    -1,
    -10,
     10
  );
  camera.position.z = 1;

  /* ======================
     Renderer
  ====================== */
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);

  /* ======================
     Aurora plane
  ====================== */
  const geometry = new THREE.PlaneGeometry(2, 2);

  const material = new THREE.ShaderMaterial({
    vertexShader: auroraVertex,
    fragmentShader: auroraFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    glslVersion: THREE.GLSL1,
    uniforms: {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(w, h),
      },
    },
  });

  const aurora = new THREE.Mesh(geometry, material);
  scene.add(aurora);

  /* ======================
     Stars
  ====================== */
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
    color: 0xfff2b0,
    size: 1,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  });

  const stars = new THREE.Points(starsGeo, starsMat);
  scene.add(stars);

  /* ======================
     Animation loop
  ====================== */
  const clock = new THREE.Clock();

  const render = () => {
    const t = clock.getElapsedTime();
    material.uniforms.uTime.value = t;

    stars.rotation.y = t * 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  render();

  /* ======================
     Resize
  ====================== */
  const onResize = () => {
    const { w, h, aspect } = getSize();

    camera.left = -aspect;
    camera.right = aspect;
    camera.top = 1;
    camera.bottom = -1;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
    material.uniforms.uResolution.value.set(w, h);
  };

  window.addEventListener("resize", onResize);

  /* ======================
     Cleanup
  ====================== */
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
