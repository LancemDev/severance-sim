// Engine entry: renderer, camera, controls, world, lighting, cast, game loop.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { createBuildingFloor, MDR } from './world.js';
import { createSevereLighting } from './lighting.js';
import { createCharacter, characterKeys, CHARACTER_SPOTS } from './characters.js';
import { createGame } from './modes.js';

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
  scene.background = new THREE.Color(0xdde7e0);
  scene.fog = new THREE.Fog(0xdde7e0, 26, 55);

  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.05, 120);
  camera.position.set(0, 1.62, 6.7);
  scene.add(camera);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  document.body.appendChild(renderer.domElement);

  // Neutral studio reflections so laminate/metal read as real materials.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.38;
  pmrem.dispose();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1.06, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.enablePan = false;
  controls.minDistance = 3.4;
  controls.maxDistance = 7.6;
  controls.minPolarAngle = 1.28;
  controls.maxPolarAngle = 1.53;
  controls.rotateSpeed = 0.55;
  controls.zoomSpeed = 0.7;
  controls.update();

  const world = createBuildingFloor();
  scene.add(world);

  const lighting = createSevereLighting({
    width: MDR.width,
    depth: MDR.depth,
    height: MDR.height,
  });
  scene.add(lighting.group);

  const showCharacters = !new URLSearchParams(location.search).has('nochars');
  const cast = [];
  if (showCharacters) {
    for (const key of characterKeys()) {
      const ch = createCharacter(key);
      const spot = CHARACTER_SPOTS[key];
      if (!spot) continue;
      ch.position.set(spot.x, spot.y ?? 0, spot.z);
      ch.rotation.y = spot.rotY ?? 0;
      scene.add(ch);
      cast.push(ch);
    }
  }

  const game = createGame({ scene, world, lighting, floor: world, cast });
  game.setCamera(camera);
  game.setMode('story');

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

  // reset view
  document.getElementById('btn-reset-view')?.addEventListener('click', () => {
    camera.position.set(0, 1.62, 6.7);
    controls.target.set(0, 1.06, 0);
    controls.update();
  });

  const clock = new THREE.Clock();
  let firstFrame = true;
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    controls.update();
    for (const ch of cast) ch.userData.animate?.(t, dt);
    game.update(dt);
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
