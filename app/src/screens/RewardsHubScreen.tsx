import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Card, RedemptionGoal } from '../types';
import cardsData from '../data/cards.json';
import { DonutChart } from '../components/DonutChart';
import { ExpirationAlert } from '../components/ExpirationAlert';

const GOALS: { key: RedemptionGoal; label: string; icon: string; desc: string }[] = [
  { key: 'flights', label: 'Flights', icon: '✈️', desc: 'Transfer to airline partner for up to 2¢/pt value' },
  { key: 'cashback', label: 'Cashback', icon: '💵', desc: 'Request a statement credit from your issuer' },
  { key: 'gift_cards', label: 'Gift Cards', icon: '🎁', desc: 'Redeem through issuer portal at ~1.1–1.3¢/pt' },
];

const REDEMPTION_MULTIPLIERS: Record<RedemptionGoal, Record<string, number>> = {
  flights: { travel: 1.7, rewards: 2.0, cashback: 1.0, student: 1.0 },
  cashback: { travel: 1.0, rewards: 1.0, cashback: 1.0, student: 1.0 },
  gift_cards: { travel: 1.1, rewards: 1.3, cashback: 1.0, student: 1.1 },
};

export function RewardsHubScreen() {
  const insets = useSafeAreaInsets();
  const [goal, setGoal] = useState<RedemptionGoal>('flights');

  const { cards, user } = cardsData;
  const connectedCards = cards.filter((c) => user.connected_cards.includes(c.id)) as Card[];
  const expiringCards = connectedCards.filter((c) => c.expiration.expires);

  const getRedemptionValue = (card: Card) => {
    const mult = REDEMPTION_MULTIPLIERS[goal][card.type] ?? 1.0;
    return card.user_balance.dollar_value * mult;
  };

  const totalRedemptionValue = connectedCards.reduce(
    (sum, c) => sum + getRedemptionValue(c),
    0
  );

  const bestCard = [...connectedCards]
    .sort((a, b) => getRedemptionValue(b) - getRedemptionValue(a))[0];

  const currentGoal = GOALS.find((g) => g.key === goal)!;

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Rewards Hub</Text>
        <Text style={styles.subtitle}>Everything you've earned, unified</Text>
      </View>

      {/* Total Card with Donut */}
      <View style={styles.totalCard}>
        <View style={styles.totalLeft}>
          <Text style={styles.totalLabel}>Total Value</Text>
          <Text style={styles.totalValue}>${user.total_rewards_value.toFixed(2)}</Text>
          <Text style={styles.totalSub}>{connectedCards.length} cards</Text>
          <View style={styles.legend}>
            {connectedCards.map((card) => {
              const accent = theme.card[card.type] ?? theme.primary;
              return (
                <View key={card.id} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: accent }]} />
                  <Text style={styles.legendText} numberOfLines={1}>
                    {card.name.split(' ')[0]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        <DonutChart cards={connectedCards} size={130} />
      </View>

      {/* Expiration Alerts */}
      {expiringCards.length > 0 && (
        <View style={styles.section}>
          <View style={styles.alertHeader}>
            <Text style={styles.sectionTitle}>Expiring Soon</Text>
            <View style={styles.alertCount}>
              <Text style={styles.alertCountText}>{expiringCards.length}</Text>
            </View>
          </View>
          {expiringCards.map((card) => (
            <ExpirationAlert key={card.id} card={card} />
          ))}
        </View>
      )}

      {/* By Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>By Card</Text>
        {[...connectedCards]
          .sort((a, b) => b.user_balance.dollar_value - a.user_balance.dollar_value)
          .map((card) => {
            const accent = theme.card[card.type] ?? theme.primary;
            const pct = card.user_balance.dollar_value / user.total_rewards_value;
            return (
              <View key={card.id} style={styles.cardRow}>
                <View style={[styles.cardDot, { backgroundColor: accent }]} />
                <View style={styles.cardRowInfo}>
                  <View style={styles.cardRowTop}>
                    <Text style={styles.cardRowName} numberOfLines={1}>
                      {card.name}
                    </Text>
                    <Text style={styles.cardRowValue}>
                      ${card.user_balance.dollar_value.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.barBg}>
                    <View
                      style={[
                        styles.bar,
                        { width: `${pct * 100}%`, backgroundColor: accent },
                      ]}
                    />
                  </View>
                  <Text style={styles.cardRowPts}>
                    {card.user_balance.points.toLocaleString()} {card.rewards_currency}
                  </Text>
                </View>
              </View>
            );
          })}
      </View>

      {/* Redemption */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Redeem For</Text>
        <View style={styles.goalRow}>
          {GOALS.map((g) => (
            <TouchableOpacity
              key={g.key}
              style={[styles.goalPill, goal === g.key && styles.goalPillActive]}
              onPress={() => setGoal(g.key)}
            >
              <Text style={styles.goalIcon}>{g.icon}</Text>
              <Text style={[styles.goalLabel, goal === g.key && styles.goalLabelActive]}>
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <LinearGradient colors={['#1A1535', '#0D0C1E']} style={styles.redeemCard}>
          <Text style={styles.redeemEyebrow}>Best redemption for {currentGoal.label.toLowerCase()}</Text>
          <Text style={styles.redeemValue}>${totalRedemptionValue.toFixed(2)}</Text>
          <View style={styles.redeemBestRow}>
            <Text style={styles.redeemBestLabel}>Use</Text>
            <View style={[styles.redeemBestBadge, { borderColor: (theme.card[bestCard?.type] ?? theme.primary) + '55' }]}>
              <Text style={[styles.redeemBestName, { color: theme.card[bestCard?.type] ?? theme.primary }]}>
                {bestCard?.name}
              </Text>
            </View>
          </View>
          <Text style={styles.redeemDesc}>{currentGoal.desc}</Text>
        </LinearGradient>
      </View>

      <View style={{ height: 110 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  title: {
    fontSize: theme.font['2xl'],
    fontWeight: '800',
    color: theme.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.font.sm,
    color: theme.text.secondary,
    marginTop: 2,
  },
  totalCard: {
    marginHorizontal: 20,
    backgroundColor: theme.surfaceRaised,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 28,
  },
  totalLeft: {
    flex: 1,
    marginRight: 12,
  },
  totalLabel: {
    fontSize: theme.font.xs,
    color: theme.text.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: theme.font['4xl'],
    fontWeight: '800',
    color: theme.text.primary,
    letterSpacing: -1.5,
    marginTop: 4,
    marginBottom: 4,
  },
  totalSub: {
    fontSize: theme.font.sm,
    color: theme.text.muted,
    marginBottom: 12,
  },
  legend: {
    gap: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: theme.text.muted,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: theme.font.lg,
    fontWeight: '700',
    color: theme.text.primary,
    marginBottom: 14,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  alertCount: {
    backgroundColor: theme.red,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  alertCountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
    alignItems: 'flex-start',
  },
  cardDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 3,
  },
  cardRowInfo: {
    flex: 1,
    gap: 5,
  },
  cardRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardRowName: {
    fontSize: theme.font.sm,
    color: theme.text.secondary,
    fontWeight: '500',
    flex: 1,
  },
  cardRowValue: {
    fontSize: theme.font.sm,
    color: theme.text.primary,
    fontWeight: '700',
  },
  barBg: {
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  bar: {
    height: 4,
    borderRadius: 2,
  },
  cardRowPts: {
    fontSize: theme.font.xs,
    color: theme.text.muted,
  },
  goalRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  goalPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    gap: 4,
  },
  goalPillActive: {
    backgroundColor: theme.primaryDim,
    borderColor: theme.primary + '88',
  },
  goalIcon: {
    fontSize: 20,
  },
  goalLabel: {
    fontSize: theme.font.xs,
    color: theme.text.secondary,
    fontWeight: '600',
  },
  goalLabelActive: {
    color: theme.primary,
  },
  redeemCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2550',
  },
  redeemEyebrow: {
    fontSize: theme.font.xs,
    color: theme.text.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  redeemValue: {
    fontSize: theme.font['3xl'],
    fontWeight: '800',
    color: theme.green,
    letterSpacing: -1,
    marginBottom: 10,
  },
  redeemBestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  redeemBestLabel: {
    fontSize: theme.font.sm,
    color: theme.text.secondary,
  },
  redeemBestBadge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  redeemBestName: {
    fontSize: theme.font.sm,
    fontWeight: '700',
  },
  redeemDesc: {
    fontSize: theme.font.sm,
    color: theme.text.secondary,
    lineHeight: 20,
  },
});
