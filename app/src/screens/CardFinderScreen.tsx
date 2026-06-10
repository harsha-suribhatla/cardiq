import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import cardsData from '../data/cards.json';

interface RecommendedCard {
  id: string;
  name: string;
  issuer: string;
  network: string;
  type: string;
  annual_fee: number;
  apr: number;
  sign_on_bonus_value: number;
  sign_on_requirement: number;
  earning_rates: Record<string, number>;
  perks: string[];
  why: string;
  annual_value_estimate: number;
}

const RECOMMENDED: RecommendedCard[] = [
  {
    id: 'rec_001',
    name: 'Sapphire Reserve',
    issuer: 'Atlas Bank',
    network: 'Visa Infinite',
    type: 'travel',
    annual_fee: 550,
    apr: 22.49,
    sign_on_bonus_value: 750,
    sign_on_requirement: 4000,
    earning_rates: { dining: 3, travel: 10, groceries: 1, gas: 1, everything_else: 1 },
    perks: ['$300 annual travel credit', 'Priority Pass lounge access', '10x on travel portal bookings'],
    why: "You spend $400/mo dining and $200/mo on travel. At 3x dining + 10x travel, you'd net significantly more than your current best — even after the fee.",
    annual_value_estimate: 480,
  },
  {
    id: 'rec_002',
    name: 'Blue Cash Preferred',
    issuer: 'Harbor Financial',
    network: 'Amex',
    type: 'cashback',
    annual_fee: 95,
    apr: 16.99,
    sign_on_bonus_value: 250,
    sign_on_requirement: 3000,
    earning_rates: { groceries: 6, streaming: 6, dining: 3, gas: 3, everything_else: 1 },
    perks: ['6% at US supermarkets (up to $6k/yr)', '6% on select streaming', '3% on gas'],
    why: "Your $300/mo grocery spend earns 6% here — that's $216/yr just from groceries, beating your current 4x max by a wide margin.",
    annual_value_estimate: 263,
  },
  {
    id: 'rec_003',
    name: 'Freedom Unlimited',
    issuer: 'Meridian Bank',
    network: 'Visa',
    type: 'cashback',
    annual_fee: 0,
    apr: 17.24,
    sign_on_bonus_value: 200,
    sign_on_requirement: 500,
    earning_rates: { dining: 3, drugstores: 3, travel: 5, everything_else: 1.5 },
    perks: ['No annual fee', '3% on dining & drugstores', '5% on travel portal', '1.5% unlimited catch-all'],
    why: "Better base rate (1.5%) than your 2% flat card AND 3x dining, with zero annual fee. Perfect catch-all upgrade.",
    annual_value_estimate: 189,
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  dining: '🍽',
  groceries: '🛒',
  travel: '✈️',
  gas: '⛽',
  everything_else: '💳',
  streaming: '📺',
};

export function CardFinderScreen() {
  const insets = useSafeAreaInsets();
  const { user } = cardsData;

  const spendEntries = Object.entries(user.spending_profile.monthly_spend).sort(
    ([, a], [, b]) => b - a
  );
  const totalMonthly = spendEntries.reduce((s, [, v]) => s + v, 0);

  const sorted = [...RECOMMENDED].sort((a, b) => b.annual_value_estimate - a.annual_value_estimate);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Card Finder</Text>
        <Text style={styles.subtitle}>Cards ranked purely on your value</Text>
      </View>

      {/* Spending profile */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Spending Profile</Text>
        <Text style={styles.sectionSub}>
          ${totalMonthly.toLocaleString()}/mo across {spendEntries.length} categories
        </Text>
        {spendEntries.map(([cat, amount]) => {
          const pct = amount / totalMonthly;
          return (
            <View key={cat} style={styles.spendRow}>
              <Text style={styles.spendIcon}>{CATEGORY_ICONS[cat] ?? '💳'}</Text>
              <View style={styles.spendInfo}>
                <View style={styles.spendTop}>
                  <Text style={styles.spendCat}>{cat.replace('_', ' ')}</Text>
                  <Text style={styles.spendAmt}>${amount}/mo</Text>
                </View>
                <View style={styles.spendBarBg}>
                  <View
                    style={[styles.spendBar, { width: `${pct * 100}%` }]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        <Text style={styles.sectionSub}>Issuer-agnostic · Ranked by annual value to you</Text>
        {sorted.map((card, index) => {
          const accent = theme.card[card.type] ?? theme.primary;
          const maxRate = Math.max(...Object.values(card.earning_rates));
          return (
            <View key={card.id} style={styles.recCard}>
              <View style={[styles.accentBar, { backgroundColor: accent }]} />

              <View style={styles.recHeader}>
                <View style={styles.recHeaderLeft}>
                  <Text style={styles.recRank}>#{index + 1}</Text>
                  <Text style={styles.recName}>{card.name}</Text>
                  <Text style={styles.recMeta}>
                    {card.issuer} · {card.network}
                  </Text>
                </View>
                <View style={styles.recValueBlock}>
                  <Text style={styles.recValueLabel}>est. value</Text>
                  <Text style={[styles.recValue, { color: accent }]}>
                    +${card.annual_value_estimate}
                  </Text>
                  <Text style={styles.recValueUnit}>/year</Text>
                </View>
              </View>

              {card.sign_on_bonus_value > 0 && (
                <View
                  style={[
                    styles.bonusBanner,
                    { borderColor: accent + '44', backgroundColor: accent + '0F' },
                  ]}
                >
                  <Text style={[styles.bonusText, { color: accent }]}>
                    🎁 ${card.sign_on_bonus_value} bonus — spend ${card.sign_on_requirement} to unlock
                  </Text>
                </View>
              )}

              <Text style={styles.whyText}>{card.why}</Text>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Annual Fee</Text>
                  <Text style={styles.statValue}>
                    {card.annual_fee === 0 ? 'None' : `$${card.annual_fee}`}
                  </Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>APR</Text>
                  <Text style={styles.statValue}>{card.apr}%</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Best Rate</Text>
                  <Text style={[styles.statValue, { color: accent }]}>{maxRate}x</Text>
                </View>
              </View>

              <View style={styles.perks}>
                {card.perks.map((perk, i) => (
                  <View key={i} style={styles.perkRow}>
                    <Text style={[styles.perkBullet, { color: accent }]}>›</Text>
                    <Text style={styles.perkText}>{perk}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: theme.font.lg,
    fontWeight: '700',
    color: theme.text.primary,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: theme.font.sm,
    color: theme.text.secondary,
    marginBottom: 16,
  },
  spendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  spendIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  spendInfo: {
    flex: 1,
    gap: 6,
  },
  spendTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spendCat: {
    fontSize: theme.font.sm,
    color: theme.text.secondary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  spendAmt: {
    fontSize: theme.font.sm,
    color: theme.text.primary,
    fontWeight: '700',
  },
  spendBarBg: {
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  spendBar: {
    height: 4,
    backgroundColor: theme.primary,
    borderRadius: 2,
  },
  recCard: {
    backgroundColor: theme.surfaceRaised,
    borderRadius: 16,
    padding: 18,
    paddingLeft: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
    overflow: 'hidden',
    position: 'relative',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  recRank: {
    fontSize: theme.font.xs,
    color: theme.text.muted,
    fontWeight: '700',
    marginBottom: 3,
  },
  recName: {
    fontSize: theme.font.xl,
    fontWeight: '800',
    color: theme.text.primary,
    letterSpacing: -0.3,
  },
  recMeta: {
    fontSize: theme.font.xs,
    color: theme.text.muted,
    marginTop: 3,
  },
  recValueBlock: {
    alignItems: 'flex-end',
  },
  recValueLabel: {
    fontSize: theme.font.xs,
    color: theme.text.muted,
    marginBottom: 2,
  },
  recValue: {
    fontSize: theme.font['2xl'],
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  recValueUnit: {
    fontSize: theme.font.xs,
    color: theme.text.muted,
  },
  bonusBanner: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 9,
    marginBottom: 12,
  },
  bonusText: {
    fontSize: theme.font.sm,
    fontWeight: '600',
  },
  whyText: {
    fontSize: theme.font.sm,
    color: theme.text.secondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 14,
  },
  stat: {},
  statLabel: {
    fontSize: theme.font.xs,
    color: theme.text.muted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: theme.font.sm,
    color: theme.text.secondary,
    fontWeight: '700',
    marginTop: 2,
  },
  perks: {
    gap: 5,
  },
  perkRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-start',
  },
  perkBullet: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  perkText: {
    fontSize: theme.font.xs,
    color: theme.text.muted,
    flex: 1,
    lineHeight: 18,
  },
});
