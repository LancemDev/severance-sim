// Character models with verified appearances:
//  - Mark: dark brown straight hair, brown eyes, blue Lumon suit (Wikipedia/Fandom)
//  - Helly: red hair, royal-blue sweater + pencil skirt (DesignObserver)
//  - Lumon innies wear cobalt / indigo / royal blue, never sky or turquoise (DesignObserver)
import * as THREE from 'three';
import { palette as P } from './palette.js';

const SKIN = 0xccb494;
const SHIRT = 0xf1f1ec;

const CHARACTERS = {
  mark: {
    name: 'Mark S.',
    role: 'Severed Floor Manager (MDR)',
    department: 'Macrodata Refinement',
    appearance: { hairColor: 0x3b2a1e, suitTop: P.cobalt, suitBottom: P.cobalt, hairStyle: 'short' },
    isSevered: true,
  },
  helly: {
    name: 'Helly R.',
    role: 'MDR Member',
    department: 'Macrodata Refinement',
    appearance: { hairColor: 0xa63c2e, suitTop: P.royal, suitBottom: P.royal, hairStyle: 'bob' },
    isSevered: true,
  },
  irving: {
    name: 'Irving B.',
    role: 'Senior Refiner',
    department: 'Macrodata Refinement',
    appearance: { hairColor: 0x3f2e24, suitTop: P.indigo, suitBottom: P.indigo, hairStyle: 'short' },
    isSevered: true,
  },
  sean: {
    name: 'Sean',
    role: 'MDR Member',
    department: 'Macrodata Refinement',
    appearance: { hairColor: 0x332620, suitTop: P.forest, suitBottom: P.forest, hairStyle: 'short' },
    isSevered: true,
  },
  x: {
    name: 'X',
    role: 'MDR Member',
    department: 'Macrodata Refinement',
    appearance: { hairColor: 0x4a3527, suitTop: P.emerald, suitBottom: P.emerald, hairStyle: 'short' },
    isSevered: true,
  },
};

function buildHumanoid(appearance) {
  const g = new THREE.Group();
  const suit = new THREE.MeshStandardMaterial({ color: appearance.suitTop, roughness: 0.65 });
  const trouser = new THREE.MeshStandardMaterial({ color: appearance.suitBottom, roughness: 0.7 });
  const skin = new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.55 });
  const shirt = new THREE.MeshStandardMaterial({ color: SHIRT, roughness: 0.5 });
  const hairMat = new THREE.MeshStandardMaterial({ color: appearance.hairColor, roughness: 0.8 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1b1b1f, roughness: 0.5 });
  const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xf6f2ea, roughness: 0.25 });

  // --- Legs & shoes (origin at the floor, ~1.78 m tall overall)
  const legGeo = new THREE.BoxGeometry(0.17, 0.82, 0.19);
  const legL = new THREE.Mesh(legGeo, trouser);
  legL.position.set(-0.12, 0.43, 0);
  const legR = new THREE.Mesh(legGeo, trouser);
  legR.position.set(0.12, 0.43, 0);
  const shoeGeo = new THREE.BoxGeometry(0.19, 0.08, 0.3);
  const shoeL = new THREE.Mesh(shoeGeo, dark);
  shoeL.position.set(-0.12, 0.04, 0.05);
  const shoeR = new THREE.Mesh(shoeGeo, dark);
  shoeR.position.set(0.12, 0.04, 0.05);
  g.add(legL, legR, shoeL, shoeR);

  // --- Torso / jacket
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.6, 0.26), suit);
  torso.position.y = 1.13;
  g.add(torso);

  // White blouse/shirt panel
  const blouse = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.36, 0.02), shirt);
  blouse.position.set(0, 1.13, 0.135);
  g.add(blouse);

  // --- Arms (slightly out from torso) + hands
  const armGeo = new THREE.BoxGeometry(0.12, 0.52, 0.16);
  const armL = new THREE.Mesh(armGeo, suit);
  armL.position.set(-0.31, 1.1, 0);
  armL.rotation.z = 0.06;
  const armR = new THREE.Mesh(armGeo, suit);
  armR.position.set(0.31, 1.1, 0);
  armR.rotation.z = -0.06;
  const handGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const handL = new THREE.Mesh(handGeo, skin);
  handL.position.set(-0.34, 0.82, 0.02);
  const handR = new THREE.Mesh(handGeo, skin);
  handR.position.set(0.34, 0.82, 0.02);
  g.add(armL, armR, handL, handR);

  // --- Neck & head
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.1, 8), skin);
  neck.position.y = 1.48;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.135, 16, 14), skin);
  head.scale.set(0.92, 1.05, 0.95);
  head.position.y = 1.62;
  g.add(neck, head);

  // --- Face: eyes, brows, nose, mouth
  const eyeGeo = new THREE.SphereGeometry(0.021, 8, 8);
  const pupilGeo = new THREE.SphereGeometry(0.01, 6, 6);
  for (const sx of [-1, 1]) {
    const white = new THREE.Mesh(eyeGeo, eyeWhite);
    white.position.set(sx * 0.045, 1.645, 0.115);
    const pupil = new THREE.Mesh(pupilGeo, dark);
    pupil.position.set(sx * 0.045, 1.645, 0.132);
    g.add(white, pupil);
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.009, 0.012), hairMat);
    brow.position.set(sx * 0.047, 1.68, 0.122);
    g.add(brow);
  }
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.05, 6), skin);
  nose.rotation.x = Math.PI / 2.2;
  nose.position.set(0, 1.61, 0.132);
  const mouth = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.008, 0.01),
    new THREE.MeshStandardMaterial({ color: 0x9c5b52, roughness: 0.6 })
  );
  mouth.position.set(0, 1.565, 0.126);
  g.add(nose, mouth);

  // --- Hair (short for Mark/Irving; bob for Helly — red, verified)
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.142, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55),
    hairMat
  );
  cap.scale.set(0.98, 1.08, 1.0);
  cap.position.y = 1.615;
  g.add(cap);

  if (appearance.hairStyle === 'bob') {
    const bob = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.2, 0.22), hairMat);
    bob.position.set(0, 1.56, -0.02);
    g.add(bob);
    for (const sx of [-1, 1]) {
      const side = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.18), hairMat);
      side.position.set(sx * 0.135, 1.58, 0);
      g.add(side);
    }
  } else {
    // Straight, short in front and a little longer in back (Mark, verified)
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.06), hairMat);
    back.position.set(0, 1.62, -0.13);
    g.add(back);
  }

  g.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });
  return g;
}

export function createCharacter(key) {
  const cfg = CHARACTERS[key];
  if (!cfg) throw new Error(`unknown character key: ${key}`);
  const body = buildHumanoid(cfg.appearance);
  body.name = cfg.name;
  body.userData.config = cfg;
  return body;
}

export function characterKeys() {
  return Object.keys(CHARACTERS);
}

export const CHARACTER_SPOTS = {
  mark: { x: -5, y: 0, z: 1.2 },
  helly: { x: -2.5, y: 0, z: 1.2 },
  irving: { x: 0, y: 0, z: 1.2 },
  sean: { x: 2.5, y: 0, z: 1.2 },
  x: { x: 5, y: 0, z: 1.2 },
};

export const MDR_FACE_COLOR = SKIN;
