// Lighting for the severed floor: cool, even, institutional white with a
// green carpet bounce. Rect-area ceiling panels + one soft shadow caster.
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

export function createSevereLighting({ width = 24, depth = 20, height = 3.9 } = {}) {
  RectAreaLightUniformsLib.init();

  const group = new THREE.Group('severe_lighting');

  // cool white skylight + green floor bounce
  const hemi = new THREE.HemisphereLight(0xecf7f3, 0x6f947c, 0.82);
  group.add(hemi);

  const ambient = new THREE.AmbientLight(0xffffff, 0.12);
  group.add(ambient);

  // single soft key for contact shadows and modelling
  const key = new THREE.DirectionalLight(0xf7fffc, 1.05);
  key.position.set(6, 10, 8);
  key.target.position.set(0, 0, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -14;
  key.shadow.camera.right = 14;
  key.shadow.camera.top = 13;
  key.shadow.camera.bottom = -13;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 34;
  key.shadow.bias = -0.00035;
  key.shadow.normalBias = 0.025;
  key.shadow.radius = 3.5;
  group.add(key);
  group.add(key.target);

  // recessed ceiling panels (no shadows, but lovely soft falloff on desks)
  const panels = [];
  for (const x of [-8, 0, 8]) {
    for (const z of [-5.5, 5.5]) {
      const panel = new THREE.RectAreaLight(0xf1faff, 2.7, 1.86, 0.92);
      panel.position.set(x, height - 0.14, z);
      panel.lookAt(x, 0, z);
      group.add(panel);
      panels.push(panel);
    }
  }

  // gentle frontal fill so faces never go muddy
  const fill = new THREE.DirectionalLight(0xe4efeb, 0.25);
  fill.position.set(-5, 4, 12);
  group.add(fill);

  // dim upward bounce so the coffered ceiling reads with depth
  const ceilingFill = new THREE.DirectionalLight(0xdcece5, 0.45);
  ceilingFill.position.set(1, -1, 5);
  ceilingFill.target.position.set(0, height, 0);
  group.add(ceilingFill);
  group.add(ceilingFill.target);

  return {
    group,
    key,
    panels,
    update() {},
    dispose() {
      hemi.dispose?.();
      ambient.dispose?.();
      key.dispose?.();
      fill.dispose?.();
      for (const p of panels) p.dispose?.();
    },
  };
}
