import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from './src/theme/colors';
import BottomNav, { TabName } from './src/components/BottomNav';
import DashboardScreen from './src/screens/DashboardScreen';
import RewardsHubScreen from './src/screens/RewardsHubScreen';
import CardFinderScreen from './src/screens/CardFinderScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('cards');

  const renderScreen = () => {
    switch (activeTab) {
      case 'cards':
        return <DashboardScreen />;
      case 'rewards':
        return <RewardsHubScreen />;
      case 'discover':
        return <CardFinderScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor={Colors.background} />
        <View style={styles.screenContainer}>{renderScreen()}</View>
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
});
