// Lighting rigs for the two Severance worlds (verified from research).
import * as THREE from 'three';
import { palette as P } from './palette.js';

// Severance floor: "retina-frying sterile white" + motion-sensor dimming + red alerts.
export function createSevereLighting({ room, width = 120, height = 2.2 }) {
  const severe = new THREE.Group('severe_lighting');

  // --- Ceiling panel lights with a "motion-sensor activated" pulse (approximation).
  const lights = [];
  for (let x = -width / 2; x <= width / 2; x += width / 10) {
    const pl = new THREE.PointLight(P.severeWhite, 1.2, 12);
    pl.position.set(x, height + 0.5, 0);
    pl.castShadow = true;
    severe.add(pl);
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(width / 12, 0.3),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
    );
    plane.position.copy(pl.position);
    severe.add(plane);
    lights.push({ pl, plane, base: pl.intensity });
  }

  // --- Warm key light on the worker's desk (approximation of the outie's warm lighting style).
  const warmKey = new THREE.PointLight(P.outieTan, 0.6, 15);
  warmKey.position.set(0, 0.8, 0);
  warmKey.castShadow = true;
  severe.add(warmKey);

  return {
    group: severe,
    lights,
    update(time) {
      for (const { pl, plane, base } of lights) {
        const pulse = 0.15 + 0.85 * (0.5 + 0.5 * Math.sin(time * 1.3 + pl.position.x));
        pl.intensity = base * pulse;
        plane.material.opacity = 0.05 * pulse;
      }
    },
    dispose() {
      for (const { pl } of lights) severe.remove(pl);
      severe.remove(warmKey);
    },
  };
}

// Outie/Personal world: warm light (Ben & Aja Blanc style), softer and golden.
export function createOutieLighting({ room }) {
  const outie = new THREE.Group('outie_lighting');
  const fill = new THREE.HemisphereLight(P.outieTan, 0x2a2f3a, 1.1);
  outie.add(fill);
  const sun = new THREE.DirectionalLight(P.outieTan, 0.8);
  sun.position.set(30, 60, 40);
  outie.add(sun);
  return { group: outie, dispose() { outie.remove(fill); outie.remove(sun); } };
}
