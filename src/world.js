// Lumon Branch 501 — Macrodata Refinement (MDR).
// Rebuilt from frame references: wall-to-wall green carpet, white coffered
// pyramid ceiling with recessed light panels, dark-green workstation island,
// white panel walls with dark baseboards and ribbed corner vents.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { palette as P } from './palette.js';

export const MDR = { width: 22, depth: 18, height: 3.85 };

export function createBuildingFloor() {
  const root = new THREE.Group('Lumon_Branch_501');
  root.add(buildMDR());
  return root;
}

// ---------------------------------------------------------------- materials

function carpetTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#548f60';
  ctx.fillRect(0, 0, 512, 512);
  // carpet pile: dense low-contrast speckle + a faint woven grid
  for (let i = 0; i < 26000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const v = Math.random();
    ctx.fillStyle =
      v < 0.5
        ? `rgba(24,60,38,${0.05 + Math.random() * 0.07})`
        : `rgba(176,214,178,${0.02 + Math.random() * 0.05})`;
    ctx.fillRect(x, y, 1 + Math.random() * 1.6, 1 + Math.random() * 1.6);
  }
  ctx.globalAlpha = 0.035;
  ctx.strokeStyle = '#d7ead7';
  ctx.lineWidth = 1;
  for (let i = 0; i < 512; i += 4) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 7);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function wallTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#eef2ef';
  ctx.fillRect(0, 0, 256, 512);
  // faint panel mottling
  for (let i = 0; i < 5000; i++) {
    ctx.fillStyle = `rgba(160,175,168,${Math.random() * 0.03})`;
    ctx.fillRect(Math.random() * 256, Math.random() * 512, 2, 1);
  }
  // one vertical panel seam per tile
  ctx.fillStyle = 'rgba(104,122,115,0.4)';
  ctx.fillRect(0, 0, 3, 512);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillRect(2, 0, 1, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function ribTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#5d6b6e';
  ctx.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 14) {
    ctx.fillStyle = '#95a3a5';
    ctx.fillRect(x, 0, 5, 256);
    ctx.fillStyle = '#3c474a';
    ctx.fillRect(x + 5, 0, 3, 256);
    ctx.fillStyle = '#93a1a3';
    ctx.fillRect(x + 11, 0, 2, 256);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeCrtTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 192;
  const ctx = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;

  const draw = () => {
    ctx.fillStyle = '#06130c';
    ctx.fillRect(0, 0, 256, 192);
    // Macrodata "tumblers": grids of numbers, mostly sorted into buckets
    ctx.font = 'bold 15px ui-monospace, monospace';
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 12; col++) {
        const val = Math.floor(Math.random() * 100);
        ctx.fillStyle =
          val % 7 === 0 ? '#d8ffdf' : val % 3 === 0 ? '#8ff0ad' : '#4fd37c';
        ctx.fillText(String(val).padStart(2, '0'), 8 + col * 21, 20 + row * 20);
      }
    }
    // scanlines + vignette
    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    for (let y = 0; y < 192; y += 3) ctx.fillRect(0, y, 256, 1);
    ctx.strokeStyle = 'rgba(120,255,160,0.22)';
    ctx.lineWidth = 6;
    ctx.strokeRect(2, 2, 252, 188);
    tex.needsUpdate = true;
  };
  draw();
  setInterval(draw, 420);
  return tex;
}

// ---------------------------------------------------------------- helpers

function box(parent, w, h, d, x, y, z, mat, { rotY = 0, rounded = 0 } = {}) {
  const geo =
    rounded > 0
      ? new RoundedBoxGeometry(w, h, d, 4, rounded)
      : new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.rotation.y = rotY;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

// Recessed pyramid ceiling cell, viewed from below.
function pyramidCell(size = 1.94, rise = 0.24) {
  const h = size / 2;
  const A = [-h, 0, -h];
  const B = [h, 0, -h];
  const C = [h, 0, h];
  const D = [-h, 0, h];
  const E = [0, rise, 0];
  const tris = [
    [A, B, E],
    [B, C, E],
    [C, D, E],
    [D, A, E],
  ];
  const pos = [];
  for (const [p1, p2, p3] of tris) {
    // winding so the face normal points down into the room
    const ux = p2[0] - p1[0], uy = p2[1] - p1[1], uz = p2[2] - p1[2];
    const vx = p3[0] - p1[0], vy = p3[1] - p1[1], vz = p3[2] - p1[2];
    const ny = uz * vx - ux * vz;
    if (ny > 0) pos.push(...p1, ...p3, ...p2);
    else pos.push(...p1, ...p2, ...p3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  return geo;
}

// ---------------------------------------------------------------- room

function buildMDR() {
  const room = new THREE.Group('MDR');
  const W = MDR.width;
  const D = MDR.depth;
  const H = MDR.height;

  const carpet = new THREE.MeshStandardMaterial({
    map: carpetTexture(),
    roughness: 0.97,
    metalness: 0,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), carpet);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  const wallBase = wallTexture();
  const wallMat = (len) => {
    const t = wallBase.clone();
    t.needsUpdate = true;
    t.repeat.set(len / 1.5, 1);
    return new THREE.MeshStandardMaterial({
      map: t,
      color: 0xffffff,
      roughness: 0.86,
      metalness: 0,
    });
  };
  const trimMat = new THREE.MeshStandardMaterial({
    color: P.trimDark,
    roughness: 0.62,
    metalness: 0.15,
  });
  const ribMat = new THREE.MeshStandardMaterial({
    map: ribTexture(),
    roughness: 0.66,
    metalness: 0.2,
  });

  const addWall = (len, x, z, rotY) => {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(len, H), wallMat(len));
    wall.position.set(x, H / 2, z);
    wall.rotation.y = rotY;
    wall.receiveShadow = true;
    room.add(wall);

    const base = box(room, len, 0.15, 0.04, x, 0.075, z, trimMat, { rotY });
    base.position.set(x + Math.sin(rotY) * 0.022, 0.075, z + Math.cos(rotY) * 0.022);
    const frieze = box(room, len, 0.24, 0.05, x, H - 0.12, z, trimMat, { rotY });
    frieze.position.set(x + Math.sin(rotY) * 0.026, H - 0.12, z + Math.cos(rotY) * 0.026);
  };

  addWall(W, 0, -D / 2, 0); // back
  addWall(W, 0, D / 2, Math.PI); // front
  addWall(D, -W / 2, 0, Math.PI / 2); // left
  addWall(D, W / 2, 0, -Math.PI / 2); // right

  // Ribbed acoustic panels at the corners / wall bays (seen either side of frame).
  const ribPanel = (x, z, rotY) => {
    const g = new THREE.Group();
    const backing = new THREE.Mesh(new THREE.BoxGeometry(1.5, H - 0.45, 0.06), ribMat);
    backing.position.y = H / 2 - 0.06;
    g.add(backing);
    const capTop = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.05, 0.1), trimMat);
    capTop.position.y = H - 0.25;
    const capBot = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.05, 0.1), trimMat);
    capBot.position.y = 0.2;
    g.add(capTop, capBot);
    g.position.set(x, 0, z);
    g.rotation.y = rotY;
    room.add(g);
  };
  ribPanel(-W / 2 + 1.1, -D / 2 + 0.04, 0);
  ribPanel(W / 2 - 1.1, -D / 2 + 0.04, 0);
  ribPanel(-W / 2 + 1.1, D / 2 - 0.04, Math.PI);
  ribPanel(W / 2 - 1.1, D / 2 - 0.04, Math.PI);
  ribPanel(-W / 2 + 0.04, -D / 2 + 4.6, Math.PI / 2);
  ribPanel(-W / 2 + 0.04, D / 2 - 4.6, Math.PI / 2);
  ribPanel(W / 2 - 0.04, -D / 2 + 4.6, -Math.PI / 2);
  ribPanel(W / 2 - 0.04, D / 2 - 4.6, -Math.PI / 2);

  buildCeiling(room, W, D, H);
  buildDoors(room, W, D, H);
  buildClock(room, D, H);
  buildWorkstationIsland(room);
  buildWallDetails(room, W, D, H);

  // only the set furniture and cast should cast shadows; structural ceiling
  // and wall pieces would otherwise stripe the carpet with fake sunlight.
  room.traverse((o) => { if (o.isMesh) o.castShadow = false; });
  const island = room.getObjectByName('MDR_workstation_island');
  if (island) island.traverse((o) => { if (o.isMesh) o.castShadow = true; });

  return room;
}

// ---------------------------------------------------------------- ceiling

function ceilingTexture(W, D) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#e7efea';
  ctx.fillRect(0, 0, 512, 512);
  const center = [256, 256];
  const facets = [
    { pts: [[0, 0], [512, 0], center], light: '#e9f1ec', dark: '#c7d6cf' },
    { pts: [[512, 0], [512, 512], center], light: '#e5eee9', dark: '#bccdc4' },
    { pts: [[512, 512], [0, 512], center], light: '#edf4ef', dark: '#cbd9d2' },
    { pts: [[0, 512], [0, 0], center], light: '#e2ece6', dark: '#c2d2c9' },
  ];
  for (const f of facets) {
    const [a, b] = f.pts;
    const edgeX = (a[0] + b[0]) / 2;
    const edgeY = (a[1] + b[1]) / 2;
    const g = ctx.createLinearGradient(edgeX, edgeY, center[0], center[1]);
    g.addColorStop(0, f.dark);
    g.addColorStop(0.55, f.light);
    g.addColorStop(1, '#f6faf7');
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.lineTo(center[0], center[1]);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
  }
  // centre peak highlight
  const rad = ctx.createRadialGradient(256, 256, 4, 256, 256, 120);
  rad.addColorStop(0, 'rgba(255,255,255,0.5)');
  rad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, 512, 512);
  // diagonal ridges
  ctx.strokeStyle = 'rgba(120,142,131,0.5)';
  ctx.lineWidth = 3;
  for (const [x, y] of [[0, 0], [512, 0], [512, 512], [0, 512]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(256, 256);
    ctx.stroke();
  }
  // perimeter shadow gap
  ctx.strokeStyle = 'rgba(130,150,140,0.6)';
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, 512, 512);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(5, 5, 502, 502);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(W / 2, D / 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function buildCeiling(room, W, D, H) {
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(W, D),
    new THREE.MeshStandardMaterial({
      map: ceilingTexture(W, D),
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0,
    })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = H;
  ceiling.receiveShadow = true;
  room.add(ceiling);

  // fine structural grid
  const beamMat = new THREE.MeshStandardMaterial({ color: 0xe8efeb, roughness: 0.8 });
  for (let x = -W / 2; x <= W / 2 + 0.01; x += 2) {
    box(room, 0.055, 0.07, D, x, H - 0.018, 0, beamMat);
  }
  for (let z = -D / 2; z <= D / 2 + 0.01; z += 2) {
    box(room, W, 0.07, 0.055, 0, H - 0.018, z, beamMat);
  }

  // large recessed light panels on a regular grid
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xb9c6c0, roughness: 0.5 });
  const cols = Math.round(W / 2);
  const rows = Math.round(D / 2);
  for (let ix = 0; ix < cols; ix++) {
    for (let iz = 0; iz < rows; iz++) {
      if (!(ix % 3 === 1 && iz % 2 === 1)) continue;
      const x = -W / 2 + 1 + ix * 2;
      const z = -D / 2 + 1 + iz * 2;
      const frame = box(room, 1.7, 0.035, 0.86, x, H - 0.055, z, frameMat);
      frame.castShadow = false;
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.56, 0.72), lightMat);
      panel.rotation.x = Math.PI / 2;
      panel.position.set(x, H - 0.075, z);
      room.add(panel);
    }
  }
}

// ---------------------------------------------------------------- doors & trim

function textTexture(text, { fg = '#26342f', bg = '#f2f4f0', w = 512, h = 128, font = '600 44px ui-sans-serif, Helvetica, Arial' } = {}) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '6px';
  ctx.fillText(text, w / 2, h / 2 + 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function buildDoors(room, W, D, H) {
  const doorMat = new THREE.MeshStandardMaterial({ color: 0xf4f6f3, roughness: 0.52 });
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0xc3cbc7, roughness: 0.55 });
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x525b5d,
    roughness: 0.35,
    metalness: 0.7,
  });

  const doubleDoor = (x, z) => {
    const g = new THREE.Group();
    box(g, 2.34, 0.08, 0.12, 0, 2.56, 0, edgeMat);
    for (const sx of [-1, 1]) {
      box(g, 1.08, 2.5, 0.09, sx * 0.56, 1.25, 0.04, doorMat);
      // recessed panel line
      box(g, 0.92, 2.06, 0.01, sx * 0.56, 1.3, 0.095, edgeMat);
      box(g, 0.84, 1.98, 0.012, sx * 0.56, 1.3, 0.1, doorMat);
    }
    // center seam + handles
    box(g, 0.02, 2.42, 0.12, 0, 1.25, 0.05, edgeMat);
    for (const sx of [-1, 1]) {
      box(g, 0.03, 0.32, 0.035, sx * 0.16, 1.06, 0.13, metalMat, { rounded: 0.01 });
    }
    g.position.set(x, 0, z);
    room.add(g);
  };

  const singleDoor = (x, z, label) => {
    const g = new THREE.Group();
    box(g, 1.2, 0.08, 0.12, 0, 2.56, 0, edgeMat);
    box(g, 1.06, 2.5, 0.09, 0, 1.25, 0.04, doorMat);
    box(g, 0.9, 2.06, 0.012, 0, 1.3, 0.095, edgeMat);
    box(g, 0.82, 1.98, 0.012, 0, 1.3, 0.101, doorMat);
    box(g, 0.03, 0.3, 0.035, 0.42, 1.05, 0.13, metalMat, { rounded: 0.01 });
    if (label) {
      const plaque = new THREE.Mesh(
        new THREE.PlaneGeometry(0.56, 0.14),
        new THREE.MeshBasicMaterial({ map: textTexture(label) })
      );
      plaque.position.set(0, 2.72, 0.02);
      g.add(plaque);
    }
    g.position.set(x, 0, z);
    room.add(g);
  };

  const zBack = -D / 2 + 0.06;
  doubleDoor(-7.2, zBack);
  singleDoor(1.2, zBack, 'MDR');
  singleDoor(5.6, zBack);
}

// ---------------------------------------------------------------- clock

function buildClock(room, D, H) {
  const g = new THREE.Group();
  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.36, 0.05, 40),
    new THREE.MeshStandardMaterial({ color: 0x4b5658, roughness: 0.4, metalness: 0.4 })
  );
  rim.rotation.x = Math.PI / 2;
  g.add(rim);
  const face = new THREE.Mesh(
    new THREE.CircleGeometry(0.33, 40),
    new THREE.MeshStandardMaterial({ color: 0xf7f8f4, roughness: 0.5 })
  );
  face.position.z = 0.028;
  g.add(face);
  const handMat = new THREE.MeshStandardMaterial({ color: 0x2e3a37, roughness: 0.5 });
  const hour = box(g, 0.026, 0.15, 0.012, 0, 0.03, 0.038, handMat);
  hour.rotation.z = Math.PI * 0.33;
  hour.geometry.translate(0, 0.06, 0);
  hour.position.set(-0.03, 0.04, 0.038);
  const minute = box(g, 0.018, 0.21, 0.012, 0, 0.02, 0.044, handMat);
  minute.geometry.translate(0, 0.08, 0);
  minute.rotation.z = -Math.PI * 0.12;
  minute.position.set(0.02, 0.03, 0.044);
  const pin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.014, 0.02, 10),
    handMat
  );
  pin.rotation.x = Math.PI / 2;
  pin.position.z = 0.05;
  g.add(pin);
  g.position.set(2.9, 2.63, -D / 2 + 0.08);
  room.add(g);
}

// ---------------------------------------------------------------- workstation

function buildWorkstationIsland(room) {
  const island = new THREE.Group('MDR_workstation_island');
  const deskMat = new THREE.MeshStandardMaterial({
    color: 0xf6f7f4,
    roughness: 0.34,
    metalness: 0.02,
  });
  const deskEdgeMat = new THREE.MeshStandardMaterial({ color: 0xd7dcd8, roughness: 0.45 });
  const greenMat = new THREE.MeshStandardMaterial({
    color: 0x294535,
    roughness: 0.72,
    metalness: 0.02,
  });
  const greenCapMat = new THREE.MeshStandardMaterial({ color: 0xeeeFec, roughness: 0.4 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x22272a, roughness: 0.58 });
  const beigeMat = new THREE.MeshStandardMaterial({ color: 0xd8d2bf, roughness: 0.58 });
  const blueMat = new THREE.MeshStandardMaterial({ color: 0x273e5e, roughness: 0.5 });
  const crtTex = makeCrtTexture();
  const screenMat = new THREE.MeshBasicMaterial({ map: crtTex, toneMapped: false });

  // central green spine + white cap rail
  box(island, 4.7, 0.8, 0.08, 0, 1.14, 0, greenMat);
  box(island, 4.78, 0.045, 0.105, 0, 1.562, 0, greenCapMat);
  // end walls of the island
  for (const sx of [-1, 1]) {
    box(island, 0.08, 0.8, 3.5, sx * 2.31, 1.14, 0, greenMat);
    box(island, 0.105, 0.045, 3.58, sx * 2.31, 1.562, 0, greenCapMat);
    box(island, 0.1, 0.1, 3.5, sx * 2.31, 0.76, 0, deskEdgeMat);
  }
  // divider between the two refiner nooks on each side
  for (const sz of [-1, 1]) {
    box(island, 0.06, 0.8, 1.32, 0, 1.14, sz * 0.92, greenMat);
    box(island, 0.09, 0.04, 1.4, 0, 1.562, sz * 0.92, greenCapMat);
  }

  // desks: two long counters facing outward, each with drawers
  for (const sz of [-1, 1]) {
    const z = sz * 0.93;
    // two separate desks per side with a seam at the centre divider
    for (const dx of [-1, 1]) {
      box(island, 2.24, 0.065, 1.34, dx * 1.16, 0.795, z, deskMat);
      box(island, 2.24, 0.03, 1.36, dx * 1.16, 0.755, z, deskEdgeMat);
    }
    // drawer pedestals
    for (const sx of [-1.65, 1.65]) {
      box(island, 0.62, 0.62, 0.92, sx, 0.45, z + sz * 0.05, deskMat);
      for (let d = 0; d < 3; d++) {
        box(island, 0.54, 0.015, 0.02, sx, 0.28 + d * 0.17, z + sz * 0.55, deskEdgeMat);
      }
    }
    // slim outer legs and centre support
    for (const lx of [-2.22, 2.22]) {
      box(island, 0.05, 0.75, 0.05, lx, 0.375, z + sz * 0.6, deskEdgeMat);
    }
    box(island, 0.06, 0.74, 0.04, 0, 0.37, z + sz * 0.6, deskEdgeMat);
  }

  // CRTs — 2 per side, facing out from the green spine
  for (const sz of [-1, 1]) {
    for (const x of [-1.15, 1.15]) {
      const z = sz * 0.34;
      const g = new THREE.Group();
      const body = new THREE.Mesh(new RoundedBoxGeometry(0.56, 0.44, 0.44, 4, 0.045), beigeMat);
      body.position.y = 0.23;
      body.castShadow = true;
      body.receiveShadow = true;
      g.add(body);
      const face = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.3), beigeMat);
      face.position.set(0, 0.245, sz * 0.223);
      face.rotation.y = sz > 0 ? 0 : Math.PI;
      g.add(face);
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.255), screenMat);
      screen.position.set(0, 0.245, sz * 0.228);
      screen.rotation.y = sz > 0 ? 0 : Math.PI;
      g.add(screen);
      // gentle screen light onto the desk
      const glow = new THREE.PointLight(0x6cffa0, 0.12, 0.9, 2);
      glow.position.set(0, 0.24, sz * 0.34);
      g.add(glow);
      const base = new THREE.Mesh(new RoundedBoxGeometry(0.3, 0.05, 0.26, 3, 0.02), beigeMat);
      base.position.set(0, 0.02, 0);
      g.add(base);
      g.position.set(x, 0.83, z);
      island.add(g);
    }
  }

  // keyboards, mice, papers, phones, mugs, lamps
  const kbMat = new THREE.MeshStandardMaterial({ color: 0xe6e1cf, roughness: 0.55 });
  const paperMat = new THREE.MeshStandardMaterial({ color: 0xfbfaf4, roughness: 0.85 });
  const mugMat = new THREE.MeshStandardMaterial({ color: 0x2e4f8a, roughness: 0.28 });
  const lampMat = new THREE.MeshStandardMaterial({ color: 0xd9d9d2, roughness: 0.32, metalness: 0.35 });
  const lampLight = new THREE.PointLight(0xffe1b0, 0.55, 2.2, 2);
  for (const sz of [-1, 1]) {
    for (const x of [-1.15, 1.15]) {
      // keyboard in front of each chair
      box(island, 0.46, 0.026, 0.17, x, 0.85, sz * 1.1, kbMat, { rounded: 0.02 });
      box(island, 0.16, 0.018, 0.22, x + 0.34, 0.849, sz * 1.12, blueMat, { rounded: 0.02 });
      // mouse pad + mouse
      const pad = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.28), blueMat);
      pad.rotation.x = -Math.PI / 2;
      pad.position.set(x + 0.36, 0.842, sz * 1.08);
      island.add(pad);
      const mouse = new THREE.Mesh(new RoundedBoxGeometry(0.07, 0.035, 0.1, 3, 0.02), kbMat);
      mouse.position.set(x + 0.36, 0.86, sz * 1.06);
      island.add(mouse);
      // papers
      box(island, 0.3, 0.008, 0.22, x - 0.42, 0.842, sz * 1.12, paperMat);
      box(island, 0.26, 0.008, 0.19, x - 0.4, 0.851, sz * 1.1, paperMat);
      box(island, 0.11, 0.004, 0.08, x - 0.4, 0.857, sz * 1.1, new THREE.MeshStandardMaterial({ color: 0x8ba7bd, roughness: 0.6 }));
    }
    // blue desk phone
    const phone = new THREE.Group();
    box(phone, 0.24, 0.06, 0.16, 0, 0.03, 0, blueMat, { rounded: 0.02 });
    box(phone, 0.07, 0.05, 0.18, -0.11, 0.08, 0, blueMat, { rounded: 0.02 });
    phone.position.set(2.05, 0.86, sz * 0.38);
    island.add(phone);
    // mug
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.11, 16, 1, true), mugMat);
    mug.position.set(-2.02, 0.9, sz * 0.44);
    mug.castShadow = true;
    island.add(mug);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.008, 8, 16), mugMat);
    handle.position.set(-2.07, 0.9, sz * 0.44);
    handle.rotation.y = Math.PI / 2;
    island.add(handle);
  }

  // task lamp on Helly-side desk
  const lamp = new THREE.Group();
  const lBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.03, 20), lampMat);
  lBase.position.y = 0.015;
  const lArm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.45, 10), lampMat);
  lArm.position.set(0.08, 0.24, 0);
  lArm.rotation.z = -0.35;
  const lArm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.36, 10), lampMat);
  lArm2.position.set(0.26, 0.44, 0);
  lArm2.rotation.z = 0.8;
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.16, 16, 1, true), lampMat);
  shade.position.set(0.4, 0.5, 0);
  shade.rotation.z = 2.25;
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffefcf }));
  bulb.position.set(0.44, 0.49, 0);
  lampLight.position.set(0.5, 0.45, 0);
  lamp.add(lBase, lArm, lArm2, shade, bulb, lampLight);
  lamp.position.set(-0.65, 0.86, 0.55);
  island.add(lamp);

  // framed photo (Kier / personal)
  const frame = new THREE.Group();
  box(frame, 0.16, 0.2, 0.02, 0, 0, 0, new THREE.MeshStandardMaterial({ color: 0x6b4a32, roughness: 0.6 }));
  const photo = new THREE.Mesh(
    new THREE.PlaneGeometry(0.12, 0.16),
    new THREE.MeshStandardMaterial({ color: 0xe8dcc6, roughness: 0.8 })
  );
  photo.position.z = 0.012;
  frame.add(photo);
  frame.position.set(1.3, 0.96, -0.9);
  frame.rotation.y = Math.PI;
  island.add(frame);

  island.add(buildChairs());
  room.add(island);
}

function buildChairs() {
  const g = new THREE.Group('chairs');
  const black = new THREE.MeshStandardMaterial({ color: 0x252a2c, roughness: 0.48 });
  const blackSoft = new THREE.MeshStandardMaterial({ color: 0x343a3c, roughness: 0.7 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x8c9496, roughness: 0.3, metalness: 0.65 });
  const matMat = new THREE.MeshStandardMaterial({
    color: 0xcfdad2,
    roughness: 0.14,
    metalness: 0.05,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
  });

  for (const sz of [-1, 1]) {
    for (const x of [-1.15, 1.15]) {
      const c = new THREE.Group();
      const mat = new THREE.Mesh(new THREE.CircleGeometry(0.78, 36), matMat);
      mat.rotation.x = -Math.PI / 2;
      mat.position.y = 0.008;
      c.add(mat);
      const lift = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.36, 12), metal);
      lift.position.y = 0.28;
      c.add(lift);
      for (let a = 0; a < 5; a++) {
        const arm = new THREE.Group();
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.035, 0.06), black);
        leg.position.x = 0.17;
        arm.add(leg);
        const wheel = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), blackSoft);
        wheel.position.set(0.34, -0.03, 0);
        arm.add(wheel);
        arm.rotation.y = (a / 5) * Math.PI * 2;
        arm.position.y = 0.07;
        c.add(arm);
      }
      const seat = new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.09, 0.5, 4, 0.04), black);
      seat.position.y = 0.48;
      seat.castShadow = true;
      c.add(seat);
      const back = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.58, 0.075, 4, 0.035), blackSoft);
      back.position.set(0, 0.82, 0.24);
      back.rotation.x = -0.12;
      back.castShadow = true;
      c.add(back);
      for (const ax of [-1, 1]) {
        const support = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.04), black);
        support.position.set(ax * 0.26, 0.6, 0.06);
        c.add(support);
        const pad = new THREE.Mesh(new RoundedBoxGeometry(0.09, 0.035, 0.3, 3, 0.02), blackSoft);
        pad.position.set(ax * 0.28, 0.7, 0.0);
        c.add(pad);
      }
      c.position.set(x, 0, sz * 1.62);
      c.rotation.y = sz > 0 ? 0 : Math.PI;
      g.add(c);
    }
  }
  return g;
}

// ---------------------------------------------------------------- wall details

function buildWallDetails(room, W, D, H) {
  // floor outlet covers (small dark details)
  const outMat = new THREE.MeshStandardMaterial({ color: 0x4d5954, roughness: 0.6 });
  for (const x of [-8, -3, 3, 8]) {
    box(room, 0.22, 0.012, 0.12, x, 0.006, -D / 2 + 0.9, outMat);
  }
}
