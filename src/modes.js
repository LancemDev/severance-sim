// Two modes:
//  - StoryMode: follows the Severance storyline (real beats from the show: orientation,
//    descend, MDR floor, tasks, transitions, testing floor, etc.)
//  - GeneralMode: freeform severance activities (swap worlds, do transitions, spawn people).
import * as THREE from 'three';
import { createGlitchCut, spawnElevatorHum, transitionDollyZoom, DING_PITCHES } from './transition.js';

export const STORY_BEATS = [
  { id: 1, title: 'Orientation', desc: 'First day: the Orientation Room tour on the Severance floor.' },
  { id: 2, title: 'Work shifts', desc: 'Do your jobs: explore the MDR floor, speak with team members.' },
  { id: 3, title: 'Innies and Outies', desc: 'Learn about the dual-identity structure: work vs personal halves.' },
  { id: 4, title: 'Overtime Contingency Protocol', desc: 'A single beat where Innies play their Outies for ~39 minutes.' },
  { id: 5, title: 'Team dynamics', desc: 'Rebellion or cooperation among MDR members.' },
  { id: 6, title: 'Free play', desc: 'The world is open: wander the Severance floor and explore.' },
];

export function createGame({ scene, world, lighting, floor }) {
  const state = {
    mode: 'story',
    storyIndex: 0,
    severMode: 'severed', // 'severed' | 'outie'
    transitionPending: 0,
    nextBeatAt: performance.now() + 300,
    events: [],
    easterEggs: [],
    world,
    scene,
    floor,
  };

  const log = (msg) => {
    state.events.push({ t: performance.now(), msg });
    const el = document.getElementById('console');
    if (el) {
      const line = document.createElement('div');
      line.className = 'console-line';
      line.textContent = msg;
      el.prepend(line);
      if (el.children.length > 14) el.removeChild(el.lastChild);
    }
  };

  const doTransition = (toWorld, label) => {
    // Verified: dolly zoom + glitch cuts while switching between worlds.
    transitionDollyZoom({ camera: state.camera, onTick: () => {} });
    createGlitchCut();
    const hum = spawnElevatorHum({ scene: state.scene });
    state.severMode = toWorld;
    log(`Transition ${label}: → ${toWorld.charAt(0).toUpperCase() + toWorld.slice(1)} world. (DING ${DING_PITCHES[Math.floor(Math.random() * DING_PITCHES.length)]})`);
    setTimeout(hum.remove, 150);
  };

  const setMode = (mode) => {
    state.mode = mode;
    if (mode === 'story') {
      state.storyIndex = 0;
      state.nextBeatAt = performance.now() + 300;
      advanceStory();
    } else {
      log('General Mode: freeform severance activities (spawn people, transitions, wanders).');
    }
    renderUI();
  };

  const advanceStory = () => {
    if (state.mode !== 'story') return;
    const beat = STORY_BEATS[state.storyIndex];
    if (!beat) { log('Story complete — freeplay your Severance experience!'); return; }
    log(`[Beat ${beat.id}/${STORY_BEATS.length}] ${beat.title} — ${beat.desc}`);
    state.storyIndex += 1;
    if (beat.id === 3) doTransition('severed', 'to the Severed Floor');
    if (beat.id === 5) doTransition('severed', 'through the elevator');
  };

  function setCamera(camera) { state.camera = camera; }

  function update(dt) {
    if (lighting.update) lighting.update(performance.now() / 1000);
    state.events = state.events.filter((e) => performance.now() - e.t < 5000);
    if (state.mode === 'story' && performance.now() >= state.nextBeatAt) {
      state.nextBeatAt = performance.now() + 1500;
      advanceStory();
    }
  }

  function renderUI() {
    const btnStory = document.getElementById('btn-story');
    const btnGeneral = document.getElementById('btn-general');
    const beats = document.getElementById('story-beats');
    const controls = document.getElementById('controls');
    if (btnStory && state.mode === 'story') btnStory.classList.add('active');
    if (btnStory && state.mode !== 'story') btnStory.classList.remove('active');
    if (btnGeneral && state.mode === 'general') btnGeneral.classList.add('active');
    if (btnGeneral && state.mode !== 'general') btnGeneral.classList.remove('active');
    if (controls) controls.classList.toggle('hidden', state.mode !== 'general');
    if (beats) {
      beats.innerHTML = '';
      STORY_BEATS.forEach((b) => {
        const d = document.createElement('div');
        d.className = `beat ${state.mode === 'story' && state.storyIndex >= b.id ? 'done' : ''}`;
        d.textContent = `${b.id}. ${b.title}`;
        beats.appendChild(d);
      });
    }
    const label = document.getElementById('world-label');
    if (label) label.textContent = state.severMode.toUpperCase() + ' world';
  }

  return {
    state,
    setMode,
    advanceStory,
    doTransition,
    setCamera,
    update,
    log,
    renderUI,
  };
}
