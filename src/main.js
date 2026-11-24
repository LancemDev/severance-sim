// Engine entry: scene, camera, controls, world, lighting, characters, game loop.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { createBuildingFloor } from './world.js';
import { createSevereLighting, createOutieLighting } from './lighting.js';
import { createCharacter, characterKeys, CHARACTER_SPOTS } from './characters.js';
import { createGame } from './modes.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 500);
camera.position.set(0, 8, 12);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x202020);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = true;
controls.maxPolarAngle = Math.PI / 2.2;

const world = createBuildingFloor();
scene.add(world);

const lighting = createSevereLighting({ width: 120 });
scene.add(lighting.group);

const characters = characterKeys().map((key) => {
  const ch = createCharacter(key);
  const spot = CHARACTER_SPOTS[key];
  ch.position.set(spot.x, spot.y, spot.z + 1);
  scene.add(ch);
  return ch;
});

const game = createGame({ scene, world, lighting, floor: world });
game.setCamera(camera);

// Simple player pointer: orbit around center via mouse
renderer.setAnimationLoop(() => {
  controls.update();
  game.update(0);
  renderer.render(scene, camera);
});

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
