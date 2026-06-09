import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../types';
import { Colors, getCardColor } from '../theme/colors';

interface Props {
  card: Card;
  onPress?: () => void;
}

export default function CardTile({ card, onPress }: Props) {
  const cardColor = getCardColor(card.type);
  const isExpiringSoon =
    card.expiration.expires &&
    card.expiration.months_until_expiry !== undefined &&
    card.expiration.months_until_expiry <= 6;

  const currencyLabel =
    card.rewards_currency === 'miles'
      ? 'miles'
      : card.rewards_currency === 'cashback'
      ? 'cash back'
      : 'pts';

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: cardColor + '33' }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Color accent strip */}
      <View style={[styles.accentStrip, { backgroundColor: cardColor }]} />

      <View style={styles.content}>
        {/* Top row: name + expiration badge */}
        <View style={styles.topRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.cardName} numberOfLines={1}>
              {card.name}
            </Text>
            <Text style={styles.issuer}>
              {card.issuer} · {card.network}
            </Text>
          </View>
          <View style={styles.badges}>
            {isExpiringSoon && (
              <View style={styles.expiringBadge}>
                <Ionicons name="warning" size={10} color={Colors.danger} />
                <Text style={styles.expiringText}>
                  {card.expiration.months_until_expiry}mo
                </Text>
              </View>
            )}
            <View style={[styles.typeBadge, { backgroundColor: cardColor + '22' }]}>
              <Text style={[styles.typeText, { color: cardColor }]}>
                {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Balance row */}
        <View style={styles.balanceRow}>
          <View>
            <Text style={styles.dollarValue}>
              ${card.user_balance.dollar_value.toFixed(2)}
            </Text>
            <Text style={styles.pointsLabel}>
              {card.user_balance.points.toLocaleString()} {currencyLabel}
            </Text>
          </View>
          <View style={styles.metaBlock}>
            <View style={styles.metaRow}>
              <Ionicons name="trending-up-outline" size={12} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{card.apr}% APR</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="card-outline" size={12} color={Colors.textSecondary} />
              <Text style={styles.metaText}>
                {card.annual_fee === 0 ? 'No fee' : `$${card.annual_fee}/yr`}
              </Text>
            </View>
          </View>
        </View>

        {/* Top earn rate */}
        <View style={styles.earnRow}>
          {Object.entries(card.earning_rates)
            .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
            .slice(0, 3)
            .map(([cat, rate]) => (
              <View key={cat} style={styles.earnChip}>
                <Text style={[styles.earnRate, { color: cardColor }]}>{rate}x</Text>
                <Text style={styles.earnCat}>
                  {cat === 'everything_else' ? 'all' : cat}
                </Text>
              </View>
            ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accentStrip: {
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleBlock: {
    flex: 1,
    marginRight: 8,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  issuer: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expiringBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.danger + '22',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 3,
  },
  expiringText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.danger,
  },
  typeBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  dollarValue: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  pointsLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metaBlock: {
    gap: 4,
    alignItems: 'flex-end',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  earnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  earnChip: {
    backgroundColor: Colors.surface2,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: 'center',
  },
  earnRate: {
    fontSize: 13,
    fontWeight: '700',
  },
  earnCat: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 1,
    textTransform: 'capitalize',
  },
});
