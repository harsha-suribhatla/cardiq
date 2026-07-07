import Anthropic from '@anthropic-ai/sdk';
import { TOOLS, executeToolCall } from './tools/index';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are CardIQ's financial assistant, helping young adults get more value from their credit cards.

You have access to tools that can look up the user's cards, rewards, fees, and spending patterns.

Guidelines:
- When asked which card to use, call recommend_swipe with the relevant category
- When asked about rewards, call get_unified_rewards_value and check_expiring_rewards
- When given a location or merchant, call resolve_merchant first to infer the spending category
- Always synthesize tool results into a single clear, conversational recommendation
- PROACTIVELY: if you detect expiring rewards while answering any question, mention them at the end with the dollar amount at risk
- Keep responses concise and actionable — this is a mobile app
- Use plain English, avoid jargon. Say "you'll earn $X back" not "your effective rewards rate is X%"
- When recommending a card, always mention the specific earn rate and estimated annual value`;

export interface AgentRequest {
  message: string;
  userId: string;
  location?: { lat: number; lng: number };
}

export async function runAgentLoop(req: AgentRequest): Promise<string> {
  const messages: Anthropic.MessageParam[] = [];

  let userContent = req.message;
  if (req.location) {
    userContent += `\n\n[Context: User's current location is lat=${req.location.lat}, lng=${req.location.lng}]`;
  }

  messages.push({ role: 'user', content: userContent });

  // Agentic loop — max 10 iterations to avoid infinite loops
  for (let i = 0; i < 10; i++) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages,
    });

    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find((b) => b.type === 'text');
      return textBlock && textBlock.type === 'text' ? textBlock.text : 'I could not generate a response.';
    }

    if (response.stop_reason === 'tool_use') {
      messages.push({ role: 'assistant', content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of response.content) {
        if (block.type === 'tool_use') {
          try {
            const result = await executeToolCall(block.name, block.input as Record<string, unknown>);
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: result,
            });
          } catch (err) {
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
              is_error: true,
            });
          }
        }
      }

      messages.push({ role: 'user', content: toolResults });
      continue;
    }

    break;
  }

  return 'I was unable to complete your request. Please try again.';
}
