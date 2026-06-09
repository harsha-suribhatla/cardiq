import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../types';
import { Colors } from '../theme/colors';

interface Props {
  card: Card;
}

export default function ExpirationAlert({ card }: Props) {
  if (!card.expiration.expires || card.expiration.months_until_expiry === undefined) {
    return null;
  }

  const months = card.expiration.months_until_expiry;
  const isUrgent = months <= 2;
  const alertColor = isUrgent ? Colors.danger : Colors.warning;

  return (
    <View style={[styles.container, { borderColor: alertColor + '44', backgroundColor: alertColor + '11' }]}>
      <View style={[styles.iconWrap, { backgroundColor: alertColor + '22' }]}>
        <Ionicons
          name={isUrgent ? 'warning' : 'time-outline'}
          size={20}
          color={alertColor}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.cardName}>{card.name}</Text>
        <Text style={[styles.urgency, { color: alertColor }]}>
          {isUrgent ? '⚠️ Urgent — ' : ''}Expires in {months} month{months !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.note}>{card.expiration.note}</Text>
      </View>
      <View style={styles.valueWrap}>
        <Text style={styles.valueAmount}>
          ${card.user_balance.dollar_value.toFixed(0)}
        </Text>
        <Text style={styles.valueLabel}>at risk</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  urgency: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  note: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  valueWrap: {
    alignItems: 'flex-end',
  },
  valueAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  valueLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
});
