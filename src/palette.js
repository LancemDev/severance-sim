// Palette & color story for Severance, from verified sources (AD "Blue and Red"
// color story, DesignObserver "Innies see red, Innies wear blue").
export const palette = {
  // --- Innie (Severed) floor: near-white "pure white" feel.
  // AD measured ~50 whites on a projector before settling; values approximate.
  severeWhite: '#F3F5F7',
  severeWhiteAlt: '#E8E9E1',

  // --- White surroundings (corridors, cubicle walls in some rooms)
  corridorWhite: '#E9EAEF',

  // --- Green & blue story on the severance floor
  // Verified: forest and emerald greens run the carpets/cubicle walls; MDR rug is kelly green.
  wallGreen: '#7FB565',
  forest: '#3E6950',
  emerald: '#2B937C',
  indigo: '#1A3A5C',
  cobalt: '#1A4E7C',
  royal: '#4A6F8A',

  // --- Warm "red world" accents (Innie/Outie story). Verified to exist,
  // plus DesignObserver calls red the color of liberation/love/rebellion.
  redAccent: '#D92C26',
  offWhite: '#F6EBE5',
  paleYellow: '#E8DCC9', // pop color seen on Dylan/Helly (approx)

  // --- Outie (Personal) world: warm tones, warm shadows (AD Ben & Aja Blanc lighting style)
  outieTan: '#E2D1C3',

  // --- Testing Floor: hospital green
  testingGreen: '#B9DCCB',

  // --- Alerts: red-ish (season 2 style)
  alertRed: '#E53935',
};

export const mdrTeamPalette = {
  // Verified-ish palettes used in the show (via DesignObserver & AD screenshots).
  // Innies: blue uniform top + blue skirt, but pops of pale yellow.
  markSuit: { top: palette.cobalt, skirt: palette.cobalt, tie: palette.redAccent },
  hellySuit: { top: palette.royal, skirt: palette.royal, hair: palette.paleYellow },
  irvingSuit: { top: palette.indigo, skirt: palette.indigo },
  waldoSuit: { top: palette.forest, skirt: palette.forest },
  xSuit: { top: palette.emerald, skirt: palette.emerald },
};
