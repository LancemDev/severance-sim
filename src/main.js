// Engine entry: scene, camera, controls, world, lighting, characters, game loop.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { createBuildingFloor } from './world.js';
import { createSevereLighting, createOutieLighting } from './lighting.js';
import { createCharacter, characterKeys, CHARACTER_SPOTS } from './characters.js';
import { createGame } from './modes.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 500);
camera.position.set(0, 8, 13);
camera.lookAt(0, 1.5, 0); // aim at the MDR cubicle cluster
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x1d1d1d);
THREE.ColorManagement.enabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // approximates soft shadows for realism
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = true;
controls.maxPolarAngle = Math.PI / 2.2;
controls.enableDamping = true; // smoother orbit (Severance floors feel kind of dense/smooth)

const world = createBuildingFloor();
scene.add(world);

const lighting = createSevereLighting({ width: 120 });
scene.add(lighting.group);

const characters = characterKeys().map((key) => {
  const ch = createCharacter(key);
  const spot = CHARACTER_SPOTS[key];
  ch.position.set(spot.x, spot.y, spot.z + 1);
  ch.castShadow = true;
  scene.add(ch);
  return ch;
});

const game = createGame({ scene, world, lighting, floor: world });
game.setCamera(camera);
game.renderUI();

// Mode + control wiring
document.getElementById('btn-story').addEventListener('click', () => game.setMode('story'));
document.getElementById('btn-general').addEventListener('click', () => game.setMode('general'));

const btnTransition = document.getElementById('btn-transition');
if (btnTransition) {
  btnTransition.addEventListener('click', () =>
    game.doTransition(game.state.severMode === 'severed' ? 'outie' : 'severed', 'the Dingle')
  );
}

const btnToggle = document.getElementById('btn-toggle-world');
if (btnToggle) {
  btnToggle.addEventListener('click', () => {
    game.state.severMode = game.state.severMode === 'severed' ? 'outie' : 'severed';
    game.renderUI();
    game.log(`World toggled to ${game.state.severMode}.`);
  });
}

const btnHelly = document.getElementById('btn-toggle-helly');
if (btnHelly) btnHelly.addEventListener('click', () => game.toggleSpawn('helly'));

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
