import { getCardsForUser, getUserData } from '../db';

export const getDashboardSummaryDef = {
  name: 'get_dashboard_summary',
  description:
    'Returns all cards connected to the user with rewards balance, APR, annual fee, and expiration status',
  input_schema: {
    type: 'object' as const,
    properties: {
      user_id: { type: 'string', description: 'The user ID' },
    },
    required: ['user_id'],
  },
};

export async function getDashboardSummary(input: { user_id: string }): Promise<unknown> {
  const cards = await getCardsForUser(input.user_id);
  const user = await getUserData(input.user_id);

  const summary = cards.map((card) => ({
    id: card.id,
    name: card.name,
    issuer: card.issuer,
    type: card.type,
    annual_fee: card.annual_fee,
    apr: card.apr,
    foreign_transaction_fee: card.foreign_transaction_fee,
    rewards_currency: card.rewards_currency,
    points_balance: card.user_balance.points,
    dollar_value: card.user_balance.dollar_value,
    expiration: card.expiration,
    top_earning_categories: Object.entries(card.earning_rates)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cat, rate]) => ({ category: cat, rate })),
  }));

  return {
    user_name: user?.name ?? 'User',
    total_rewards_value: summary.reduce((sum, c) => sum + c.dollar_value, 0),
    card_count: cards.length,
    cards: summary,
    expiring_soon: summary.filter(
      (c) => c.expiration.expires && (c.expiration.months_until_expiry ?? 99) <= 3
    ),
  };
}
