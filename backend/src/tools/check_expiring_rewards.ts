import { getCardsForUser } from '../db';

export const checkExpiringRewardsDef = {
  name: 'check_expiring_rewards',
  description:
    'Checks for rewards that are expiring soon and returns cards at risk, with dollar values',
  input_schema: {
    type: 'object' as const,
    properties: {
      user_id: { type: 'string', description: 'The user ID' },
      days_threshold: {
        type: 'number',
        description: 'Number of days to look ahead for expiration (default 30)',
      },
    },
    required: ['user_id'],
  },
};

export async function checkExpiringRewards(input: {
  user_id: string;
  days_threshold?: number;
}): Promise<unknown> {
  const cards = await getCardsForUser(input.user_id);
  const threshold = input.days_threshold ?? 30;
  const monthsThreshold = threshold / 30;

  const expiring = cards
    .filter(
      (card) =>
        card.expiration.expires &&
        card.expiration.months_until_expiry !== undefined &&
        card.expiration.months_until_expiry <= monthsThreshold
    )
    .map((card) => ({
      card_name: card.name,
      card_type: card.type,
      dollar_value_at_risk: card.user_balance.dollar_value,
      points_at_risk: card.user_balance.points,
      months_until_expiry: card.expiration.months_until_expiry,
      note: card.expiration.note,
      urgency:
        (card.expiration.months_until_expiry ?? 0) <= 1
          ? 'critical'
          : (card.expiration.months_until_expiry ?? 0) <= 2
          ? 'high'
          : 'medium',
    }));

  const totalAtRisk = expiring.reduce((sum, c) => sum + c.dollar_value_at_risk, 0);

  return {
    threshold_days: threshold,
    expiring_count: expiring.length,
    total_dollar_value_at_risk: +totalAtRisk.toFixed(2),
    expiring_cards: expiring,
    message:
      expiring.length > 0
        ? `You have $${totalAtRisk.toFixed(2)} in rewards expiring within ${threshold} days across ${expiring.length} card(s). Act now to avoid losing them.`
        : `No rewards expiring within the next ${threshold} days.`,
  };
}
