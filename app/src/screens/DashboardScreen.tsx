import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, SpendCategory } from '../types';
import { Colors } from '../theme/colors';
import CardTile from '../components/CardTile';
import SwipeRecommendation from '../components/SwipeRecommendation';
import AgentBar from '../components/AgentBar';
import cardsData from '../data/cards.json';

type CategoryOption = {
  id: SpendCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const CATEGORIES: CategoryOption[] = [
  { id: 'dining', label: 'Dining', icon: 'restaurant-outline' },
  { id: 'travel', label: 'Travel', icon: 'airplane-outline' },
  { id: 'groceries', label: 'Groceries', icon: 'basket-outline' },
  { id: 'gas', label: 'Gas', icon: 'car-outline' },
  { id: 'everything_else', label: 'Everything', icon: 'apps-outline' },
];

function getBestCardForCategory(cards: Card[], category: SpendCategory): Card {
  return cards.reduce((best, card) => {
    const bRate = best.earning_rates[category] ?? best.earning_rates.everything_else ?? 1;
    const cRate = card.earning_rates[category] ?? card.earning_rates.everything_else ?? 1;
    const bValue = bRate * best.points_to_dollar_rate;
    const cValue = cRate * card.points_to_dollar_rate;
    return cValue > bValue ? card : best;
  });
}

interface DashboardScreenProps {
  onOpenAgent?: () => void;
}

export default function DashboardScreen({ onOpenAgent }: DashboardScreenProps) {
  const { cards, user } = cardsData as { cards: Card[]; user: typeof cardsData.user };
  const [selectedCategory, setSelectedCategory] = useState<SpendCategory>('dining');

  const bestCard = getBestCardForCategory(cards, selectedCategory);
  const monthlySpend =
    user.spending_profile.monthly_spend[selectedCategory] ??
    user.spending_profile.monthly_spend.everything_else;

  const expiringCount = cards.filter(
    (c) => c.expiration.expires && (c.expiration.months_until_expiry ?? 99) <= 6
  ).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey, {user.name} 👋</Text>
            <Text style={styles.subtitle}>Your wallet at a glance</Text>
          </View>
          <View style={styles.totalPill}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${user.total_rewards_value.toFixed(2)}</Text>
          </View>
        </View>

        {/* Alert banner if expiring */}
        {expiringCount > 0 && (
          <View style={styles.alertBanner}>
            <Ionicons name="warning" size={14} color={Colors.danger} />
            <Text style={styles.alertText}>
              {expiringCount} card{expiringCount > 1 ? 's' : ''} with expiring rewards — check Rewards tab
            </Text>
          </View>
        )}

        {/* Category Selector */}
        <Text style={styles.sectionLabel}>BEST CARD FOR...</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={cat.icon}
                  size={14}
                  color={isActive ? '#FFFFFF' : Colors.textSecondary}
                />
                <Text
                  style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Agent Bar */}
        <AgentBar onOpen={onOpenAgent ?? (() => {})} />

        {/* Swipe Recommendation */}
        <SwipeRecommendation
          card={bestCard}
          category={selectedCategory}
          monthlySpend={monthlySpend}
        />

        {/* Cards List */}
        <View style={styles.cardListHeader}>
          <Text style={styles.sectionTitle}>Your Cards</Text>
          <View style={styles.cardCountBadge}>
            <Text style={styles.cardCountText}>{cards.length}</Text>
          </View>
        </View>

        {cards.map((card) => (
          <CardTile key={card.id} card={card} />
        ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
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
  totalPill: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  totalLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.accentBlue,
    marginTop: 2,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.danger + '18',
    borderRadius: 10,
    padding: 10,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.danger + '44',
  },
  alertText: {
    fontSize: 12,
    color: Colors.danger,
    fontWeight: '500',
    flex: 1,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.accentBlue,
    borderColor: Colors.accentBlue,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryLabelActive: {
    color: '#FFFFFF',
  },
  cardListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardCountBadge: {
    backgroundColor: Colors.surface2,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cardCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
});
