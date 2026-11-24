// Show-accurate cast, built from episode frames.
// Mark: white shirt, blue patterned tie, dark trousers, side-parted brown hair.
// Helly: auburn bob, forest-green top, royal-blue pencil skirt, brown heels.
// Irving: pale-yellow shirt, blue tie, glasses, close beard.
// Dylan: white shirt, black tie, dark trousers, short brown hair.
// Milchick: white short-sleeve shirt, black tie, black suit trousers.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const CHARACTERS = {
  mark: {
    name: 'Mark S.',
    role: 'Severed Floor Manager · MDR',
    department: 'Macrodata Refinement',
    height: 1.8,
    skin: 0xd8b096,
    hair: 0x3a2a20,
    hairStyle: 'part',
    top: 0xf2f1e9,
    sleeve: 'long',
    tie: 0x3d5f8c,
    tiePattern: true,
    trousers: 0x2f3237,
    shoes: 0x1d1d1f,
    headYaw: 0.12,
    badge: true,
  },
  helly: {
    name: 'Helly R.',
    role: 'Refiner · MDR',
    department: 'Macrodata Refinement',
    height: 1.68,
    skin: 0xe0b49f,
    hair: 0x8f3328,
    hairStyle: 'bob',
    top: 0x2c4a3a,
    sleeve: 'long',
    skirt: 0x355677,
    legs: 'skin',
    heels: 0x6a4431,
    headYaw: -0.08,
    badge: true,
  },
  irving: {
    name: 'Irving B.',
    role: 'Senior Refiner · MDR',
    department: 'Macrodata Refinement',
    height: 1.78,
    skin: 0x9c6b4e,
    hair: 0x3a312a,
    grayHair: 0x8d867b,
    hairStyle: 'short',
    beard: true,
    glasses: true,
    top: 0xddc796,
    sleeve: 'long',
    tie: 0x3f5f7c,
    trousers: 0x2b2e33,
    shoes: 0x1a1a1c,
    headYaw: 0.05,
    badge: true,
  },
  dylan: {
    name: 'Dylan G.',
    role: 'Refiner · MDR',
    department: 'Macrodata Refinement',
    height: 1.74,
    skin: 0xd0a184,
    hair: 0x503a28,
    hairStyle: 'short',
    top: 0xf3f2ea,
    sleeve: 'long',
    tie: 0x1f2426,
    trousers: 0x2d3034,
    shoes: 0x1c1c1e,
    headYaw: -0.04,
    badge: true,
  },
  milchick: {
    name: 'Seth Milchick',
    role: 'Severed Floor Manager',
    department: 'Management',
    height: 1.86,
    skin: 0x6f4a36,
    hair: 0x1f1a17,
    hairStyle: 'fade',
    top: 0xf1f0e8,
    sleeve: 'short',
    tie: 0x1a1c1e,
    jacket: 0x1e2224,
    trousers: 0x202326,
    shoes: 0x17181a,
    headYaw: 0.1,
    badge: true,
  },
};

export const CHARACTER_SPOTS = {
  mark: { x: -3.35, y: 0, z: 1.55, rotY: 0.55 },
  helly: { x: 3.3, y: 0, z: 1.62, rotY: -0.55 },
  irving: { x: -4.25, y: 0, z: -1.55, rotY: 0.78 },
  dylan: { x: 4.2, y: 0, z: -1.5, rotY: -0.78 },
  milchick: { x: -5.6, y: 0, z: -2.8, rotY: 1.02 },
};

const mat = (color, roughness = 0.65, metalness = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

function part(parent, geo, material, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1, cast = true } = {}) {
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.scale.set(sx, sy, sz);
  mesh.castShadow = cast;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function rounded(w, h, d, r = 0.03) {
  return new RoundedBoxGeometry(w, h, d, 4, r);
}

// ------------------------------------------------------------------ head

function addEyes(head, cfg) {
  const eyeWhite = new THREE.MeshStandardMaterial({ color: 0xf4efe6, roughness: 0.2 });
  const iris = new THREE.MeshStandardMaterial({ color: cfg.iris ?? 0x5b4632, roughness: 0.25 });
  const pupil = new THREE.MeshStandardMaterial({ color: 0x0c0c0d, roughness: 0.2 });
  const lash = new THREE.MeshStandardMaterial({ color: 0x221b17, roughness: 0.7 });
  const eyes = [];
  for (const sx of [-1, 1]) {
    const g = new THREE.Group();
    g.position.set(sx * 0.043, 0.098, 0.107);
    const white = new THREE.Mesh(new THREE.SphereGeometry(0.0185, 16, 12), eyeWhite);
    white.scale.set(1, 0.82, 0.5);
    g.add(white);
    const ir = new THREE.Mesh(new THREE.SphereGeometry(0.0098, 12, 10), iris);
    ir.position.z = 0.011;
    ir.scale.set(1, 1, 0.45);
    g.add(ir);
    const pu = new THREE.Mesh(new THREE.SphereGeometry(0.0046, 8, 8), pupil);
    pu.position.z = 0.017;
    g.add(pu);
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.043, 0.0055, 0.006), lash);
    l.position.set(0, 0.014, 0.012);
    l.rotation.z = sx * -0.09;
    g.add(l);
    head.add(g);
    eyes.push(g);
  }
  return eyes;
}

function addHair(head, cfg) {
  const hairMat = mat(cfg.hair, 0.66);
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.126, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.36),
    hairMat
  );
  cap.position.set(0, 0.095, -0.002);
  cap.scale.set(1.02, 0.98, 1.03);
  head.add(cap);
  const rear = new THREE.Mesh(new THREE.SphereGeometry(0.118, 20, 16), hairMat);
  rear.position.set(0, 0.07, -0.046);
  rear.scale.set(1.0, 1.12, 0.82);
  head.add(rear);

  if (cfg.hairStyle === 'bob') {
    // volume down the back and either side of the jaw
    const back = new THREE.Mesh(new THREE.SphereGeometry(0.115, 20, 16), hairMat);
    back.position.set(0, 0.055, -0.035);
    back.scale.set(1.02, 1.05, 0.86);
    head.add(back);
    for (const sx of [-1, 1]) {
      const curtain = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), hairMat);
      curtain.position.set(sx * 0.092, 0.015, 0.012);
      curtain.scale.set(0.48, 1.35, 0.72);
      curtain.rotation.z = sx * 0.08;
      head.add(curtain);
    }
    // bangs across the forehead
    const bangs = new THREE.Mesh(new THREE.SphereGeometry(0.1, 18, 12), hairMat);
    bangs.position.set(0, 0.145, 0.068);
    bangs.scale.set(0.9, 0.26, 0.4);
    bangs.rotation.x = 0.22;
    head.add(bangs);
  } else if (cfg.hairStyle === 'part') {
    const sweep = new THREE.Mesh(new THREE.SphereGeometry(0.095, 18, 12), hairMat);
    sweep.position.set(0.022, 0.155, 0.055);
    sweep.scale.set(0.92, 0.36, 0.7);
    sweep.rotation.z = -0.28;
    sweep.rotation.x = 0.1;
    head.add(sweep);
    const side = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), hairMat);
    side.position.set(-0.095, 0.09, 0.0);
    side.scale.set(0.5, 0.95, 0.9);
    head.add(side);
    addHairFade(head, cfg);
  } else if (cfg.hairStyle === 'short') {
    const top = new THREE.Mesh(new THREE.SphereGeometry(0.1, 18, 12), hairMat);
    top.position.set(0, 0.152, 0.018);
    top.scale.set(0.95, 0.42, 0.95);
    head.add(top);
    addHairFade(head, cfg);
  } else if (cfg.hairStyle === 'fade') {
    addHairFade(head, cfg);
  }
}

function addHairFade(head, cfg) {
  // darker, close-cropped hair at the temples
  const fadeMat = mat(cfg.hair, 0.75);
  for (const sx of [-1, 1]) {
    const fade = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), fadeMat);
    fade.position.set(sx * 0.103, 0.09, -0.01);
    fade.scale.set(0.42, 1.0, 0.92);
    head.add(fade);
  }
}

function addBeard(head, cfg) {
  const beardMat = mat(cfg.hair, 0.78);
  const gray = new THREE.MeshStandardMaterial({ color: cfg.grayHair ?? 0x777066, roughness: 0.8 });
  // jaw shell
  for (let i = 0; i < 9; i++) {
    const a = -0.95 + (i / 8) * 1.9;
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.026 + Math.random() * 0.004, 8, 7), i % 3 === 0 ? gray : beardMat);
    s.position.set(Math.sin(a) * 0.083, -0.032 + Math.cos(a) * 0.025, 0.062 + Math.cos(a) * 0.028);
    s.scale.set(1, 1.1, 0.8);
    head.add(s);
  }
  // moustache
  for (const sx of [-1, 1]) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 7), beardMat);
    m.position.set(sx * 0.024, 0.005, 0.104);
    m.scale.set(1.15, 0.45, 0.6);
    head.add(m);
  }
  const soul = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 7), beardMat);
  soul.position.set(0, -0.032, 0.1);
  soul.scale.set(0.9, 0.7, 0.5);
  head.add(soul);
}

function addGlasses(head) {
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x292b2c, roughness: 0.35, metalness: 0.35 });
  for (const sx of [-1, 1]) {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.0036, 8, 24), frameMat);
    rim.position.set(sx * 0.046, 0.096, 0.116);
    rim.scale.set(1.15, 0.88, 1);
    head.add(rim);
    const temple = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.006, 0.088), frameMat);
    temple.position.set(sx * 0.105, 0.1, 0.066);
    temple.rotation.y = sx * 0.18;
    head.add(temple);
  }
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.005, 0.006), frameMat);
  bridge.position.set(0, 0.1, 0.122);
  head.add(bridge);
}

function buildHead(cfg) {
  const head = new THREE.Group();
  head.position.y = 1.55;
  const skin = mat(cfg.skin, 0.57);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.116, 24, 20), skin);
  skull.position.set(0, 0.085, 0);
  skull.scale.set(0.92, 1.06, 0.96);
  skull.castShadow = true;
  head.add(skull);

  const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 16), skin);
  jaw.position.set(0, 0.025, 0.014);
  jaw.scale.set(0.9, 0.82, 0.86);
  jaw.castShadow = true;
  head.add(jaw);

  const chin = new THREE.Mesh(new THREE.SphereGeometry(0.052, 16, 12), skin);
  chin.position.set(0, -0.014, 0.052);
  chin.scale.set(0.95, 0.7, 0.75);
  head.add(chin);

  for (const sx of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.027, 12, 10), skin);
    ear.position.set(sx * 0.103, 0.078, 0.006);
    ear.scale.set(0.62, 1, 0.42);
    head.add(ear);
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), skin);
    cheek.position.set(sx * 0.06, 0.045, 0.062);
    cheek.scale.set(0.95, 0.8, 0.55);
    head.add(cheek);
  }

  // nose
  part(head, new THREE.BoxGeometry(0.022, 0.058, 0.026), skin, { y: 0.066, z: 0.105, rx: 0.12, cast: false });
  part(head, new THREE.SphereGeometry(0.021, 12, 10), skin, { y: 0.045, z: 0.122, sx: 1.05, sy: 0.82, sz: 0.92, cast: false });
  for (const sx of [-1, 1]) {
    part(head, new THREE.SphereGeometry(0.006, 8, 6), noseMat(), { x: sx * 0.014, y: 0.037, z: 0.12, cast: false });
  }

  // mouth
  const lip = new THREE.MeshStandardMaterial({ color: cfg.lip ?? 0x9a5c52, roughness: 0.6 });
  part(head, new THREE.BoxGeometry(0.047, 0.0075, 0.012), lip, { y: 0.012, z: 0.112, cast: false });
  part(head, new THREE.BoxGeometry(0.038, 0.009, 0.011), lip, { y: 0.0, z: 0.109, cast: false });
  part(head, new THREE.BoxGeometry(0.036, 0.002, 0.004), new THREE.MeshStandardMaterial({ color: 0x6f3b34, roughness: 0.7 }), { y: 0.006, z: 0.116, cast: false });

  // brows
  const browMat = mat(cfg.hair, 0.75);
  for (const sx of [-1, 1]) {
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.047, 0.008, 0.012), browMat);
    brow.position.set(sx * 0.044, 0.132, 0.112);
    brow.rotation.z = sx * -0.1;
    head.add(brow);
  }

  const eyes = addEyes(head, cfg);
  addHair(head, cfg);
  if (cfg.beard) addBeard(head, cfg);
  if (cfg.glasses) addGlasses(head);

  return { head, eyes, skin };
}

function noseMat() {
  return new THREE.MeshStandardMaterial({ color: 0x8a5a4b, roughness: 0.8 });
}

// ------------------------------------------------------------------ body

function buildArm(cfg, side) {
  const sleeveMat = mat(cfg.jacket ?? cfg.top, 0.72);
  const skinMat = mat(cfg.skin, 0.58);
  const cuffMat = mat(cfg.top, 0.6);
  const arm = new THREE.Group();
  arm.position.set(side * 0.238, 1.405, 0);
  arm.rotation.z = side * -0.075;
  arm.rotation.x = 0.035;

  const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.2, 6, 14), sleeveMat);
  upper.position.y = -0.155;
  upper.castShadow = true;
  arm.add(upper);

  const elbow = new THREE.Group();
  elbow.position.y = -0.305;
  elbow.rotation.x = -0.11;
  arm.add(elbow);

  const short = cfg.sleeve === 'short';
  const fore = new THREE.Mesh(new THREE.CapsuleGeometry(0.049, 0.19, 6, 14), short ? skinMat : sleeveMat);
  fore.position.y = -0.135;
  fore.castShadow = true;
  elbow.add(fore);

  if (!short) {
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.035, 14), cuffMat);
    cuff.position.y = -0.25;
    elbow.add(cuff);
  }

  const hand = new THREE.Mesh(new THREE.SphereGeometry(0.052, 14, 12), skinMat);
  hand.position.y = -0.29;
  hand.scale.set(0.85, 1.15, 0.62);
  hand.castShadow = true;
  elbow.add(hand);

  return { arm, elbow };
}

function buildLegs(cfg) {
  const g = new THREE.Group();
  const trouser = mat(cfg.trousers ?? 0x2d3034, 0.8);
  const skin = mat(cfg.legs === 'skin' ? cfg.skin : (cfg.trousers ?? 0x2d3034), 0.76);
  const shoeMat = mat(cfg.shoes ?? cfg.heels ?? 0x1b1b1d, 0.45);
  for (const sx of [-1, 1]) {
    const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.073, 0.31, 6, 14), trouser);
    thigh.position.set(sx * 0.095, 0.7, 0);
    thigh.castShadow = true;
    g.add(thigh);
    const calf = new THREE.Mesh(new THREE.CapsuleGeometry(0.054, 0.3, 6, 14), skin);
    calf.position.set(sx * 0.095, 0.3, 0);
    calf.castShadow = true;
    g.add(calf);
    const shoe = new THREE.Mesh(rounded(0.12, 0.075, 0.27, 0.028), shoeMat);
    shoe.position.set(sx * 0.095, 0.045, 0.055);
    shoe.castShadow = true;
    g.add(shoe);
    if (cfg.heels) {
      const heel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.075, 8), shoeMat);
      heel.position.set(sx * 0.095, 0.038, -0.065);
      g.add(heel);
    }
  }
  return g;
}

function buildTorso(cfg) {
  const g = new THREE.Group();
  const topMat = mat(cfg.top, 0.67);
  const trouserMat = mat(cfg.trousers ?? 0x2d3034, 0.8);
  const jacketMat = cfg.jacket ? mat(cfg.jacket, 0.62) : null;

  // hips / waist
  const hips = new THREE.Mesh(rounded(0.32, 0.17, 0.22, 0.06), trouserMat);
  hips.position.y = 1.0;
  hips.castShadow = true;
  g.add(hips);

  if (cfg.skirt) {
    const skirt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.175, 0.225, 0.46, 20, 1, false),
      mat(cfg.skirt, 0.75)
    );
    skirt.position.y = 0.86;
    skirt.castShadow = true;
    g.add(skirt);
  }

  // chest
  const chest = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.27, 8, 20), jacketMat ?? topMat);
  chest.position.set(0, 1.255, 0.0);
  chest.scale.set(1.1, 1.0, 0.64);
  chest.castShadow = true;
  g.add(chest);

  // shoulders
  for (const sx of [-1, 1]) {
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.097, 16, 12), jacketMat ?? topMat);
    shoulder.position.set(sx * 0.215, 1.405, 0);
    shoulder.scale.set(1, 0.9, 0.92);
    shoulder.castShadow = true;
    g.add(shoulder);
  }

  // white shirt front + tie when wearing a jacket, or shirt placket otherwise
  const shirtMat = mat(cfg.top, 0.62);
  if (cfg.jacket) {
    const shirt = new THREE.Mesh(rounded(0.13, 0.3, 0.014, 0.006), shirtMat);
    shirt.position.set(0, 1.29, 0.118);
    g.add(shirt);
  }
  if (cfg.tie) {
    const knotMat = mat(cfg.tie, 0.55);
    const tieMat = mat(cfg.tie, 0.55);
    const knot = new THREE.Mesh(rounded(0.045, 0.04, 0.022, 0.008), knotMat);
    knot.position.set(0, 1.432, 0.12);
    g.add(knot);
    const tie = new THREE.Mesh(rounded(0.042, 0.24, 0.012, 0.006), tieMat);
    tie.position.set(0, 1.29, 0.124);
    tie.rotation.z = 0.012;
    g.add(tie);
  }

  // collar
  const collarMat = mat(0xf5f4ec, 0.55);
  for (const sx of [-1, 1]) {
    const c = new THREE.Mesh(rounded(0.055, 0.065, 0.02, 0.006), collarMat);
    c.position.set(sx * 0.045, 1.445, 0.105);
    c.rotation.z = sx * 0.45;
    g.add(c);
  }

  if (cfg.skirt) {
    const neckline = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), mat(cfg.skin, 0.6));
    neckline.position.set(0, 1.44, 0.095);
    neckline.scale.set(1.2, 0.6, 0.4);
    g.add(neckline);
  }

  // ID badge + lanyard
  if (cfg.badge) {
    const lanyardMat = mat(0x24523d, 0.7);
    for (const sx of [-1, 1]) {
      const cord = new THREE.Mesh(new THREE.BoxGeometry(0.007, 0.17, 0.006), lanyardMat);
      cord.position.set(sx * 0.034, 1.36, 0.13);
      cord.rotation.z = sx * 0.16;
      g.add(cord);
    }
    const badge = new THREE.Mesh(rounded(0.072, 0.1, 0.012, 0.006), mat(0xf4f2e8, 0.5));
    badge.position.set(0.055, 1.235, 0.135);
    badge.rotation.z = -0.05;
    g.add(badge);
    const photo = new THREE.Mesh(
      new THREE.PlaneGeometry(0.05, 0.036),
      new THREE.MeshBasicMaterial({ color: 0x6d7e90 })
    );
    photo.position.set(0.055, 1.255, 0.142);
    photo.rotation.z = -0.05;
    g.add(photo);
    const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.014), new THREE.MeshBasicMaterial({ color: 0x274b38 }));
    stripe.position.set(0.055, 1.218, 0.142);
    stripe.rotation.z = -0.05;
    g.add(stripe);
  }

  // belt
  if (!cfg.skirt) {
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.325, 0.035, 0.225), mat(0x161718, 0.5));
    belt.position.y = 1.065;
    g.add(belt);
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.028, 0.01), mat(0x8c8f8e, 0.3, 0.5));
    buckle.position.set(0, 1.065, 0.116);
    g.add(buckle);
  }

  return { group: g, chest };
}

// ------------------------------------------------------------------ character

function buildCharacter(cfg) {
  const root = new THREE.Group();
  const body = new THREE.Group();
  body.scale.setScalar(cfg.height / 1.8);
  root.add(body);

  body.add(buildLegs(cfg));
  const torso = buildTorso(cfg);
  body.add(torso.group);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.057, 0.1, 12), mat(cfg.skin, 0.58));
  neck.position.y = 1.5;
  body.add(neck);

  const { head, eyes } = buildHead(cfg);
  body.add(head);

  const left = buildArm(cfg, -1);
  const right = buildArm(cfg, 1);
  body.add(left.arm, right.arm);

  // pointer badge always faces camera-ish; tiny detail
  const shadow = contactShadow();
  root.add(shadow);

  const phase = Math.random() * Math.PI * 2;
  const baseYaw = cfg.headYaw ?? 0;
  const eyeBaseScale = eyes.map((e) => e.scale.y);
  const armLeftBase = left.arm.rotation.x;
  const armRightBase = right.arm.rotation.x;

  root.userData.animate = (t) => {
    const breathe = Math.sin(t * 1.35 + phase);
    torso.chest.scale.y = 1 + breathe * 0.008;
    torso.chest.position.z = breathe * 0.002;
    root.rotation.z = Math.sin(t * 0.42 + phase) * 0.0035;
    head.rotation.y = baseYaw + Math.sin(t * 0.32 + phase) * 0.075;
    head.rotation.x = Math.sin(t * 0.24 + phase * 1.7) * 0.018;
    left.arm.rotation.x = armLeftBase + Math.sin(t * 0.5 + phase) * 0.012;
    right.arm.rotation.x = armRightBase + Math.sin(t * 0.5 + phase + 1.3) * 0.012;

    // blink every few seconds
    const cycle = (t + phase * 2.3) % 4.7;
    const blink = cycle < 0.14 ? Math.sin((cycle / 0.14) * Math.PI) : 0;
    for (let i = 0; i < eyes.length; i++) {
      eyes[i].scale.y = eyeBaseScale[i] * (1 - blink * 0.92);
    }
  };

  return root;
}

let shadowTex = null;
function contactShadow() {
  if (!shadowTex) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62);
    g.addColorStop(0, 'rgba(10,18,12,0.48)');
    g.addColorStop(0.55, 'rgba(10,18,12,0.2)');
    g.addColorStop(1, 'rgba(10,18,12,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    shadowTex = new THREE.CanvasTexture(c);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
  }
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(1.0, 0.62),
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
      toneMapped: false,
    })
  );
  m.rotation.x = -Math.PI / 2;
  m.position.set(0, 0.006, 0.02);
  m.renderOrder = 1;
  return m;
}

export function createCharacter(key) {
  const cfg = CHARACTERS[key];
  if (!cfg) throw new Error(`unknown character key: ${key}`);
  const ch = buildCharacter(cfg);
  ch.name = cfg.name;
  ch.userData.config = cfg;
  ch.userData.key = key;
  return ch;
}

export function characterKeys() {
  return ['mark', 'helly', 'irving', 'dylan', 'milchick'];
}

export function characterInfo(key) {
  return CHARACTERS[key] ?? null;
}

export const MDR_FACE_COLOR = 0xd0a98d;
