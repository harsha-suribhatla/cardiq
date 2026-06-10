import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Card } from '../types';

interface Props {
  card: Card;
}

export function ExpirationAlert({ card }: Props) {
  const months = card.expiration.months_until_expiry ?? 0;
  const isUrgent = months <= 2;

  return (
    <View style={[styles.container, isUrgent && styles.urgent]}>
      <Text style={styles.icon}>{isUrgent ? '🔴' : '🟡'}</Text>
      <View style={styles.content}>
        <Text style={styles.cardName}>{card.name}</Text>
        <Text style={styles.message}>
          ${card.user_balance.dollar_value.toFixed(2)} expires in {months} month{months !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.note}>{card.expiration.note}</Text>
      </View>
      <View style={[styles.countdown, { borderColor: isUrgent ? theme.red + '55' : theme.yellow + '55' }]}>
        <Text style={[styles.countdownNum, { color: isUrgent ? theme.red : theme.yellow }]}>
          {months}
        </Text>
        <Text style={[styles.countdownUnit, { color: isUrgent ? theme.red : theme.yellow }]}>mo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.surfaceRaised,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  urgent: {
    borderColor: theme.red + '44',
    backgroundColor: theme.red + '0D',
  },
  icon: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  cardName: {
    fontSize: theme.font.sm,
    fontWeight: '700',
    color: theme.text.primary,
  },
  message: {
    fontSize: theme.font.sm,
    color: theme.text.secondary,
  },
  note: {
    fontSize: theme.font.xs,
    color: theme.text.muted,
  },
  countdown: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countdownNum: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 22,
  },
  countdownUnit: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
  },
});
