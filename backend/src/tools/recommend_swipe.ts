import { getCardsForUser, getUserData } from '../db';

export const recommendSwipeDef = {
  name: 'recommend_swipe',
  description:
    'Recommends which card the user should swipe for a given spending category, based on effective earn rate',
  input_schema: {
    type: 'object' as const,
    properties: {
      user_id: { type: 'string', description: 'The user ID' },
      category: {
        type: 'string',
        description: 'The spending category (dining, travel, groceries, gas, everything_else)',
      },
    },
    required: ['user_id', 'category'],
  },
};

export async function recommendSwipe(input: {
  user_id: string;
  category: string;
}): Promise<unknown> {
  const cards = await getCardsForUser(input.user_id);
  const user = await getUserData(input.user_id);
  const category = input.category.toLowerCase().replace(' ', '_');

  let bestCard = cards[0];
  let bestEffectiveRate = 0;

  for (const card of cards) {
    const rate =
      card.earning_rates[category] ??
      card.earning_rates['everything_else'] ??
      1;
    const effectiveRate = rate * card.points_to_dollar_rate;
    if (effectiveRate > bestEffectiveRate) {
      bestEffectiveRate = effectiveRate;
      bestCard = card;
    }
  }

  const monthlySpend =
    user?.spending_profile.monthly_spend[category] ??
    user?.spending_profile.monthly_spend['everything_else'] ??
    200;

  const earnRate =
    bestCard.earning_rates[category] ??
    bestCard.earning_rates['everything_else'] ??
    1;

  const estimatedAnnualValue = monthlySpend * 12 * bestEffectiveRate;

  // Build comparison for transparency
  const allRates = cards.map((card) => {
    const rate =
      card.earning_rates[category] ??
      card.earning_rates['everything_else'] ??
      1;
    const effective = rate * card.points_to_dollar_rate;
    return {
      card_name: card.name,
      earn_rate: rate,
      effective_rate_pct: +(effective * 100).toFixed(2),
    };
  });

  return {
    recommended_card: bestCard.name,
    card_type: bestCard.type,
    earn_rate: earnRate,
    rewards_currency: bestCard.rewards_currency,
    effective_rate_pct: +(bestEffectiveRate * 100).toFixed(2),
    estimated_annual_value: +estimatedAnnualValue.toFixed(2),
    rationale: `${bestCard.name} earns ${earnRate}x ${bestCard.rewards_currency} on ${category}, worth ${(bestEffectiveRate * 100).toFixed(1)}¢ per dollar spent. Based on your $${monthlySpend}/month in ${category}, that's about $${estimatedAnnualValue.toFixed(0)}/year in rewards.`,
    all_cards_comparison: allRates.sort((a, b) => b.effective_rate_pct - a.effective_rate_pct),
  };
}
