
// // // tutorialManager.js
// // // Simple singleton store (no context/provider wiring needed — works anywhere).
// // // Shows coach-mark tutorial once on first login/register, skippable anytime.

// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { useEffect, useState } from 'react';

// // const STORAGE_KEY = 'tutorialSeen';

// // // A single flat, ordered sequence across ALL screens. Order here is the order
// // // the tour plays in, full stop — including steps whose TutorialSpot lives in a
// // // component (like the bottom tab bar) that stays mounted across every screen.
// // // This is what makes e.g. "moretab" (rendered globally, in BottomTab) wait
// // // until PLAYGAME's steps are done, instead of firing the moment Home's own
// // // play/practice/playtab steps finish, regardless of what screen is visible.
// // export const TUTORIAL_FLOW = [
// //   { screen: 'HOME', key: 'play', text: 'Play to compete against others' },
// //   { screen: 'HOME', key: 'practice', text: 'Practice solo to chase your high score' },
// //   { screen: 'HOME', key: 'playtab', text: 'Or jump straight into a match from the Play tab' },
// //   { screen: 'PLAYGAME', key: 'difficulty', text: 'Pick your challenge' },
// //   { screen: 'PLAYGAME', key: 'timer', text: 'Choose your match length' },
// //   { screen: 'PLAYGAME', key: 'symbols', text: 'More symbols, tougher maths' },
// //   { screen: 'PLAYGAME', key: 'vs', text: 'Face a random player, a friend or the computer' },
// //   { screen: 'HOME', key: 'moretab', text: 'Tap More for profile, stats, achievements & theme' },
// //   // moretab's "Next" navigates straight to the More screen, so theme must come
// //   // right after it. SELECTOPPONENT:options is a separate, optional branch —
// //   // only reached if the user manually taps the VS dropdown — so it's placed
// //   // last, where it can't block theme (or anything else) from ever becoming
// //   // eligible just because that screen was never visited.
// //   { screen: 'MORE', key: 'theme', text: 'Click to select your looks and numpad' },
// //   { screen: 'SELECTOPPONENT', key: 'options', text: 'Choose your opponent' },
// // ];

// // // Kept in the old per-screen shape too, in case anything (or future code)
// // // still wants "all steps for screen X" without caring about global order.
// // export const TUTORIAL_STEPS = TUTORIAL_FLOW.reduce((acc, s) => {
// //   (acc[s.screen] = acc[s.screen] || []).push({ key: s.key, text: s.text });
// //   return acc;
// // }, {});

// // const ALL_KEYS = TUTORIAL_FLOW.map((s) => `${s.screen}:${s.key}`);

// // let state = {
// //   active: false,
// //   completed: new Set(),
// // };

// // let listeners = [];
// // const notify = () => listeners.forEach((l) => l());

// // // Load "seen" flag once at module init — active only if never seen before.
// // (async () => {
// //   try {
// //     const seen = await AsyncStorage.getItem(STORAGE_KEY);
// //     state.active = seen !== 'true';
// //   } catch (e) {
// //     state.active = false;
// //   }
// //   notify();
// // })();

// // const finishIfDone = () => {
// //   if (ALL_KEYS.every((k) => state.completed.has(k))) {
// //     state.active = false;
// //     AsyncStorage.setItem(STORAGE_KEY, 'true').catch(() => {});
// //   }
// // };

// // export const tutorialManager = {
// //   subscribe(cb) {
// //     listeners.push(cb);
// //     return () => {
// //       listeners = listeners.filter((l) => l !== cb);
// //     };
// //   },
// //   markStepDone(screen, key) {
// //     if (!state.active) return;
// //     state.completed = new Set(state.completed).add(`${screen}:${key}`);
// //     finishIfDone();
// //     notify();
// //   },
// //   skip() {
// //     state.active = false;
// //     AsyncStorage.setItem(STORAGE_KEY, 'true').catch(() => {});
// //     notify();
// //   },
// //   // For QA/dev use — re-trigger tutorial from a settings/debug button if ever needed.
// //   reset() {
// //     state.completed = new Set();
// //     state.active = true;
// //     AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
// //     notify();
// //   },
// //   getPendingStep(screenKey) {
// //     if (!state.active) return null;
// //     // The next step overall, across every screen — not just this one.
// //     const nextGlobal = TUTORIAL_FLOW.find((s) => !state.completed.has(`${s.screen}:${s.key}`));
// //     if (!nextGlobal) return null;
// //     // Only surface it to the screen it actually belongs to. This is what stops
// //     // a step like "moretab" (screen: HOME) from lighting up while the user is
// //     // still mid-way through PLAYGAME's steps, even though the "More" tab icon
// //     // is physically visible on the PlayGame screen too.
// //     if (nextGlobal.screen !== screenKey) return null;
// //     return nextGlobal;
// //   },
// //   getGlobalProgress() {
// //     return { current: Math.min(state.completed.size + 1, ALL_KEYS.length), total: ALL_KEYS.length };
// //   },
// // };

// // // Re-renders the calling component whenever tutorial state changes,
// // // returns the current pending step for screenKey (or null if none/inactive).
// // export const useTutorialStep = (screenKey) => {
// //   const [, forceRender] = useState(0);
// //   useEffect(() => tutorialManager.subscribe(() => forceRender((x) => x + 1)), []);
// //   return tutorialManager.getPendingStep(screenKey);
// // };


// // tutorialManager.js
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useEffect, useState } from 'react';

// const STORAGE_KEY = 'tutorialSeen';

// // Flat ordered flow. `targets` = registry ids that must ALL be mounted/measured
// // together for this step's spotlight — this is what lets one step highlight
// // elements living in totally different component trees at once (e.g. Home's
// // Play button + BottomTab's persistent Play-tab icon).
// // `navigateTo` (optional) = tab route name to jump to on "Next", so the NEXT
// // step's target(s) actually get a chance to mount.
// // export const TUTORIAL_FLOW = [
// //   { key: 'practice', text: 'Practice solo to chase your high score', targets: ['home:practice'] },
// //   {
// //     key: 'playAndTab',
// //     text: 'Play to compete against others — or jump in anytime from the Play tab below',
// //     targets: ['home:play', 'tabbar:playtab'],
// //   },
// //   { key: 'difficulty', text: 'Pick your challenge', targets: ['playgame:difficulty'], navigateTo: 'Play' },
// //   { key: 'timer', text: 'Choose your match length', targets: ['playgame:timer'] },
// //   { key: 'symbols', text: 'More symbols, tougher maths', targets: ['playgame:symbols'] },
// //   { key: 'vs', text: 'Face a random player, a friend or the computer', targets: ['playgame:vs'] },
// //   {
// //     key: 'moretab',
// //     text: 'Tap More for profile, stats, achievements & theme',
// //     targets: ['tabbar:more'],
// //     navigateTo: 'More',
// //   },
// //   { key: 'theme', text: 'Click to select your looks and numpad', targets: ['more:theme'] },
// //   { key: 'options', text: 'Choose your opponent', targets: ['selectopponent:options'] },
// // ];


// export const TUTORIAL_FLOW = [
//   { key: 'practice', text: 'Practice solo to chase your high score', targets: ['home:practice'] },
//   {
//     key: 'playAndTab',
//     text: 'Play to compete against others — or jump in anytime from the Play tab below',
//     targets: ['home:play', 'tabbar:playtab'],
//   },
//   {
//     key: 'gameSettings',
//     text: 'Pick your difficulty, match length, symbols and opponent here',
//     targets: ['playgame:timerText', 'playgame:symbolText', 'playgame:vsText'],
//     navigateTo: 'Play',
//   },
//   {
//     key: 'moretab',
//     text: 'Tap More for profile, stats, achievements & theme',
//     targets: ['tabbar:more'],
//     navigateTo: 'More',
//   },
//   { key: 'theme', text: 'Click to select your looks and numpad', targets: ['more:theme'] },
//   { key: 'options', text: 'Choose your opponent', targets: ['selectopponent:options'] },
// ];
// const ALL_KEYS = TUTORIAL_FLOW.map((s) => s.key);

// let state = { active: false, completed: new Set() };
// let listeners = [];
// const notify = () => listeners.forEach((l) => l());

// (async () => {
//   try {
//     const seen = await AsyncStorage.getItem(STORAGE_KEY);
//     state.active = seen !== 'true';
//   } catch (e) {
//     state.active = false;
//   }
//   notify();
// })();

// const finishIfDone = () => {
//   if (ALL_KEYS.every((k) => state.completed.has(k))) {
//     state.active = false;
//     AsyncStorage.setItem(STORAGE_KEY, 'true').catch(() => {});
//   }
// };

// export const tutorialManager = {
//   subscribe(cb) {
//     listeners.push(cb);
//     return () => {
//       listeners = listeners.filter((l) => l !== cb);
//     };
//   },
//   markStepDone(key) {
//     if (!state.active) return;
//     state.completed = new Set(state.completed).add(key);
//     finishIfDone();
//     notify();
//   },
//   skip() {
//     state.active = false;
//     AsyncStorage.setItem(STORAGE_KEY, 'true').catch(() => {});
//     notify();
//   },
//   reset() {
//     state.completed = new Set();
//     state.active = true;
//     AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
//     notify();
//   },
//   getPendingStep() {
//     if (!state.active) return null;
//     return TUTORIAL_FLOW.find((s) => !state.completed.has(s.key)) || null;
//   },
//   isLastStep(key) {
//     return TUTORIAL_FLOW[TUTORIAL_FLOW.length - 1]?.key === key;
//   },
//   getGlobalProgress() {
//     return { current: Math.min(state.completed.size + 1, ALL_KEYS.length), total: ALL_KEYS.length };
//   },
// };

// export const useTutorialPendingStep = () => {
//   const [, forceRender] = useState(0);
//   useEffect(() => tutorialManager.subscribe(() => forceRender((x) => x + 1)), []);
//   return tutorialManager.getPendingStep();
// };

// // ── Target registry ─────────────────────────────────────────────────────
// // Any mounted TutorialTarget registers a measure() fn under its id. The
// // single global TutorialOverlay looks these up by id — this is what makes
// // cross-component spotlighting possible (a screen's button + the always-
// // mounted bottom tab bar, at the same time).
// let targetRegistry = {};
// let targetListeners = [];
// const notifyTargets = () => targetListeners.forEach((l) => l());

// export const registerTarget = (id, measureFn) => {
//   targetRegistry[id] = measureFn;
//   notifyTargets();
// };
// export const unregisterTarget = (id) => {
//   delete targetRegistry[id];
//   notifyTargets();
// };
// export const getTarget = (id) => targetRegistry[id];
// export const subscribeTargets = (cb) => {
//   targetListeners.push(cb);
//   return () => {
//     targetListeners = targetListeners.filter((l) => l !== cb);
//   };
// };


import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'mathetics_tutorial_seen';

export const TUTORIAL_FLOW = [
  { key: 'practice', text: 'Practice solo to chase your high score', targets: ['home:practice'] },
  {
    key: 'playAndTab',
    text: 'Play to compete against others — or jump in anytime from the Play tab below',
    targets: ['home:play', 'tabbar:playtab'],
  },
  {
    key: 'gameSettings',
    text: 'Pick your difficulty, match length, symbols and opponent here',
    targets: [
      'playgame:difficultyText',
      'playgame:timerText',
      'playgame:symbolText',
      'playgame:vsText',
    ],
    navigateTo: 'Play',
  },
  {
    key: 'moretab',
    text: 'Tap More for profile, stats, achievements & theme',
    targets: ['tabbar:more'],
    navigateTo: 'More',
  },
  { key: 'theme', text: 'Click to select your looks and numpad', targets: ['more:theme'] },
  { key: 'options', text: 'Choose your opponent', targets: ['selectopponent:options'] },
];
const ALL_KEYS = TUTORIAL_FLOW.map((s) => s.key);

let state = { active: false, completed: new Set() };
let listeners = [];
const notify = () => listeners.forEach((l) => l());

(async () => {
  try {
    const seen = await AsyncStorage.getItem(STORAGE_KEY);
    state.active = seen !== 'true';
  } catch (e) {
    state.active = false;
  }
  notify();
})();

const finishIfDone = () => {
  if (ALL_KEYS.every((k) => state.completed.has(k))) {
    state.active = false;
    AsyncStorage.setItem(STORAGE_KEY, 'true').catch(() => {});
  }
};

export const tutorialManager = {
  subscribe(cb) {
    listeners.push(cb);
    return () => {
      listeners = listeners.filter((l) => l !== cb);
    };
  },
  markStepDone(key) {
    if (!state.active) return;
    state.completed = new Set(state.completed).add(key);
    finishIfDone();
    notify();
  },
  skip() {
    state.active = false;
    AsyncStorage.setItem(STORAGE_KEY, 'true').catch(() => {});
    notify();
  },
  reset() {
    state.completed = new Set();
    state.active = true;
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    notify();
  },
  getPendingStep() {
    if (!state.active) return null;
    return TUTORIAL_FLOW.find((s) => !state.completed.has(s.key)) || null;
  },
  isLastStep(key) {
    return TUTORIAL_FLOW[TUTORIAL_FLOW.length - 1]?.key === key;
  },
  getGlobalProgress() {
    return { current: Math.min(state.completed.size + 1, ALL_KEYS.length), total: ALL_KEYS.length };
  },
};

export const useTutorialPendingStep = () => {
  const [, forceRender] = useState(0);
  useEffect(() => tutorialManager.subscribe(() => forceRender((x) => x + 1)), []);
  return tutorialManager.getPendingStep();
};

// ── Target registry ─────────────────────────────────────────────────────
// Any mounted TutorialTarget registers a measure() fn under its id. The
// single global TutorialOverlay looks these up by id — this is what makes
// cross-component spotlighting possible (a screen's button + the always-
// mounted bottom tab bar, at the same time).
let targetRegistry = {};
let targetListeners = [];
const notifyTargets = () => targetListeners.forEach((l) => l());

export const registerTarget = (id, measureFn) => {
  targetRegistry[id] = measureFn;
  notifyTargets();
};
export const unregisterTarget = (id) => {
  delete targetRegistry[id];
  notifyTargets();
};
export const getTarget = (id) => targetRegistry[id];
export const subscribeTargets = (cb) => {
  targetListeners.push(cb);
  return () => {
    targetListeners = targetListeners.filter((l) => l !== cb);
  };
};