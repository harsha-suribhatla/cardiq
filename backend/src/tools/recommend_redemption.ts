import { getCardsForUser } from '../db';

export const recommendRedemptionDef = {
  name: 'recommend_redemption',
  description:
    'Recommends which card to redeem rewards from and how, based on the user\'s redemption goal',
  input_schema: {
    type: 'object' as const,
    properties: {
      user_id: { type: 'string', description: 'The user ID' },
      goal: {
        type: 'string',
        enum: ['flights', 'cashback', 'gift_cards'],
        description: 'The redemption goal',
      },
    },
    required: ['user_id', 'goal'],
  },
};

const MULTIPLIERS: Record<string, number> = {
  flights: 1.5,
  cashback: 1.0,
  gift_cards: 1.2,
};

const TIPS: Record<string, Record<string, string>> = {
  flights: {
    travel: 'Transfer miles to airline partners for up to 2x value on business class.',
    rewards: 'Transfer points to airline or hotel partners — your Gold Rewards points are worth up to 2¢ each this way.',
    cashback: 'Use your cashback to offset travel purchases directly on your statement.',
    student: 'Redeem points through the travel portal for best value.',
  },
  cashback: {
    travel: 'Redeem miles as a statement credit against travel purchases.',
    rewards: 'Redeem as a direct deposit or statement credit.',
    cashback: 'Request a check or statement credit — straightforward 1:1 value.',
    student: 'Redeem for a statement credit against any purchase.',
  },
  gift_cards: {
    travel: 'Redeem miles for gift cards through the card issuer portal.',
    rewards: 'Your points portal likely has 100+ gift card brands at 1.2¢/point.',
    cashback: 'Cashback typically redeems 1:1 for gift cards — same as cash.',
    student: 'Check your issuer app for gift card redemptions.',
  },
};

export async function recommendRedemption(input: {
  user_id: string;
  goal: 'flights' | 'cashback' | 'gift_cards';
}): Promise<unknown> {
  const cards = await getCardsForUser(input.user_id);
  const multiplier = MULTIPLIERS[input.goal] ?? 1.0;

  const valuations = cards.map((card) => ({
    card_name: card.name,
    card_type: card.type,
    base_dollar_value: card.user_balance.dollar_value,
    estimated_value_at_goal: +(card.user_balance.dollar_value * multiplier).toFixed(2),
    points: card.user_balance.points,
    tip: TIPS[input.goal]?.[card.type] ?? 'Check your card issuer for redemption options.',
    expiration: card.expiration,
  }));

  valuations.sort((a, b) => b.estimated_value_at_goal - a.estimated_value_at_goal);
  const best = valuations[0];

  return {
    goal: input.goal,
    multiplier,
    recommended_card: best.card_name,
    estimated_value: best.estimated_value_at_goal,
    tip: best.tip,
    all_options: valuations,
    advice: `For ${input.goal}, redeem your ${best.card_name} rewards first — they're worth an estimated $${best.estimated_value_at_goal.toFixed(2)} at ${multiplier}x value. ${best.tip}`,
  };
}
