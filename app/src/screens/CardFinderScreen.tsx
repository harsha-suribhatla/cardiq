import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecommendedCard } from '../types';
import { Colors } from '../theme/colors';
import CardFinderItem from '../components/CardFinderItem';
import cardsData from '../data/cards.json';

// Predefined recommended cards (not in user's wallet)
const CANDIDATE_CARDS: RecommendedCard[] = [
  {
    id: 'rec_001',
    name: 'Sapphire Reserve Card',
    issuer: 'Pinnacle Bank',
    network: 'Visa',
    type: 'travel',
    annual_fee: 550,
    apr: 22.49,
    foreign_transaction_fee: 0,
    rewards_currency: 'points',
    points_to_dollar_rate: 0.015,
    sign_on_bonus: { amount: 60000, spend_requirement: 4000, days: 90 },
    earning_rates: { travel: 10, dining: 3, groceries: 1, gas: 1, everything_else: 1 },
    perks: [
      '$300 annual travel credit',
      'Priority Pass lounge access',
      '1.5¢/pt on travel portal',
      'No foreign transaction fees',
    ],
    why:
      "Alex spends $200/month on travel — at 10x points worth 1.5¢ each, that's $360/year just from travel. Add the $300 travel credit and dining bonus to easily justify the annual fee.",
    best_category: 'travel',
  },
  {
    id: 'rec_002',
    name: 'Freedom Unlimited Card',
    issuer: 'Meridian Financial',
    network: 'Visa',
    type: 'cashback',
    annual_fee: 0,
    apr: 20.49,
    foreign_transaction_fee: 0,
    rewards_currency: 'cashback',
    points_to_dollar_rate: 0.01,
    sign_on_bonus: { amount: 200, spend_requirement: 500, days: 90 },
    earning_rates: { dining: 3, groceries: 3, travel: 5, gas: 1.5, everything_else: 1.5 },
    perks: [
      'No annual fee',
      '1.5% on everything else',
      'No foreign transaction fees',
      'Cell phone protection',
    ],
    why:
      "A zero-fee card with 1.5% on all purchases means Alex earns on the $250/month 'everything else' spend with no tracking required. Combined with dining/grocery bonuses, this adds significant value to the wallet.",
    best_category: 'travel',
  },
  {
    id: 'rec_003',
    name: 'Blue Cash Preferred Card',
    issuer: 'Atlantic Credit',
    network: 'Amex',
    type: 'cashback',
    annual_fee: 95,
    apr: 19.24,
    foreign_transaction_fee: 0,
    rewards_currency: 'cashback',
    points_to_dollar_rate: 0.01,
    sign_on_bonus: { amount: 350, spend_requirement: 3000, days: 180 },
    earning_rates: { groceries: 6, streaming: 6, gas: 3, dining: 1, everything_else: 1 },
    perks: [
      '6% on US supermarkets (up to $6k/yr)',
      '6% on select streaming',
      '3% on transit & gas',
      '$84 Disney Bundle credit',
    ],
    why:
      "Alex spends $300/month on groceries. At 6% cashback that's $216/year from groceries alone — well above the $95 annual fee. The streaming bonus adds even more value for a 22-year-old.",
    best_category: 'groceries',
  },
  {
    id: 'rec_004',
    name: 'Ink Business Cash Card',
    issuer: 'Commerce Capital',
    network: 'Mastercard',
    type: 'cashback',
    annual_fee: 0,
    apr: 18.49,
    foreign_transaction_fee: 0,
    rewards_currency: 'cashback',
    points_to_dollar_rate: 0.01,
    sign_on_bonus: { amount: 750, spend_requirement: 6000, days: 180 },
    earning_rates: { dining: 2, groceries: 5, gas: 2, travel: 1, everything_else: 1 },
    perks: [
      'No annual fee',
      '5% on office & telecom (up to $25k/yr)',
      'Purchase protection',
      'Extended warranty',
    ],
    why:
      "The 5% grocery rate (up to a generous cap) combined with zero annual fee makes this a pure-value card. It pairs well with Alex's existing travel card for a well-rounded setup.",
    best_category: 'groceries',
  },
  {
    id: 'rec_005',
    name: 'Dining Rewards Elite Card',
    issuer: 'Culinary Bank',
    network: 'Mastercard',
    type: 'rewards',
    annual_fee: 120,
    apr: 20.99,
    foreign_transaction_fee: 0,
    rewards_currency: 'points',
    points_to_dollar_rate: 0.02,
    sign_on_bonus: { amount: 30000, spend_requirement: 3000, days: 90 },
    earning_rates: { dining: 8, groceries: 3, travel: 2, gas: 1, everything_else: 1 },
    perks: [
      '8x points on dining',
      '$100 dining credit annually',
      'Concierge service',
      'No foreign transaction fees',
    ],
    why:
      "At $400/month dining spend, 8x points worth 2¢ each = $768/year from dining alone. Minus the $120 fee and $100 dining credit, the net gain is impressive. Alex's #1 spending category would be maximally rewarded.",
    best_category: 'dining',
  },
];

function computeAnnualValue(card: RecommendedCard, monthlySpend: Record<string, number>): number {
  let totalValue = 0;
  for (const [category, spend] of Object.entries(monthlySpend)) {
    const rate = card.earning_rates[category] ?? card.earning_rates.everything_else ?? 1;
    totalValue += spend * 12 * rate * card.points_to_dollar_rate;
  }
  return totalValue - card.annual_fee;
}

export default function CardFinderScreen() {
  const { user } = cardsData as { user: typeof cardsData.user };
  const monthlySpend = user.spending_profile.monthly_spend;

  const rankedCards = CANDIDATE_CARDS.map((card) => ({
    ...card,
    estimated_annual_value: computeAnnualValue(card, monthlySpend),
  })).sort((a, b) => (b.estimated_annual_value ?? 0) - (a.estimated_annual_value ?? 0));

  const topCategory = user.spending_profile.top_categories[0];
  const monthlyDining = monthlySpend.dining;
  const monthlyGroceries = monthlySpend.groceries;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Cards Ranked for {user.name}</Text>
          <Text style={styles.subtitle}>
            Personalized based on your ${(monthlyDining + monthlyGroceries).toLocaleString()}/mo
            dining & grocery spend
          </Text>
        </View>

        {/* Profile Summary */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={[styles.profileIconWrap, { backgroundColor: Colors.accentBlue + '22' }]}>
              <Ionicons name="person-circle-outline" size={22} color={Colors.accentBlue} />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{user.name}'s Spending Profile</Text>
              <Text style={styles.profileSub}>
                Top categories: {user.spending_profile.top_categories.join(', ')}
              </Text>
            </View>
          </View>
          <View style={styles.spendRow}>
            {Object.entries(monthlySpend).map(([cat, amount]) => (
              <View key={cat} style={styles.spendChip}>
                <Text style={styles.spendAmount}>${amount}</Text>
                <Text style={styles.spendCat}>
                  {cat === 'everything_else' ? 'other' : cat}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Insight banner */}
        <View style={styles.insightBanner}>
          <Ionicons name="bulb" size={14} color={Colors.accentPurple} />
          <Text style={styles.insightText}>
            You spend most on <Text style={{ color: Colors.accentPurple, fontWeight: '700' }}>{topCategory}</Text>.
            Cards below are ranked by estimated annual value to you — factoring in your actual spending.
          </Text>
        </View>

        {/* Ranked Cards */}
        {rankedCards.map((card, index) => (
          <CardFinderItem key={card.id} card={card} rank={index + 1} />
        ))}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.disclaimerText}>
            Estimated values are based on your current spending profile and may vary. Sign-on bonuses
            are one-time and not included in annual value estimates.
          </Text>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  profileIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  profileSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  spendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  spendChip: {
    backgroundColor: Colors.surface2,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  spendAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  spendCat: {
    fontSize: 9,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
    marginTop: 1,
  },
  insightBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.accentPurple + '11',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.accentPurple + '33',
  },
  insightText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
