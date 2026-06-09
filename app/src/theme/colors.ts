export const Colors = {
  // Backgrounds
  background: '#0A0A0F',
  surface: '#13131A',
  surface2: '#1C1C26',
  border: '#2A2A38',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#8888AA',

  // Accents
  accentBlue: '#4A6CF7',
  accentPurple: '#8B5CF6',

  // Card type colors
  travel: '#F59E0B',
  cashback: '#10B981',
  rewards: '#8B5CF6',
  student: '#3B82F6',

  // States
  danger: '#EF4444',
  warning: '#F97316',
  success: '#10B981',

  // Overlays
  overlay: 'rgba(0,0,0,0.4)',
  overlayLight: 'rgba(255,255,255,0.05)',
} as const;

export type CardTypeColor = 'travel' | 'cashback' | 'rewards' | 'student';

export function getCardColor(type: string): string {
  switch (type) {
    case 'travel': return Colors.travel;
    case 'cashback': return Colors.cashback;
    case 'rewards': return Colors.rewards;
    case 'student': return Colors.student;
    default: return Colors.accentBlue;
  }
}
