import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RecommendedCard } from '../types';
import { Colors, getCardColor } from '../theme/colors';

interface Props {
  card: RecommendedCard;
  rank: number;
}

export default function CardFinderItem({ card, rank }: Props) {
  const [expanded, setExpanded] = useState(false);
  const cardColor = getCardColor(card.type);

  const bestCat = card.best_category ?? 'general';
  const bestRate =
    card.earning_rates[bestCat] ??
    card.earning_rates.everything_else ??
    1;

  return (
    <View style={[styles.container, { borderColor: cardColor + '33' }]}>
      {/* Rank badge */}
      <View style={[styles.rankBadge, { backgroundColor: cardColor }]}>
        <Text style={styles.rankText}>#{rank}</Text>
      </View>

      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.cardName}>{card.name}</Text>
          <Text style={styles.issuer}>
            {card.issuer} · {card.network}
          </Text>
        </View>
        <View style={styles.valuePill}>
          <Text style={[styles.annualValueAmount, { color: cardColor }]}>
            +${(card.estimated_annual_value ?? 0).toFixed(0)}
          </Text>
          <Text style={styles.annualValueLabel}>/year</Text>
        </View>
      </View>

      <View style={styles.badgeRow}>
        <View style={[styles.typeBadge, { backgroundColor: cardColor + '22' }]}>
          <Text style={[styles.typeText, { color: cardColor }]}>
            {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
          </Text>
        </View>
        <View style={styles.infoBadge}>
          <Ionicons name="flash" size={10} color={Colors.accentBlue} />
          <Text style={styles.infoBadgeText}>
            {bestRate}x {bestCat === 'everything_else' ? 'all purchases' : bestCat}
          </Text>
        </View>
        {card.annual_fee === 0 && (
          <View style={styles.freeBadge}>
            <Text style={styles.freeText}>No fee</Text>
          </View>
        )}
        {card.sign_on_bonus && (
          <View style={styles.bonusBadge}>
            <Ionicons name="gift-outline" size={10} color={Colors.accentPurple} />
            <Text style={styles.bonusText}>
              {card.rewards_currency === 'cashback'
                ? `$${card.sign_on_bonus.amount}`
                : `${card.sign_on_bonus.amount.toLocaleString()} pts`}{' '}
              bonus
            </Text>
          </View>
        )}
      </View>

      {/* Why this card expandable */}
      <TouchableOpacity
        style={styles.expandBtn}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.expandLabel}>Why this card?</Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={Colors.textSecondary}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.whyText}>{card.why}</Text>
          <View style={styles.perksWrap}>
            {card.perks.map((perk, i) => (
              <View key={i} style={styles.perkRow}>
                <Ionicons name="checkmark-circle" size={13} color={cardColor} />
                <Text style={styles.perkText}>{perk}</Text>
              </View>
            ))}
          </View>
          {card.annual_fee > 0 && (
            <Text style={styles.feeNote}>Annual fee: ${card.annual_fee}/yr</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'visible',
  },
  rankBadge: {
    position: 'absolute',
    top: -1,
    left: 16,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  rankText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 14,
    marginBottom: 12,
  },
  titleBlock: {
    flex: 1,
    marginRight: 8,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  issuer: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  valuePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 1,
  },
  annualValueAmount: {
    fontSize: 20,
    fontWeight: '800',
  },
  annualValueLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
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
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentBlue + '18',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 3,
  },
  infoBadgeText: {
    fontSize: 10,
    color: Colors.accentBlue,
    fontWeight: '600',
  },
  freeBadge: {
    backgroundColor: Colors.success + '22',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  freeText: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: '600',
  },
  bonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentPurple + '18',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 3,
  },
  bonusText: {
    fontSize: 10,
    color: Colors.accentPurple,
    fontWeight: '600',
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  expandLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  expandedContent: {
    marginTop: 12,
    gap: 8,
  },
  whyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  perksWrap: {
    gap: 6,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  perkText: {
    fontSize: 12,
    color: Colors.textPrimary,
  },
  feeNote: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
