import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../types';
import { Colors, getCardColor } from '../theme/colors';

interface Props {
  cards: Card[];
  totalValue: number;
}

export default function RewardsSummary({ cards, totalValue }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.heroRow}>
        <View>
          <Text style={styles.heroLabel}>TOTAL REWARDS VALUE</Text>
          <Text style={styles.heroAmount}>${totalValue.toFixed(2)}</Text>
        </View>
        <View style={[styles.iconWrap, { backgroundColor: Colors.accentBlue + '22' }]}>
          <Ionicons name="wallet-outline" size={28} color={Colors.accentBlue} />
        </View>
      </View>

      <View style={styles.breakdown}>
        {cards.map((card) => {
          const cardColor = getCardColor(card.type);
          const pct = totalValue > 0 ? (card.user_balance.dollar_value / totalValue) * 100 : 0;
          return (
            <View key={card.id} style={styles.breakdownRow}>
              <View style={[styles.dot, { backgroundColor: cardColor }]} />
              <Text style={styles.breakdownName} numberOfLines={1}>
                {card.name}
              </Text>
              <View style={styles.barWrap}>
                <View
                  style={[
                    styles.bar,
                    { width: `${pct}%` as any, backgroundColor: cardColor },
                  ]}
                />
              </View>
              <Text style={styles.breakdownValue}>
                ${card.user_balance.dollar_value.toFixed(0)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -1,
    marginTop: 4,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdown: {
    gap: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownName: {
    fontSize: 12,
    color: Colors.textSecondary,
    width: 120,
  },
  barWrap: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.surface2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  bar: {
    height: 4,
    borderRadius: 2,
    minWidth: 4,
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    width: 40,
    textAlign: 'right',
  },
});
