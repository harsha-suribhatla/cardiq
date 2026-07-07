const AGENT_URL = 'http://localhost:3001';

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  recommendedCards?: RecommendedCardChip[];
}

export interface RecommendedCardChip {
  name: string;
  cardType: string;
}

export async function askAgent(
  message: string,
  userId: string,
  location?: { lat: number; lng: number }
): Promise<string> {
  const res = await fetch(`${AGENT_URL}/agent/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, userId, location }),
  });
  if (!res.ok) throw new Error(`Agent request failed: ${res.status}`);
  const data = (await res.json()) as { response: string };
  return data.response;
}

export function parseCardMentions(text: string): RecommendedCardChip[] {
  const knownCards: RecommendedCardChip[] = [
    { name: 'Venture Rewards Card', cardType: 'travel' },
    { name: 'Gold Rewards Card', cardType: 'rewards' },
    { name: 'Double Cash Card', cardType: 'cashback' },
    { name: 'Cashback Plus Card', cardType: 'cashback' },
    { name: 'Student Rewards Card', cardType: 'student' },
  ];
  return knownCards.filter((c) => text.includes(c.name));
}
