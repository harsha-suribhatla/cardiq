import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';
import { Card, SpendingCategory } from '../types';

export interface RankedCard {
  card: Card;
  rate: number;
  dollarValue: number;
}

interface Props {
  rankings: RankedCard[];
  category: SpendingCategory;
}

export function SwipeRecommendation({ rankings }: Props) {
  if (!rankings.length) return null;
  const [winner, ...rest] = rankings;
  const accent = theme.card[winner.card.type] ?? theme.primary;
  const gradient = (theme.cardGradient[winner.card.type] ?? ['#1A1535', '#0F0E20']) as [string, string];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradient}
        style={[styles.winner, { borderColor: accent + '44' }]}
      >
        <View style={styles.winnerTop}>
          <View style={[styles.badge, { backgroundColor: accent + '22', borderColor: accent + '44' }]}>
            <Text style={[styles.badgeText, { color: accent }]}>Best Pick</Text>
          </View>
          <Text style={styles.multiplier}>{winner.rate}x</Text>
        </View>
        <Text style={styles.winnerName}>{winner.card.name}</Text>
        <Text style={styles.winnerIssuer}>{winner.card.issuer}</Text>
        <Text style={styles.earningsHint}>
          Earns ~{(winner.dollarValue * 100).toFixed(1)}¢ per $1 spent
        </Text>
      </LinearGradient>

      <Text style={styles.rankLabel}>All cards ranked</Text>
      {rankings.map((item, index) => {
        const cardAccent = theme.card[item.card.type] ?? theme.primary;
        const maxVal = rankings[0].dollarValue;
        const pct = maxVal > 0 ? item.dollarValue / maxVal : 0;
        return (
          <View key={item.card.id} style={styles.rankRow}>
            <Text style={styles.rankNum}>{index + 1}</Text>
            <View style={styles.rankInfo}>
              <Text style={styles.rankName} numberOfLines={1}>{item.card.name}</Text>
              <View style={styles.rankBarBg}>
                <View
                  style={[styles.rankBar, { width: `${pct * 100}%`, backgroundColor: cardAccent }]}
                />
              </View>
            </View>
            <Text style={[styles.rankRate, { color: index === 0 ? cardAccent : theme.text.secondary }]}>
              {item.rate}x
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  winner: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  winnerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  multiplier: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.text.primary,
    letterSpacing: -1,
  },
  winnerName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text.primary,
  },
  winnerIssuer: {
    fontSize: 12,
    color: theme.text.secondary,
    marginTop: 2,
  },
  earningsHint: {
    fontSize: 13,
    color: theme.text.muted,
    marginTop: 10,
  },
  rankLabel: {
    fontSize: 11,
    color: theme.text.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  rankNum: {
    width: 18,
    fontSize: 12,
    color: theme.text.muted,
    fontWeight: '600',
    textAlign: 'center',
  },
  rankInfo: {
    flex: 1,
    gap: 5,
  },
  rankName: {
    fontSize: 13,
    color: theme.text.secondary,
    fontWeight: '500',
  },
  rankBarBg: {
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  rankBar: {
    height: 4,
    borderRadius: 2,
  },
  rankRate: {
    fontSize: 13,
    fontWeight: '700',
    width: 28,
    textAlign: 'right',
  },
});
