export const auroraVertex = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const auroraFragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;

varying vec2 vUv;

float hash(vec2 p){
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f*f*(3.0 - 2.0*f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for(int i=0;i<5;i++){
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  // UV centrado y corregido por aspecto
  vec2 p = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

  // Ruido para bordes irregulares de la cortina
  float edgeNoise = fbm(vec2(p.x * 3.0, p.y * 3.0) + uTime * 0.05);

  // Mascara vertical (cortina)
  float vertical =
    smoothstep(-0.5, 0.3, p.y + edgeNoise * 0.1) *
    (1.0 - smoothstep(0.4, 0.9, p.y + edgeNoise * 0.1));

  // Ondulación horizontal (movimiento tipo tela)
  float wave =
      sin(p.x * 2.2 + uTime * 0.6) * 0.18 +
      sin(p.x * 5.0 - uTime * 0.9) * 0.08;

  // Ruido principal de la aurora
  float n = fbm(vec2(p.x * 1.2, p.y * 2.2) +
                vec2(uTime * 0.06, -uTime * 0.03));

  // Base de bandas (SIN smoothstep agresivo)
  float base = n + wave - p.y * 0.25;
  float bands = clamp((base - 0.35) / 0.55, 0.0, 1.0);

  // Detalle fino
  float fine = fbm(vec2(p.x * 6.0, p.y * 6.0) + uTime * 0.15);

  // Mezcla suave (clave para evitar cortes)
  bands = mix(bands * 0.6, bands, fine);

  // Intensidad final
  float intensity = vertical * bands;

  // colores
  vec3 colA = vec3(0.25, 0.75, 1.00); // base dominante verde
  vec3 colB = vec3(0.55, 0.25, 0.95); // transición morado
  vec3 colC = vec3(0.15, 1.00, 0.65); // sutil cian

  float mix1 = smoothstep(0.0, 1.0, n);
  vec3 color = mix(colA, colB, mix1);
  color = mix(color, colC, smoothstep(0.75, 1.0, fine));

  // Glow suave (sin cortes)
  float glow = intensity * intensity;
  vec3 finalColor = color * glow * 1.35;

  gl_FragColor = vec4(finalColor, clamp(glow, 0.0, 1.0));
}

`;
