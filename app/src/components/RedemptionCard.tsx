import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface RedemptionOption {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  estimatedValue: string;
  isRecommended?: boolean;
}

interface Props {
  options: RedemptionOption[];
  selectedGoal: string;
  onSelect: (goal: string) => void;
}

export default function RedemptionCard({ options, selectedGoal, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>REDEMPTION OPTIONS</Text>
      <Text style={styles.title}>How would you like to redeem?</Text>
      <View style={styles.optionsGrid}>
        {options.map((opt) => {
          const isSelected = selectedGoal === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.optionCard,
                isSelected && styles.optionSelected,
                opt.isRecommended && !isSelected && styles.optionRecommended,
              ]}
              onPress={() => onSelect(opt.id)}
              activeOpacity={0.8}
            >
              {opt.isRecommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>Recommended</Text>
                </View>
              )}
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: isSelected ? Colors.accentBlue + '33' : Colors.surface2 },
                ]}
              >
                <Ionicons
                  name={opt.icon}
                  size={22}
                  color={isSelected ? Colors.accentBlue : Colors.textSecondary}
                />
              </View>
              <Text style={[styles.optionLabel, isSelected && { color: Colors.accentBlue }]}>
                {opt.label}
              </Text>
              <Text style={styles.optionDesc}>{opt.description}</Text>
              <Text style={[styles.optionValue, isSelected && { color: Colors.accentBlue }]}>
                {opt.estimatedValue}
              </Text>
            </TouchableOpacity>
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
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  optionCard: {
    flex: 1,
    backgroundColor: Colors.surface2,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  optionSelected: {
    borderColor: Colors.accentBlue,
    backgroundColor: Colors.accentBlue + '11',
  },
  optionRecommended: {
    borderColor: Colors.accentPurple + '66',
  },
  recommendedBadge: {
    backgroundColor: Colors.accentPurple,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  recommendedText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  optionDesc: {
    fontSize: 9,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 3,
  },
  optionValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 6,
  },
});
