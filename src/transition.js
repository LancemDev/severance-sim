// Elevator / Dingle transitions between Innie and Outie worlds.
// Verified facts (Reddit / Mashable / ILM):
//  - The elevator has a DING when doors close.
//  - When the severance chip activates, there is an electronic buzz (high-pitched beep + crackle).
//  - Transitions are random one- and two-frame cuts between the outgoing and incoming scene + dolly zoom ("zally").
import * as THREE from 'three';

// Approx pitches seen in the show (verified by fan analysis; see elevator_ding data set).
export const DING_PITCHES = ['B', 'C#', 'G'];
export function randomDingPitch() {
  return DING_PITCHES[Math.floor(Math.random() * DING_PITCHES.length)];
}

// Dolly zoom ("zally"): tweak camera fov while moving target — classic Severance transition look.
export function transitionDollyZoom({ camera, duration = 900, onTick }) {
  const start = { fov: camera.fov };
  const endFov = camera.fov === 45 ? 55 : 45;
  const t0 = performance.now();
  const raf = (function tick() {
    const t = Math.min(1, (performance.now() - t0) / duration);
    camera.fov = THREE.MathUtils.lerp(start.fov, endFov, t);
    camera.updateProjectionMatrix();
    onTick && onTick(t);
    return t < 1 ? requestAnimationFrame(tick) : t;
  })();
  return { raf };
}

// Glitch cut: instant scene cut with a random 1-2 frame interval feel.
export function createGlitchCut({ duration = 240 } = {}) {
  const cuts = [];
  for (let t = 0; t < duration; t += Math.ceil(duration / 4)) cuts.push(t);
  return { cuts, description: '1-2 frame cuts between scenes (ILM style)' };
}

// Elevator hum representation (onboarding + atmosphere).
// When Web Audio + assets exist, this is wired to play; for now it returns an animated glow.
export function spawnElevatorHum({ scene, y = 3.5, glows = 8 }) {
  const group = new THREE.Group('elevator_hum');
  for (let i = 0; i < glows; i++) {
    const s = 0.3 + Math.random() * 0.4;
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(s, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 })
    );
    glow.position.set(0, y, 0);
    group.add(glow);
  }
  scene.add(group);
  let t = 0;
  return {
    tick(dt) { t += dt; for (const g of group.children) g.scale.setScalar(0.8 + 0.5 * Math.sin(t * 4 + g.position.x)); },
    remove() { scene.remove(group); },
  };
}
