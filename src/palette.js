// Palette & colour story for Severance.
// MDR set values sampled from episode frames, with the show's cool grade in mind.
export const palette = {
  // --- Innie (severed) floor: near-white institutional surfaces.
  severeWhite: '#eef2ef',
  severeWhiteAlt: '#f3f6f3',
  corridorWhite: '#e8efea',
  ceilingWhite: '#f1f5f2',

  // --- The MDR carpet and workstation greens (sampled #6fa977 / #294535).
  carpetGreen: '#6fa977',
  wallGreen: '#294535',
  forest: '#2c4a3a',
  emerald: '#2b6b55',
  indigo: '#263e5c',
  cobalt: '#2c4b74',
  royal: '#3d5f88',

  // --- Trim / metal / institutional detail.
  trimDark: '#39474a',
  trimMetal: '#5c6a6c',
  monitorBeige: '#d8d2bf',
  phoneBlue: '#273e5e',
  chairBlack: '#252a2c',

  // --- Warm "outie" accents and story colours.
  redAccent: '#c63a30',
  offWhite: '#f6efe6',
  paleYellow: '#e4d3a4',
  outieTan: '#e2d1c3',

  // --- Testing Floor: hospital green.
  testingGreen: '#b9dccb',
  alertRed: '#e53935',
};

export const mdrTeamPalette = {
  markSuit: { top: palette.cobalt, skirt: palette.indigo, tie: '#4f78a8' },
  hellySuit: { top: palette.wallGreen, skirt: palette.royal, hair: '#a23b2a' },
  irvingSuit: { top: palette.paleYellow, skirt: palette.chairBlack, tie: '#3f5e7a' },
  dylanSuit: { top: palette.severeWhiteAlt, skirt: palette.chairBlack, tie: '#1f2426' },
};
