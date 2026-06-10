import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';
import { Card } from '../types';

const CARD_WIDTH = 200;

interface Props {
  card: Card;
}

export function CardTile({ card }: Props) {
  const accent = theme.card[card.type] ?? theme.primary;
  const gradient = (theme.cardGradient[card.type] ?? ['#1A1A26', '#111119']) as [string, string];
  const isExpiringSoon =
    card.expiration.expires &&
    card.expiration.months_until_expiry !== undefined &&
    card.expiration.months_until_expiry <= 3;

  return (
    <LinearGradient colors={gradient} style={styles.card}>
      <View style={[styles.accentBar, { backgroundColor: accent }]} />

      <View style={styles.topRow}>
        <View style={styles.topLeft}>
          <Text style={styles.issuer} numberOfLines={1}>{card.issuer}</Text>
          <Text style={styles.name} numberOfLines={1}>{card.name}</Text>
        </View>
        <View style={[styles.networkBadge, { borderColor: accent + '55' }]}>
          <Text style={[styles.networkText, { color: accent }]}>{card.network}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View>
        <Text style={styles.balanceLabel}>{card.rewards_currency}</Text>
        <Text style={styles.balanceValue}>${card.user_balance.dollar_value.toFixed(2)}</Text>
        <Text style={styles.balancePts}>{card.user_balance.points.toLocaleString()} pts</Text>
      </View>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.statLabel}>APR</Text>
          <Text style={styles.statValue}>{card.apr}%</Text>
        </View>
        <View>
          <Text style={styles.statLabel}>Ann. Fee</Text>
          <Text style={styles.statValue}>
            {card.annual_fee === 0 ? 'None' : `$${card.annual_fee}`}
          </Text>
        </View>
      </View>

      {isExpiringSoon && (
        <View style={styles.expiryBadge}>
          <Text style={styles.expiryText}>⚠ {card.expiration.months_until_expiry}mo</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A3E',
    overflow: 'hidden',
    position: 'relative',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 12,
  },
  topLeft: {
    flex: 1,
    marginRight: 8,
  },
  issuer: {
    fontSize: 10,
    color: theme.text.muted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 13,
    color: theme.text.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  networkBadge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  networkText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A3E',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 10,
    color: theme.text.muted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceValue: {
    fontSize: 26,
    color: theme.text.primary,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  balancePts: {
    fontSize: 11,
    color: theme.text.secondary,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
  },
  statLabel: {
    fontSize: 10,
    color: theme.text.muted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 13,
    color: theme.text.secondary,
    fontWeight: '600',
    marginTop: 1,
  },
  expiryBadge: {
    position: 'absolute',
    top: 12,
    right: 10,
    backgroundColor: '#FF475718',
    borderColor: theme.red,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  expiryText: {
    fontSize: 10,
    color: theme.red,
    fontWeight: '700',
  },
});
