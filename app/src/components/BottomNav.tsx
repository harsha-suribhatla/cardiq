import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

export type TabName = 'cards' | 'rewards' | 'discover';

interface Tab {
  id: TabName;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

const TABS: Tab[] = [
  { id: 'cards', label: 'Cards', icon: 'grid-outline', activeIcon: 'grid' },
  { id: 'rewards', label: 'Rewards', icon: 'star-outline', activeIcon: 'star' },
  { id: 'discover', label: 'Discover', icon: 'search-outline', activeIcon: 'search' },
];

interface Props {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

export default function BottomNav({ activeTab, onTabChange }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.topBorder} />
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={22}
              color={isActive ? Colors.accentBlue : Colors.textSecondary}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingBottom: 28,
    paddingTop: 4,
    position: 'relative',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.accentBlue,
    fontWeight: '700',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accentBlue,
    marginTop: 1,
  },
});
