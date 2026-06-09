import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface Segment {
  value: number;
  color: string;
}

interface Props {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
}

export default function DonutChart({ segments, size = 160, strokeWidth = 20 }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return <View style={{ width: size, height: size }} />;

  let cumulativeAngle = -90; // start at top

  const arcs = segments.map((seg) => {
    const pct = seg.value / total;
    const angle = pct * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;

    // strokeDasharray trick: offset by accumulated percentage
    const dashOffset = circumference * (1 - pct);
    const startPct = (startAngle + 90) / 360; // convert to 0-1

    return {
      color: seg.color,
      strokeDasharray: `${circumference * pct} ${circumference * (1 - pct)}`,
      strokeDashoffset: circumference * (1 - startPct),
      dashOffset,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${cx}, ${cy}`}>
          {/* Background ring */}
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#2A2A38"
            strokeWidth={strokeWidth}
          />
          {arcs.map((arc, i) => (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={arc.strokeDasharray}
              strokeDashoffset={arc.strokeDashoffset}
              strokeLinecap="butt"
            />
          ))}
        </G>
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
