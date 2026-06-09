import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../types';
import { Colors, getCardColor } from '../theme/colors';
import ExpirationAlert from '../components/ExpirationAlert';
import RedemptionCard from '../components/RedemptionCard';
import DonutChart from '../components/DonutChart';
import cardsData from '../data/cards.json';

type RedemptionGoalId = 'flights' | 'cashback' | 'gift_cards';

const REDEMPTION_OPTIONS = [
  {
    id: 'flights' as RedemptionGoalId,
    label: 'Flights',
    icon: 'airplane' as const,
    description: 'Best value for travel',
    estimatedValue: '~1.5¢/pt',
    isRecommended: true,
  },
  {
    id: 'cashback' as RedemptionGoalId,
    label: 'Cash Back',
    icon: 'cash' as const,
    description: 'Simple & flexible',
    estimatedValue: '~1¢/pt',
    isRecommended: false,
  },
  {
    id: 'gift_cards' as RedemptionGoalId,
    label: 'Gift Cards',
    icon: 'gift' as const,
    description: 'Everyday brands',
    estimatedValue: '~1.2¢/pt',
    isRecommended: false,
  },
];

const REDEMPTION_MULTIPLIERS: Record<RedemptionGoalId, number> = {
  flights: 1.5,
  cashback: 1.0,
  gift_cards: 1.2,
};

export default function RewardsHubScreen() {
  const { cards, user } = cardsData as { cards: Card[]; user: typeof cardsData.user };
  const [selectedGoal, setSelectedGoal] = useState<RedemptionGoalId>('flights');

  const expiringCards = cards.filter(
    (c) => c.expiration.expires && (c.expiration.months_until_expiry ?? 99) <= 6
  );

  const multiplier = REDEMPTION_MULTIPLIERS[selectedGoal];

  const segments = cards.map((card) => ({
    value: card.user_balance.dollar_value,
    color: getCardColor(card.type),
  }));

  // Best card for redemption goal
  const bestRedemptionCard = [...cards].sort(
    (a, b) =>
      b.user_balance.dollar_value * multiplier * b.points_to_dollar_rate -
      a.user_balance.dollar_value * multiplier * a.points_to_dollar_rate
  )[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Rewards Hub</Text>
          <Text style={styles.subtitle}>Your total earning power</Text>
        </View>

        {/* Donut Chart + Legend */}
        <View style={styles.chartCard}>
          <View style={styles.chartRow}>
            <View style={styles.chartCenter}>
              <DonutChart segments={segments} size={160} strokeWidth={22} />
              <View style={styles.chartCenterLabel}>
                <Text style={styles.chartCenterAmount}>${user.total_rewards_value.toFixed(0)}</Text>
                <Text style={styles.chartCenterSub}>total value</Text>
              </View>
            </View>
            <View style={styles.legend}>
              {cards.map((card) => {
                const cardColor = getCardColor(card.type);
                const pct =
                  user.total_rewards_value > 0
                    ? ((card.user_balance.dollar_value / user.total_rewards_value) * 100).toFixed(0)
                    : '0';
                return (
                  <View key={card.id} style={styles.legendRow}>
                    <View style={[styles.legendDot, { backgroundColor: cardColor }]} />
                    <View style={styles.legendText}>
                      <Text style={styles.legendName} numberOfLines={1}>
                        {card.name.split(' ').slice(0, 2).join(' ')}
                      </Text>
                      <Text style={styles.legendPct}>{pct}%</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Redemption Options */}
        <RedemptionCard
          options={REDEMPTION_OPTIONS}
          selectedGoal={selectedGoal}
          onSelect={(goal) => setSelectedGoal(goal as RedemptionGoalId)}
        />

        {/* Best Redemption Recommendation */}
        {bestRedemptionCard && (
          <View style={styles.recommendCard}>
            <View style={styles.recommendHeader}>
              <Ionicons name="bulb" size={16} color={Colors.accentBlue} />
              <Text style={styles.recommendTitle}>
                Best card to redeem for{' '}
                {selectedGoal === 'gift_cards' ? 'gift cards' : selectedGoal}
              </Text>
            </View>
            <View style={styles.recommendBody}>
              <View
                style={[
                  styles.recommendColorBar,
                  { backgroundColor: getCardColor(bestRedemptionCard.type) },
                ]}
              />
              <View style={styles.recommendContent}>
                <Text style={styles.recommendCardName}>{bestRedemptionCard.name}</Text>
                <Text style={styles.recommendCardIssuer}>{bestRedemptionCard.issuer}</Text>
                <Text style={[styles.recommendValue, { color: getCardColor(bestRedemptionCard.type) }]}>
                  ${(bestRedemptionCard.user_balance.dollar_value * multiplier).toFixed(2)} est. value
                </Text>
                <Text style={styles.recommendNote}>
                  {bestRedemptionCard.user_balance.points.toLocaleString()}{' '}
                  {bestRedemptionCard.rewards_currency} × {multiplier}¢/pt
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Card Balances */}
        <Text style={styles.sectionTitle}>Card Balances</Text>
        {cards.map((card) => {
          const cardColor = getCardColor(card.type);
          const redemptionValue = card.user_balance.dollar_value * multiplier;
          return (
            <View key={card.id} style={[styles.balanceRow, { borderColor: cardColor + '33' }]}>
              <View style={[styles.balanceAccent, { backgroundColor: cardColor }]} />
              <View style={styles.balanceContent}>
                <View style={styles.balanceTop}>
                  <Text style={styles.balanceName}>{card.name}</Text>
                  <Text style={[styles.balanceAmount, { color: cardColor }]}>
                    ${card.user_balance.dollar_value.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.balanceBottom}>
                  <Text style={styles.balancePoints}>
                    {card.user_balance.points.toLocaleString()} {card.rewards_currency}
                  </Text>
                  <Text style={styles.balanceRedemption}>
                    ~${redemptionValue.toFixed(2)} for {selectedGoal === 'gift_cards' ? 'gift cards' : selectedGoal}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* Expiration Alerts */}
        {expiringCards.length > 0 && (
          <>
            <View style={styles.expirationHeader}>
              <Ionicons name="warning" size={16} color={Colors.danger} />
              <Text style={styles.expirationTitle}>Expiring Soon</Text>
              <View style={styles.expirationBadge}>
                <Text style={styles.expirationBadgeText}>{expiringCards.length}</Text>
              </View>
            </View>
            {expiringCards.map((card) => (
              <ExpirationAlert key={card.id} card={card} />
            ))}
          </>
        )}

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Ionicons name="sparkles" size={16} color={Colors.accentPurple} />
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>Pro Tip</Text>
            <Text style={styles.tipsText}>
              {selectedGoal === 'flights'
                ? 'Travel portals often give 25-50% more value per point than face value. Book through your card\'s travel portal for maximum reward.'
                : selectedGoal === 'cashback'
                ? 'Cashback is the most flexible option. Consider keeping a buffer of points for bigger redemptions where value per point is higher.'
                : 'Gift card values vary by retailer. Look for bonus redemption events where select gift cards are worth up to 20% more.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  chartCenter: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  chartCenterAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  chartCenterSub: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  legend: {
    flex: 1,
    gap: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendName: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  legendPct: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
    marginTop: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    overflow: 'hidden',
  },
  balanceAccent: {
    width: 4,
  },
  balanceContent: {
    flex: 1,
    padding: 12,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  balanceBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  balancePoints: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  balanceRedemption: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  expirationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  expirationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  expirationBadge: {
    backgroundColor: Colors.danger,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expirationBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recommendCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.accentBlue + '44',
    marginBottom: 20,
  },
  recommendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  recommendTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  recommendBody: {
    flexDirection: 'row',
    backgroundColor: Colors.surface2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  recommendColorBar: {
    width: 4,
  },
  recommendContent: {
    flex: 1,
    padding: 12,
  },
  recommendCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  recommendCardIssuer: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  recommendValue: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
  },
  recommendNote: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  tipsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.accentPurple + '11',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.accentPurple + '33',
    gap: 10,
    marginTop: 8,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accentPurple,
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
