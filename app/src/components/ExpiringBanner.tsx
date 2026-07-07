import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface ExpiringBannerProps {
  dollarValue: number;
  cardName: string;
  monthsLeft: number;
  onDismiss: () => void;
  onTapAgent: () => void;
}

export default function ExpiringBanner({
  dollarValue,
  cardName,
  monthsLeft,
  onDismiss,
  onTapAgent,
}: ExpiringBannerProps) {
  const isUrgent = monthsLeft <= 2;
  const accentColor = isUrgent ? Colors.danger : Colors.warning;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: accentColor + '18',
          borderColor: accentColor + '44',
        },
      ]}
      onPress={onTapAgent}
      activeOpacity={0.85}
    >
      <Ionicons
        name={isUrgent ? 'warning' : 'alert-circle-outline'}
        size={18}
        color={accentColor}
      />
      <Text style={[styles.text, { color: accentColor }]}>
        Your <Text style={styles.bold}>{cardName}</Text> has{' '}
        <Text style={styles.bold}>${dollarValue.toFixed(2)}</Text> expiring in{' '}
        {monthsLeft} month{monthsLeft !== 1 ? 's' : ''} — tap to take action
      </Text>
      <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="close" size={16} color={accentColor} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 0,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    gap: 10,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
  },
});
