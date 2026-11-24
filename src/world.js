// Lumon Branch 501 "Severed Floor" world geometry.
// Faithful to the show: a massive white-corridor office (verified AD + research),
// MDR cubicle cluster, kelly-green rug, low ceilings, bright fluorescent strips.
import * as THREE from 'three';
import { palette } from './palette.js';

const P = palette;

export function createBuildingFloor() {
  // Root group: whole floor, centered at origin.
  const floor = new THREE.Group('Lumon_Branch_501_Severed_Floor');

  // --- White corridors (approx., from research: near-white walls + fluorescent ceiling)
  const corridor = buildCorridor({
    length: 120,
    width: 5,
    wallWhite: P.corridorWhite,
    ceilingWhite: P.severeWhite,
    fluorescent: true,
  });
  corridor.position.x = -60;
  floor.add(corridor);

  // Second corridor parallel, offset, as in the show's endless hallways
  const corridor2 = buildCorridor({
    length: 120,
    width: 5,
    wallWhite: P.severeWhite,
    ceilingWhite: P.severeWhiteAlt,
    fluorescent: true,
  });
  corridor2.position.x = 60;
  corridor2.rotation.y = Math.PI;
  floor.add(corridor2);

  // --- MDR cubicle cluster (verified name from Fandom wiki)
  const mdr = buildMdrCluster({ cells: 4, seatHeight: 0.6 });
  mdr.position.set(0, 0, 0);
  floor.add(mdr);

  return floor;
}

function buildCorridor({ length, width, wallWhite, ceilingWhite, fluorescent }) {
  const corridor = new THREE.Group();
  // Ceiling (fluorescent strips, approximated by narrow bars)
  const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(length * 0.95, 0.15, width),
    new THREE.MeshStandardMaterial({ color: ceilingWhite, roughness: 0.7 })
  );
  ceiling.position.y = 2.2;
  corridor.add(ceiling);

  // Walls: near-white, low (show: "suffocatingly low ceilings")
  const wallH = 2.0;
  const mkWall = (z, sign) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(length * 0.98, wallH, 0.4),
      new THREE.MeshStandardMaterial({ color: wallWhite, roughness: 0.8 })
    );
    m.position.set(0, wallH / 2, sign * width / 2);
    m.rotation.x = sign > 0 ? Math.PI / 2 : -Math.PI / 2;
    corridor.add(m);
  };
  mkWall(0, 1);
  mkWall(0, -1);

  // Floor: linoleum-ish near-white
  const floorMat = new THREE.MeshStandardMaterial({ color: P.severeWhite, roughness: 0.7 });
  const floorGeo = new THREE.BoxGeometry(length * 0.98, 0.05, width);
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.0;
  floor.rotation.x = Math.PI / 2; // lie flat
  corridor.add(floor);

  if (fluorescent) {
    // Thin strip lights: approximate the "fluorescent lighting" of the severance floor
    for (let i = -length / 2; i <= length / 2; i += 5) {
      const light = new THREE.PointLight(0xffffff, 0.12, 20, 2);
      light.position.set(i, 2.1, 0);
      light.castShadow = true;
      corridor.add(light);
      // translucent tube mesh for glow (approximation)
      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.15, transparent: true })
      );
      tube.position.copy(light.position);
      corridor.add(tube);
    }
  }
  return corridor;
}

function buildMdrCluster({ cells, seatHeight }) {
  // Four cubicles with kelly-green rug underneath (verified)
  const cluster = new THREE.Group('MDR');
  const rug = new THREE.Mesh(
    new THREE.PlaneGeometry(22, 12),
    new THREE.MeshStandardMaterial({ color: P.wallGreen, roughness: 0.3 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.01, 0);
  cluster.add(rug);

  for (let i = 0; i < cells; i++) {
    const px = -5 + i * 2.5;
    const desk = new THREE.Group();
    desk.position.set(px, 1.5, 0);
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.05, 0.9),
      new THREE.MeshStandardMaterial({ color: P.severeWhiteAlt, roughness: 0.6 })
    );
    deskTop.position.y = 0.05;
    desk.add(deskTop);
    // Retro computer (approx.: CRT)
    const crt = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.4, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x202020, roughness: 0.9 })
    );
    crt.position.set(0.3, 0.2, 0);
    desk.add(crt);
    const seat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, seatHeight, 8),
      new THREE.MeshStandardMaterial({ color: P.severeWhite, roughness: 0.6 })
    );
    seat.position.y = seatHeight / 2;
    cluster.add(desk);
    cluster.add(seat);
  }
  return cluster;
}
