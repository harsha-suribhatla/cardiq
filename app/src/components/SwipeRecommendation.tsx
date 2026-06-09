import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, SpendCategory } from '../types';
import { Colors, getCardColor } from '../theme/colors';

interface Props {
  card: Card;
  category: SpendCategory;
  monthlySpend: number;
}

export default function SwipeRecommendation({ card, category, monthlySpend }: Props) {
  const cardColor = getCardColor(card.type);
  const earnRate = card.earning_rates[category] ?? card.earning_rates.everything_else ?? 1;
  const annualEarnings = monthlySpend * 12 * (earnRate / 100) * card.points_to_dollar_rate * 100;
  // annualEarnings = monthlySpend * 12 * earnRate * points_to_dollar_rate

  const estAnnual = monthlySpend * 12 * earnRate * card.points_to_dollar_rate;

  const currencyLabel =
    card.rewards_currency === 'miles'
      ? 'miles/dollar'
      : card.rewards_currency === 'cashback'
      ? '% back'
      : 'pts/dollar';

  return (
    <View style={[styles.container, { borderColor: cardColor + '55' }]}>
      {/* Glow overlay */}
      <View style={[styles.glowOverlay, { backgroundColor: cardColor + '0D' }]} />

      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: cardColor + '22' }]}>
          <Ionicons name="flash" size={18} color={cardColor} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.label}>BEST CARD FOR {category.replace('_', ' ').toUpperCase()}</Text>
          <Text style={styles.cardName}>{card.name}</Text>
        </View>
        <View style={[styles.rateBadge, { backgroundColor: cardColor }]}>
          <Text style={styles.rateText}>{earnRate}x</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{earnRate}x</Text>
          <Text style={styles.statLabel}>{currencyLabel}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>${monthlySpend}</Text>
          <Text style={styles.statLabel}>monthly spend</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: cardColor }]}>
            ${estAnnual.toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>est. annual value</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Ionicons name="information-circle-outline" size={12} color={Colors.textSecondary} />
        <Text style={styles.footerText}>
          Use this card when paying for {category === 'everything_else' ? 'general purchases' : category}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  rateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface2,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 12,
  },
  footerText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
