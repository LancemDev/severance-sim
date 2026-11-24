// Lumon Branch 501 "Severed Floor".
// Faithful to show research: windowless near-white hall, low ceilings, fluorescent strips,
// kelly-green MDR rug, retro CRTs, white cubicle partitions.
import * as THREE from 'three';
import { palette as P } from './palette.js';

export function createBuildingFloor() {
  const floor = new THREE.Group('Lumon_Branch_501_Severed_Floor');
  floor.add(buildHall());
  return floor;
}

function buildHall() {
  const hall = new THREE.Group('hall');
  const W = 30; // x
  const D = 18; // z
  const H = 3.2; // y (a little higher than the show's low ceilings, for camera room)

  // Linoleum-ish near-white floor
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(W, D),
    new THREE.MeshStandardMaterial({ color: P.severeWhite, roughness: 0.65 })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  hall.add(floorMesh);

  // White walls (four thin boxes, no rotations in the wrong axis)
  const wallMat = new THREE.MeshStandardMaterial({ color: P.corridorWhite, roughness: 0.9 });
  const walls = [
    [W, H, 0.2, 0, -D / 2], // back
    [W, H, 0.2, 0, D / 2], // front (behind camera)
    [0.2, H, D, -W / 2, 0], // left
    [0.2, H, D, W / 2, 0], // right
  ];
  for (const [w, h, d, x, z] of walls) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
    wall.position.set(x, h / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    hall.add(wall);
  }

  // Ceiling
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(W, D),
    new THREE.MeshStandardMaterial({ color: P.severeWhiteAlt, roughness: 0.9, side: THREE.DoubleSide })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = H;
  hall.add(ceiling);

  // Fluorescent ceiling strips (the "retina-frying sterile white" look)
  const stripMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let x = -12; x <= 12; x += 4) {
    for (const z of [-4.5, -1.5, 1.5, 4.5]) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.05, 0.12), stripMat);
      strip.position.set(x, H - 0.04, z);
      hall.add(strip);
    }
  }

  // Kelly-green MDR rug (verified detail from AD)
  const rug = new THREE.Mesh(
    new THREE.PlaneGeometry(13, 6.5),
    new THREE.MeshStandardMaterial({ color: P.wallGreen, roughness: 0.35 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.012, 0.4);
  rug.receiveShadow = true;
  hall.add(rug);

  // MDR workstations (desks facing the camera, characters stand in front of them)
  const seats = [-5, -2.5, 0, 2.5, 5];
  for (let i = 0; i < seats.length; i++) {
    hall.add(buildWorkstation(seats[i], i));
  }

  return hall;
}

function buildWorkstation(x, i) {
  const station = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({ color: P.severeWhite, roughness: 0.6 });
  const deskMat = new THREE.MeshStandardMaterial({ color: P.severeWhiteAlt, roughness: 0.5 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x212124, roughness: 0.8 });

  // Desk top at standard 0.75 m height
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.06, 0.8), deskMat);
  top.position.set(x, 0.75, -0.9);
  top.castShadow = true;
  top.receiveShadow = true;
  station.add(top);

  // Desk legs
  for (const [dx, dz] of [[-0.6, -1.2], [0.6, -1.2], [-0.6, -0.6], [0.6, -0.6]]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.72, 0.05), deskMat);
    leg.position.set(x + dx, 0.36, dz);
    station.add(leg);
  }

  // White partition behind the desk (cubicle wall feel)
  const partition = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 0.05), white);
  partition.position.set(x, 0.55, -1.35);
  partition.castShadow = true;
  partition.receiveShadow = true;
  station.add(partition);

  // Retro CRT monitor; screen faces the characters (+z)
  const crt = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.4, 0.38), dark);
  crt.position.set(x + 0.3, 1.0, -0.95);
  crt.castShadow = true;
  station.add(crt);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.32, 0.26),
    new THREE.MeshBasicMaterial({ color: 0x0d2411 }) // dark green CRT glow
  );
  screen.position.set(x + 0.3, 1.0, -0.755);
  station.add(screen);

  // Keyboard
  const kb = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.16), white);
  kb.position.set(x + 0.22, 0.79, -0.7);
  station.add(kb);

  // Simple task chair behind the desk
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), white);
  seat.position.set(x, 0.48, -1.05);
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.06), white);
  back.position.set(x, 0.75, -1.28);
  station.add(seat, back);

  station.userData.index = i;
  return station;
}
