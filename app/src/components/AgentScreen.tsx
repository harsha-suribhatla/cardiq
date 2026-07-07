import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Switch,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, getCardColor } from '../theme/colors';
import { askAgent, parseCardMentions, AgentMessage, RecommendedCardChip } from '../services/agent';
import cardsData from '../data/cards.json';

const TEST_LOCATION = { lat: 37.7749, lng: -122.4194 };
const USER_ID = 'user_001';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m} ${ampm}`;
}

interface CardChipsRowProps {
  chips: RecommendedCardChip[];
}

function CardChipsRow({ chips }: CardChipsRowProps) {
  if (chips.length === 0) return null;
  return (
    <View style={styles.chipsRow}>
      {chips.map((chip) => {
        const color = getCardColor(chip.cardType);
        return (
          <View
            key={chip.name}
            style={[
              styles.chip,
              { backgroundColor: color + '22', borderColor: color + '55' },
            ]}
          >
            <View style={[styles.chipDot, { backgroundColor: color }]} />
            <Text style={[styles.chipText, { color }]} numberOfLines={1}>
              {chip.name}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      ).start();
    };
    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.typingContainer}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={[styles.typingDot, { opacity: dot }]}
        />
      ))}
    </View>
  );
}

interface AgentScreenProps {
  onClose: () => void;
}

export default function AgentScreen({ onClose }: AgentScreenProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // Check static data for expiring cards on mount and show proactive message
  useEffect(() => {
    const cards = (cardsData as typeof cardsData).cards;
    const urgentCards = cards.filter(
      (c) =>
        c.expiration.expires &&
        c.expiration.months_until_expiry !== undefined &&
        c.expiration.months_until_expiry <= 2
    );

    if (urgentCards.length > 0) {
      const card = urgentCards[0];
      const proactive: AgentMessage = {
        id: generateId(),
        role: 'assistant',
        content: `⚠️ Heads up — your **${card.name}** has $${card.user_balance.dollar_value.toFixed(2)} in ${card.rewards_currency} expiring in ${card.expiration.months_until_expiry} months. You should redeem it soon to avoid losing it. Ask me "what should I do with my ${card.name} rewards?" and I'll walk you through the best options.`,
        timestamp: Date.now(),
        recommendedCards: [{ name: card.name, cardType: card.type }],
      };
      setMessages([proactive]);
    } else {
      const welcome: AgentMessage = {
        id: generateId(),
        role: 'assistant',
        content: "Hi! I'm your CardIQ AI assistant. Ask me which card to use, about your rewards, fees, or whether there's a better card out there for you.",
        timestamp: Date.now(),
      };
      setMessages([welcome]);
    }
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    const userMsg: AgentMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    scrollToBottom();

    try {
      const location = locationEnabled ? TEST_LOCATION : undefined;
      const response = await askAgent(text, USER_ID, location);
      const chips = parseCardMentions(response);

      const assistantMsg: AgentMessage = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
        recommendedCards: chips,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: AgentMessage = {
        id: generateId(),
        role: 'assistant',
        content:
          'Backend not running. Start the server with:\n\ncd backend && npm run dev\n\nThen make sure ANTHROPIC_API_KEY is set in backend/.env',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>CardIQ AI</Text>
          <Text style={styles.headerSubtitle}>Powered by Claude</Text>
        </View>
        <View style={styles.headerRight}>
          <Ionicons name="sparkles" size={20} color={Colors.accentBlue} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.role === 'user' ? styles.messageRowUser : styles.messageRowAssistant,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  msg.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    msg.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextAssistant,
                  ]}
                >
                  {msg.content}
                </Text>
              </View>
              {msg.recommendedCards && msg.recommendedCards.length > 0 && (
                <CardChipsRow chips={msg.recommendedCards} />
              )}
              <Text
                style={[
                  styles.timestamp,
                  msg.role === 'user' ? styles.timestampUser : styles.timestampAssistant,
                ]}
              >
                {formatTime(msg.timestamp)}
              </Text>
            </View>
          ))}

          {isLoading && (
            <View style={[styles.messageRow, styles.messageRowAssistant]}>
              <View style={[styles.bubble, styles.bubbleAssistant]}>
                <TypingIndicator />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Location toggle */}
        <View style={styles.locationRow}>
          <Text style={styles.locationLabel}>📍 Share location</Text>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: Colors.border, true: Colors.accentBlue + '88' }}
            thumbColor={locationEnabled ? Colors.accentBlue : Colors.textSecondary}
          />
        </View>

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about your cards..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={1}
            maxHeight={100}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            blurOnSubmit
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons
              name="send"
              size={18}
              color={inputText.trim() ? '#FFFFFF' : Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backButton: {
    padding: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  headerRight: {
    width: 26,
    alignItems: 'flex-end',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 8,
  },
  messageRow: {
    maxWidth: '85%',
    gap: 4,
  },
  messageRowUser: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  messageRowAssistant: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleUser: {
    backgroundColor: Colors.accentBlue,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: Colors.surface2,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  bubbleTextAssistant: {
    color: Colors.textPrimary,
  },
  timestamp: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  timestampUser: {
    alignSelf: 'flex-end',
  },
  timestampAssistant: {
    alignSelf: 'flex-start',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 140,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  locationLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    gap: 10,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface2,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.accentBlue,
  },
  sendButtonInactive: {
    backgroundColor: Colors.surface2,
  },
});
