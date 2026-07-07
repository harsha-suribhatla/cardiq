import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface AgentBarProps {
  onOpen: () => void;
}

export default function AgentBar({ onOpen }: AgentBarProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onOpen}
      activeOpacity={0.8}
    >
      <Ionicons name="sparkles" size={16} color={Colors.accentBlue} />
      <Text style={styles.placeholder}>Ask which card to use...</Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 10,
  },
  placeholder: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
