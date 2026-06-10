import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../theme';
import { Card } from '../types';

interface Props {
  cards: Card[];
  size?: number;
}

const GAP = 3;

export function DonutChart({ cards, size = 110 }: Props) {
  const RADIUS = 42;
  const STROKE = 11;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * RADIUS;

  const total = cards.reduce((sum, c) => sum + c.user_balance.dollar_value, 0);

  let cumulativePct = 0;
  const segments = cards.map((card) => {
    const pct = card.user_balance.dollar_value / total;
    const dashLen = Math.max(0, pct * circumference - GAP);
    const startAngle = cumulativePct * 360 - 90;
    cumulativePct += pct;
    const color = theme.card[card.type] ?? theme.primary;
    return { dashLen, startAngle, color };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={cx}
          cy={cy}
          r={RADIUS}
          fill="none"
          stroke={theme.border}
          strokeWidth={STROKE}
        />
        {segments.map((seg, i) => (
          <Circle
            key={i}
            cx={cx}
            cy={cy}
            r={RADIUS}
            fill="none"
            stroke={seg.color}
            strokeWidth={STROKE}
            strokeDasharray={`${seg.dashLen} ${circumference}`}
            transform={`rotate(${seg.startAngle}, ${cx}, ${cy})`}
            strokeLinecap="butt"
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
