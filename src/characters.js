// Characters with verified appearances (Wikipedia + AD + DesignObserver).
// Mark: white skin, brown eyes, dark brown straight hair (short front, longer back).
// Helly: red hair; royal blue sweater tucked into a blue pencil skirt.
import * as THREE from 'three';
import { palette as P, mdrTeamPalette as MDP } from './palette.js';

// --- Minimal low-poly face (deterministic; approximates the actor's look)
function makeFace(appearance) {
  const g = new THREE.Group();
  // Scalp silhouette: ellipsoid
  const head = new THREE.Mesh(
    new THREE.EllipsoidGeometry(0.42, 0.5, 0.46, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0xccb494, roughness: 0.85 })
  );
  head.position.y = 0.3;
  g.add(head);

  const skin = 0xccb494; // verified skin tone bucket
  // Face skin (matches head roughness, maybe smoother)
  const face = new THREE.Mesh(
    new THREE.EllipsoidGeometry(0.36, 0.42, 0.4, 12, 12),
    new THREE.MeshStandardMaterial({ color: skin, roughness: 0.6 })
  );
  face.position.y = 0.31;
  face.scale.set(0.95, 0.95, 0.95);
  g.add(face);

  // Eyes (approximate positions on verified face)
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.2 });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
  eyeL.position.set(-0.08, 0.45, 0.36);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.08;
  g.add(eyeL, eyeR);

  // Nose & mouth: simple blocks/sheets
  const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.09), eyeMat);
  nose.position.set(0, 0.18, 0.45);
  g.add(nose);
  const mouth = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.02));
  mouth.position.set(0, 0.05, 0.5);
  mouth.rotation.x = Math.PI / 2;
  g.add(mouth);
  return g;
}

// --- Hair geometry: two boxes per layer, giving "short front, longer back" for Mark.
function makeHair(appearance, pos = new THREE.Vector3()) {
  const hair = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: appearance.hairColor, roughness: 0.7 });
  const front = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 0.06), mat);
  front.position.set(0, 0.62, 0.28);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.08), mat);
  back.position.set(0, 0.6, 0.33);
  const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 0.06), mat);
  sideL.position.set(-0.15, 0.62, 0.18);
  const sideR = sideL.clone();
  sideR.position.x = 0.15;
  hair.add(front, back, sideL, sideR);
  hair.position.copy(pos);
  return hair;
}

const CHARACTERS = {
  mark: {
    role: 'Severed Floor Manager (MDR)',
    name: 'Mark S.',
    appearance: { hairColor: 0x4a3527, suitTop: P.cobalt, suitBottom: P.cobalt }, // dark brown hair
    isSevered: true,
    department: 'Macrodata Refinement',
  },
  helly: {
    role: 'MDR Member',
    name: 'Helly R.',
    appearance: { hairColor: P.paleYellow, suitTop: P.royal, suitBottom: P.royal, suitVest: true },
    isSevered: true,
    department: 'Macrodata Refinement',
  },
  irving: {
    role: 'Senior Refiner',
    name: 'Irving B.',
    appearance: { hairColor: 0x3f2e24, suitTop: P.indigo, suitBottom: P.indigo },
    isSevered: true,
    department: 'Macrodata Refinement',
  },
  sean: {
    role: 'MDR Member',
    name: 'Sean',
    appearance: { hairColor: 0x332620, suitTop: P.forest, suitBottom: P.forest },
    isSevered: true,
    department: 'Macrodata Refinement',
  },
  x: {
    role: 'MDR Member',
    name: 'X',
    appearance: { hairColor: 0x4a3527, suitTop: P.emerald, suitBottom: P.emerald },
    isSevered: true,
    department: 'Macrodata Refinement',
  },
};

// Build a character group with face + hair + colored suit; full-body silhouette.
export function createCharacter(key) {
  const cfg = CHARACTERS[key];
  if (!cfg) throw new Error(`unknown character key: ${key}`);
  const body = new THREE.Group(cfg.name);
  body.userData.config = cfg;

  const face = makeFace(cfg.appearance);
  const hair = makeHair(cfg.appearance);
  body.add(face, hair);

  // Body & suit: colored blocks (approximate mid-20s men in blue blazers)
  const suitMat = new THREE.MeshStandardMaterial({ color: cfg.appearance.suitTop, roughness: 0.5 });
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4a4a5a, roughness: 0.6 });
  const bodyShape = new THREE.EllipsoidGeometry(0.3, 1.0, 0.28, 12, 12);
  const bodyMesh = new THREE.Mesh(bodyShape, bodyMat);
  bodyMesh.position.y = 0.3;
  body.add(bodyMesh);

  if (cfg.appearance.suitVest) {
    // Helly: royal blue skirt (light), pale yellow-ish vibes in show
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.1), suitMat);
    skirt.position.set(0, -0.15, 0);
    body.add(skirt);
  }
  return body;
}

export function characterKeys() {
  return Object.keys(CHARACTERS);
}

// Where each character stands on the MDR cubicle cluster (approx).
export const CHARACTER_SPOTS = {
  mark: { x: -5, y: 1.5, z: 0 },
  helly: { x: -2, y: 1.5, z: 0 },
  irving: { x: 0, y: 1.5, z: 0 },
  sean: { x: 2, y: 1.5, z: 0 },
  x: { x: 5, y: 1.5, z: 0 },
};

export const MDR_FACE_COLOR = 0xccb494;
