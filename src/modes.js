// Two modes:
//  - Story: the Season 1 arc, beat by beat.
//  - General: freeform severed-floor activity.
import * as THREE from 'three';
import { createCharacter, characterKeys, CHARACTER_SPOTS } from './characters.js';
import { createGlitchCut, spawnElevatorHum, transitionDollyZoom, DING_PITCHES } from './transition.js';

export const STORY_BEATS = [
  {
    id: 1,
    title: 'Orientation',
    desc: 'Helly R. wakes on the severed floor. Mark S. walks her through the MDR orientation: who she is in here, and who she is not.',
  },
  {
    id: 2,
    title: 'Macrodata Refinement',
    desc: 'Four refiners, four desks, one green carpet. The numbers are scary, and the work is mysterious. Meet Mark, Helly, Irving and Dylan.',
  },
  {
    id: 3,
    title: 'The Perpetuity Wing',
    desc: 'Kier Eagan, the Nine, and the Four Tempers: Woe, Frolic, Dread and Malice. Lumon has been taming humanity since 1865.',
  },
  {
    id: 4,
    title: 'Wellness & the Board',
    desc: 'Ms. Casey reads the facts. The Break Room waits. Harmony Cobel watches from the outside, and the Board is always listening.',
  },
  {
    id: 5,
    title: 'Overtime Contingency',
    desc: 'The innies reach the outside world for thirty-nine minutes. Helly finds a gala. Irving finds Burt. Mark finds a photograph.',
  },
  {
    id: 6,
    title: 'The Testing Floor',
    desc: 'Underneath Branch 501: the Exports Hall, the testing rooms, and Cold Harbor. Gemma is alive. The work was never about the numbers.',
  },
];

export function createGame({ scene, world, lighting, floor, cast = [] }) {
  const state = {
    mode: 'story',
    storyIndex: 0,
    severMode: 'severed',
    events: [],
    world,
    scene,
    floor,
    cast,
    location: 'mdr',
  };

  const spawned = new Map();
  const spawn = (key) => {
    const ch = createCharacter(key);
    const spot = CHARACTER_SPOTS[key] || { x: 0, y: 0, z: 1.5, rotY: Math.PI };
    ch.position.set(spot.x, spot.y ?? 0, spot.z);
    ch.rotation.y = spot.rotY ?? 0;
    state.scene.add(ch);
    spawned.set(key, ch);
    log(`Spawned ${ch.userData.config?.name || key}.`);
  };
  const despawn = (key) => {
    const ch = spawned.get(key);
    if (ch) {
      state.scene.remove(ch);
      spawned.delete(key);
    }
  };
  const toggleSpawn = (key) => {
    if (spawned.has(key)) {
      despawn(key);
      log(`Despawned ${key}.`);
    } else {
      spawn(key);
    }
  };

  const consoleLines = () => document.getElementById('console-lines');
  const log = (msg) => {
    state.events.push({ t: performance.now(), msg });
    const el = consoleLines();
    if (!el) return;
    const line = document.createElement('div');
    line.className = 'console-line';
    line.textContent = msg;
    el.prepend(line);
    while (el.children.length > 8) el.removeChild(el.lastChild);
  };

  const doTransition = (toWorld, label) => {
    if (state.camera) transitionDollyZoom({ camera: state.camera, onTick: () => {} });
    createGlitchCut();
    const hum = spawnElevatorHum({ scene: state.scene });
    state.severMode = toWorld;
    log(
      `${label}: → ${toWorld.charAt(0).toUpperCase() + toWorld.slice(1)} world. ` +
        `DING ${DING_PITCHES[Math.floor(Math.random() * DING_PITCHES.length)]}.`
    );
    setTimeout(hum.remove, 180);
    renderUI();
  };

  const setMode = (mode) => {
    state.mode = mode;
    if (mode === 'story') {
      state.storyIndex = 0;
      advanceStory();
    } else {
      log('General Mode — freeform severed-floor activity. Spawn staff, run transitions, explore.');
    }
    renderUI();
  };

  const advanceStory = () => {
    if (state.mode !== 'story') return;
    const beat = STORY_BEATS[state.storyIndex];
    if (!beat) {
      log('Orientation complete. The floor is yours.');
      renderUI();
      return;
    }
    log(`${String(beat.id).padStart(2, '0')} — ${beat.title}. ${beat.desc}`);
    state.storyIndex += 1;
    renderUI();
  };

  const setCamera = (camera) => {
    state.camera = camera;
  };

  const update = () => {
    if (lighting.update) lighting.update(performance.now() / 1000);
    state.events = state.events.filter((e) => performance.now() - e.t < 6000);
  };

  const renderUI = () => {
    const btnStory = document.getElementById('btn-story');
    const btnGeneral = document.getElementById('btn-general');
    const beats = document.getElementById('story-beats');
    const controls = document.getElementById('controls');
    const count = document.getElementById('beat-count');
    const next = document.getElementById('btn-next-beat');

    btnStory?.classList.toggle('active', state.mode === 'story');
    btnGeneral?.classList.toggle('active', state.mode === 'general');
    controls?.classList.toggle('hidden', state.mode !== 'general');
    document.body.classList.toggle('mode-story', state.mode === 'story');
    document.body.classList.toggle('mode-general', state.mode === 'general');

    if (beats) {
      beats.innerHTML = '';
      STORY_BEATS.forEach((b) => {
        const row = document.createElement('div');
        const done = state.mode === 'story' && b.id < state.storyIndex;
        const current = state.mode === 'story' && b.id === state.storyIndex;
        row.className = `beat${done ? ' done' : ''}${current ? ' current' : ''}`;
        const n = document.createElement('span');
        n.className = 'n';
        n.textContent = done ? '✓' : String(b.id).padStart(2, '0');
        const label = document.createElement('span');
        label.textContent = b.title;
        row.append(n, label);
        beats.appendChild(row);
      });
    }
    if (count) {
      const shown = Math.min(state.storyIndex, STORY_BEATS.length);
      count.textContent = `${String(shown).padStart(2, '0')} / ${String(STORY_BEATS.length).padStart(2, '0')}`;
    }
    if (next) {
      next.hidden = state.mode !== 'story' || state.storyIndex >= STORY_BEATS.length;
      next.textContent = state.storyIndex >= STORY_BEATS.length - 1 ? 'Finish orientation' : 'Continue';
    }
    const label = document.getElementById('world-label');
    if (label) label.textContent = `${state.severMode.toUpperCase()} WORLD · MDR`;
  };

  // manual beat progression
  document.getElementById('btn-next-beat')?.addEventListener('click', () => advanceStory());

  return {
    state,
    setMode,
    advanceStory,
    doTransition,
    setCamera,
    update,
    log,
    renderUI,
    spawn,
    despawn,
    toggleSpawn,
    characterKeys: () => characterKeys(),
  };
}
