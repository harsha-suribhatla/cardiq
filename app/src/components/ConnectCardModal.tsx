import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

type Step = 'select' | 'login' | 'success';

const ISSUERS = [
  { id: 'chase', name: 'Chase', icon: '🏦' },
  { id: 'amex', name: 'American Express', icon: '💳' },
  { id: 'citi', name: 'Citi', icon: '🏛' },
  { id: 'capital_one', name: 'Capital One', icon: '🔷' },
  { id: 'discover', name: 'Discover', icon: '🔵' },
  { id: 'wells_fargo', name: 'Wells Fargo', icon: '🏪' },
];

export function ConnectCardModal({ visible, onClose }: Props) {
  const [step, setStep] = useState<Step>('select');
  const [selectedIssuer, setSelectedIssuer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleIssuerSelect = (issuerId: string) => {
    setSelectedIssuer(issuerId);
    setStep('login');
  };

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1800);
  };

  const handleClose = () => {
    setStep('select');
    setSelectedIssuer(null);
    onClose();
  };

  const issuer = ISSUERS.find((i) => i.id === selectedIssuer);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {step === 'select' && 'Connect a Card'}
            {step === 'login' && issuer?.name}
            {step === 'success' && 'Connected!'}
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {step === 'select' && (
          <>
            <Text style={styles.subtitle}>
              Choose your card issuer to securely link your account
            </Text>
            <View style={styles.securityNote}>
              <Text style={styles.securityIcon}>🔒</Text>
              <Text style={styles.securityText}>
                Bank-level 256-bit encryption. CardIQ never stores your credentials.
              </Text>
            </View>
            <ScrollView style={styles.issuerList} showsVerticalScrollIndicator={false}>
              {ISSUERS.map((issuer) => (
                <TouchableOpacity
                  key={issuer.id}
                  style={styles.issuerRow}
                  onPress={() => handleIssuerSelect(issuer.id)}
                >
                  <Text style={styles.issuerIcon}>{issuer.icon}</Text>
                  <Text style={styles.issuerName}>{issuer.name}</Text>
                  <Text style={styles.issuerArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {step === 'login' && (
          <View style={styles.loginForm}>
            <Text style={styles.subtitle}>
              Enter your {issuer?.name} online banking credentials
            </Text>
            <View style={styles.securityNote}>
              <Text style={styles.securityIcon}>🔒</Text>
              <Text style={styles.securityText}>
                This is a read-only connection. We can't move money.
              </Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username / Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                placeholderTextColor={theme.text.muted}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={theme.text.muted}
                secureTextEntry
              />
            </View>
            <TouchableOpacity
              style={styles.connectBtn}
              onPress={handleConnect}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.connectBtnText}>Connect Account</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep('select')}>
              <Text style={styles.backText}>← Back to issuers</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'success' && (
          <View style={styles.successView}>
            <Text style={styles.successEmoji}>🎉</Text>
            <Text style={styles.successTitle}>You're all set!</Text>
            <Text style={styles.successSub}>
              Your {issuer?.name} cards have been linked. Rewards will sync shortly.
            </Text>
            <TouchableOpacity style={styles.connectBtn} onPress={handleClose}>
              <Text style={styles.connectBtnText}>Back to Dashboard</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: theme.font['2xl'],
    fontWeight: '800',
    color: theme.text.primary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: theme.text.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: theme.font.base,
    color: theme.text.secondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  securityNote: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: theme.surfaceRaised,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },
  securityIcon: {
    fontSize: 14,
  },
  securityText: {
    fontSize: theme.font.xs,
    color: theme.text.muted,
    flex: 1,
    lineHeight: 18,
  },
  issuerList: {
    flex: 1,
  },
  issuerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  issuerIcon: {
    fontSize: 22,
  },
  issuerName: {
    flex: 1,
    fontSize: theme.font.base,
    color: theme.text.primary,
    fontWeight: '600',
  },
  issuerArrow: {
    fontSize: 20,
    color: theme.text.muted,
  },
  loginForm: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: theme.font.xs,
    color: theme.text.muted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: theme.surfaceRaised,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
    fontSize: theme.font.base,
    color: theme.text.primary,
  },
  connectBtn: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  connectBtnText: {
    color: '#fff',
    fontSize: theme.font.base,
    fontWeight: '700',
  },
  backText: {
    color: theme.text.secondary,
    fontSize: theme.font.sm,
    textAlign: 'center',
  },
  successView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: theme.font['3xl'],
    fontWeight: '800',
    color: theme.text.primary,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  successSub: {
    fontSize: theme.font.base,
    color: theme.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
});
