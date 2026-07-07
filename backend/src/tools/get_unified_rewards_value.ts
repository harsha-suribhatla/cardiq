import { getCardsForUser } from '../db';

export const getUnifiedRewardsValueDef = {
  name: 'get_unified_rewards_value',
  description:
    "Returns the total combined dollar value of all the user's rewards across all cards, with a per-card breakdown",
  input_schema: {
    type: 'object' as const,
    properties: {
      user_id: { type: 'string', description: 'The user ID' },
    },
    required: ['user_id'],
  },
};

export async function getUnifiedRewardsValue(input: { user_id: string }): Promise<unknown> {
  const cards = await getCardsForUser(input.user_id);

  const breakdown = cards.map((card) => ({
    card_name: card.name,
    card_type: card.type,
    currency: card.rewards_currency,
    points: card.user_balance.points,
    dollar_value: card.user_balance.dollar_value,
    points_to_dollar_rate: card.points_to_dollar_rate,
    expiration: card.expiration,
  }));

  const totalDollarValue = breakdown.reduce((sum, c) => sum + c.dollar_value, 0);

  return {
    total_dollar_value: +totalDollarValue.toFixed(2),
    card_count: cards.length,
    breakdown,
    summary: `You have $${totalDollarValue.toFixed(2)} in total rewards across ${cards.length} cards.`,
  };
}
