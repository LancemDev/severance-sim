// Engine entry: scene, camera, controls, world, lighting, characters, game loop.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { createBuildingFloor } from './world.js';
import { createSevereLighting } from './lighting.js';
import { createCharacter, characterKeys, CHARACTER_SPOTS } from './characters.js';
import { createGame } from './modes.js';

// --- Surface runtime errors on the page instead of an empty black screen.
function showError(message) {
  const el = document.getElementById('error-overlay');
  if (!el) return;
  el.hidden = false;
  el.textContent = `Couldn't boot the Lumon floor:\n\n${message}`;
  const loading = document.getElementById('loading');
  if (loading) loading.hidden = true;
}
window.addEventListener('error', (e) => showError(e.message || 'Script error'));
window.addEventListener('unhandledrejection', (e) => showError(String(e.reason)));

try {
  start();
} catch (err) {
  showError(err && err.stack ? err.stack : String(err));
}

function start() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0e0e10);

  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 200);
  camera.position.set(0, 2.2, 8.5);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.2, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 3;
  controls.maxDistance = 16;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.update();

  const world = createBuildingFloor();
  scene.add(world);

  const lighting = createSevereLighting({ width: 30, height: 2.4 });
  scene.add(lighting.group);

  const characters = characterKeys().map((key) => {
    const ch = createCharacter(key);
    const spot = CHARACTER_SPOTS[key];
    ch.position.set(spot.x, spot.y, spot.z);
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

  let firstFrame = true;
  renderer.setAnimationLoop(() => {
    controls.update();
    game.update(0);
    renderer.render(scene, camera);
    if (firstFrame) {
      firstFrame = false;
      const loading = document.getElementById('loading');
      if (loading) loading.hidden = true;
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}
