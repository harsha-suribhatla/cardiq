import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { Card, SpendingCategory } from '../types';
import cardsData from '../data/cards.json';
import { CardTile } from '../components/CardTile';
import { SwipeRecommendation } from '../components/SwipeRecommendation';
import { ConnectCardModal } from '../components/ConnectCardModal';

const CATEGORIES: { key: SpendingCategory; label: string; icon: string }[] = [
  { key: 'dining', label: 'Dining', icon: '🍽' },
  { key: 'travel', label: 'Travel', icon: '✈️' },
  { key: 'groceries', label: 'Groceries', icon: '🛒' },
  { key: 'gas', label: 'Gas', icon: '⛽' },
  { key: 'everything_else', label: 'Other', icon: '💳' },
];

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<SpendingCategory>('dining');
  const [connectVisible, setConnectVisible] = useState(false);

  const { cards, user } = cardsData;
  const connectedCards = cards.filter((c) => user.connected_cards.includes(c.id));

  const getRankingsForCategory = (category: SpendingCategory) =>
    connectedCards
      .map((card) => {
        const rate =
          (card.earning_rates as Record<string, number>)[category] ??
          card.earning_rates.everything_else;
        return {
          card: card as Card,
          rate,
          dollarValue: rate * card.points_to_dollar_rate,
        };
      })
      .sort((a, b) => b.dollarValue - a.dollarValue);

  const rankings = getRankingsForCategory(selectedCategory);

  return (
    <>
      <ScrollView
        style={[styles.container, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey, {user.name} 👋</Text>
            <Text style={styles.headerSub}>Your card portfolio</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setConnectVisible(true)}
          >
            <Text style={styles.addBtnText}>+ Add Card</Text>
          </TouchableOpacity>
        </View>

        {/* Total Value Banner */}
        <LinearGradient colors={['#1A1535', '#0D0C1E']} style={styles.totalBanner}>
          <Text style={styles.totalLabel}>Total Rewards Value</Text>
          <Text style={styles.totalValue}>${user.total_rewards_value.toFixed(2)}</Text>
          <View style={styles.totalFooter}>
            <Text style={styles.totalSub}>across {connectedCards.length} cards</Text>
            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeText}>↑ 12% this month</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Cards Scroll */}
        <Text style={styles.sectionTitle}>Your Cards</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsScroll}
        >
          {connectedCards.map((card) => (
            <CardTile key={card.id} card={card as Card} />
          ))}
        </ScrollView>

        {/* Smart Swipe */}
        <View style={styles.swipeHeader}>
          <View>
            <Text style={styles.sectionTitle}>Smart Swipe</Text>
            <Text style={styles.swipeSub}>Which card earns the most?</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[
                styles.categoryPill,
                selectedCategory === cat.key && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.catLabel,
                  selectedCategory === cat.key && styles.catLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <SwipeRecommendation rankings={rankings} category={selectedCategory} />

        <View style={{ height: 110 }} />
      </ScrollView>

      <ConnectCardModal
        visible={connectVisible}
        onClose={() => setConnectVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: theme.font['2xl'],
    fontWeight: '800',
    color: theme.text.primary,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: theme.font.sm,
    color: theme.text.secondary,
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: theme.primaryDim,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.primary + '55',
  },
  addBtnText: {
    color: theme.primary,
    fontSize: theme.font.sm,
    fontWeight: '700',
  },
  totalBanner: {
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 22,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#2A2550',
  },
  totalLabel: {
    color: theme.text.secondary,
    fontSize: theme.font.xs,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  totalValue: {
    color: theme.text.primary,
    fontSize: theme.font['4xl'],
    fontWeight: '800',
    letterSpacing: -1.5,
    marginTop: 6,
    marginBottom: 10,
  },
  totalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  totalSub: {
    color: theme.text.muted,
    fontSize: theme.font.sm,
  },
  totalBadge: {
    backgroundColor: theme.green + '22',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  totalBadgeText: {
    color: theme.green,
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: theme.font.lg,
    fontWeight: '700',
    color: theme.text.primary,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  cardsScroll: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 4,
    marginBottom: 28,
  },
  swipeHeader: {
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  swipeSub: {
    fontSize: theme.font.sm,
    color: theme.text.secondary,
    marginBottom: 16,
    marginTop: -8,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  categoryPillActive: {
    backgroundColor: theme.primaryDim,
    borderColor: theme.primary + '88',
  },
  catIcon: {
    fontSize: 13,
  },
  catLabel: {
    fontSize: theme.font.sm,
    color: theme.text.secondary,
    fontWeight: '500',
  },
  catLabelActive: {
    color: theme.primary,
    fontWeight: '700',
  },
});
