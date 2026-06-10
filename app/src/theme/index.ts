export const theme = {
  bg: '#08080F',
  surface: '#111119',
  surfaceRaised: '#1A1A26',
  border: '#252535',

  primary: '#7B6FFF',
  primaryDim: '#2D2860',

  green: '#00D4AA',
  red: '#FF4757',
  yellow: '#FFD166',

  card: {
    travel: '#4ECDC4',
    rewards: '#C77DFF',
    cashback: '#FFD166',
    student: '#74B9FF',
  } as Record<string, string>,

  cardGradient: {
    travel: ['#0D3535', '#081E1E'],
    rewards: ['#230D3A', '#130820'],
    cashback: ['#35300D', '#1E1C08'],
    student: ['#0D2035', '#08121E'],
  } as Record<string, string[]>,

  text: {
    primary: '#FFFFFF',
    secondary: '#9090AA',
    muted: '#454560',
  },

  font: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 38,
  },
};
