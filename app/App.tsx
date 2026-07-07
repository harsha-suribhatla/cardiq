import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from './src/theme/colors';
import BottomNav, { TabName } from './src/components/BottomNav';
import DashboardScreen from './src/screens/DashboardScreen';
import RewardsHubScreen from './src/screens/RewardsHubScreen';
import CardFinderScreen from './src/screens/CardFinderScreen';
import AgentScreen from './src/components/AgentScreen';
import ExpiringBanner from './src/components/ExpiringBanner';
import cardsData from './src/data/cards.json';
import { Card } from './src/types';

interface ExpiringCard {
  name: string;
  dollarValue: number;
  monthsLeft: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('cards');
  const [showAgent, setShowAgent] = useState(false);
  const [dismissedExpiration, setDismissedExpiration] = useState(false);
  const [urgentExpiring, setUrgentExpiring] = useState<ExpiringCard | null>(null);

  useEffect(() => {
    const cards = (cardsData as { cards: Card[] }).cards;
    const urgent = cards.find(
      (c) =>
        c.expiration.expires &&
        c.expiration.months_until_expiry !== undefined &&
        c.expiration.months_until_expiry <= 2
    );
    if (urgent) {
      setUrgentExpiring({
        name: urgent.name,
        dollarValue: urgent.user_balance.dollar_value,
        monthsLeft: urgent.expiration.months_until_expiry ?? 2,
      });
    }
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case 'cards':
        return <DashboardScreen onOpenAgent={() => setShowAgent(true)} />;
      case 'rewards':
        return <RewardsHubScreen />;
      case 'discover':
        return <CardFinderScreen />;
      default:
        return <DashboardScreen onOpenAgent={() => setShowAgent(true)} />;
    }
  };

  if (showAgent) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={Colors.background} />
        <AgentScreen onClose={() => setShowAgent(false)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor={Colors.background} />
        <View style={styles.screenContainer}>
          {urgentExpiring && !dismissedExpiration && (
            <View style={styles.bannerWrapper}>
              <ExpiringBanner
                cardName={urgentExpiring.name}
                dollarValue={urgentExpiring.dollarValue}
                monthsLeft={urgentExpiring.monthsLeft}
                onDismiss={() => setDismissedExpiration(true)}
                onTapAgent={() => setShowAgent(true)}
              />
            </View>
          )}
          {renderScreen()}
        </View>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  bannerWrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 0,
  },
});
