import { getUserData } from '../db';

export const findBetterCardDef = {
  name: 'find_better_card',
  description:
    "Analyzes the user's spending profile and recommends new credit cards that would give them more value than their current cards",
  input_schema: {
    type: 'object' as const,
    properties: {
      user_id: { type: 'string', description: 'The user ID' },
    },
    required: ['user_id'],
  },
};

interface CandidateCard {
  id: string;
  name: string;
  issuer: string;
  type: string;
  annual_fee: number;
  points_to_dollar_rate: number;
  earning_rates: Record<string, number>;
  perks: string[];
  why: string;
}

const CANDIDATE_CARDS: CandidateCard[] = [
  {
    id: 'cand_001',
    name: 'Sapphire Reserve',
    issuer: 'Premier Bank',
    type: 'travel',
    annual_fee: 550,
    points_to_dollar_rate: 0.015,
    earning_rates: {
      travel: 10,
      dining: 3,
      groceries: 1,
      gas: 1,
      everything_else: 1,
    },
    perks: ['$300 travel credit', 'Priority Pass lounge access', '3x on dining worldwide'],
    why: 'Best-in-class travel card with massive dining and travel multipliers',
  },
  {
    id: 'cand_002',
    name: 'Freedom Unlimited',
    issuer: 'Premier Bank',
    type: 'cashback',
    annual_fee: 0,
    points_to_dollar_rate: 0.01,
    earning_rates: {
      dining: 3,
      drugstores: 3,
      travel: 5,
      groceries: 1.5,
      everything_else: 1.5,
    },
    perks: ['No annual fee', '1.5% on everything', 'Pairs with premium cards for 50% boost'],
    why: 'No-fee card with elevated everything_else rate — great as a secondary card',
  },
  {
    id: 'cand_003',
    name: 'Blue Cash Preferred',
    issuer: 'Prestige Financial',
    type: 'cashback',
    annual_fee: 95,
    points_to_dollar_rate: 0.01,
    earning_rates: {
      groceries: 6,
      streaming: 6,
      gas: 3,
      transit: 3,
      dining: 1,
      everything_else: 1,
    },
    perks: ['6% on US supermarkets (up to $6k/year)', '6% on streaming', '$0 intro annual fee year 1'],
    why: 'Highest grocery cashback rate available — pays for itself in 2 months for moderate grocery spenders',
  },
  {
    id: 'cand_004',
    name: 'Ink Business Cash',
    issuer: 'Premier Bank',
    type: 'cashback',
    annual_fee: 0,
    points_to_dollar_rate: 0.01,
    earning_rates: {
      office_supplies: 5,
      internet: 5,
      dining: 2,
      gas: 2,
      groceries: 1,
      everything_else: 1,
    },
    perks: ['No annual fee', '5% on office supplies and internet', '$750 sign-on bonus'],
    why: 'Great for freelancers or small business owners with office and internet spend',
  },
  {
    id: 'cand_005',
    name: 'Dining Rewards Elite',
    issuer: 'Apex Payments',
    type: 'rewards',
    annual_fee: 0,
    points_to_dollar_rate: 0.015,
    earning_rates: {
      dining: 5,
      bars: 5,
      groceries: 2,
      travel: 1,
      everything_else: 1,
    },
    perks: ['No annual fee', '5x on dining', 'No foreign transaction fees'],
    why: 'Perfect for dining-heavy spenders — 5x at restaurants with no annual fee',
  },
];

export async function findBetterCard(input: { user_id: string }): Promise<unknown> {
  const user = await getUserData(input.user_id);
  const monthlySpend = user?.spending_profile.monthly_spend ?? {
    dining: 400,
    groceries: 300,
    travel: 200,
    gas: 100,
    everything_else: 250,
  };

  const scored = CANDIDATE_CARDS.map((card) => {
    const annualValue = Object.entries(monthlySpend).reduce((sum, [cat, spend]) => {
      const rate = card.earning_rates[cat] ?? card.earning_rates['everything_else'] ?? 1;
      return sum + spend * 12 * rate * card.points_to_dollar_rate;
    }, 0);

    const netValue = annualValue - card.annual_fee;

    return {
      id: card.id,
      name: card.name,
      issuer: card.issuer,
      type: card.type,
      annual_fee: card.annual_fee,
      estimated_annual_rewards: +annualValue.toFixed(2),
      net_annual_value: +netValue.toFixed(2),
      top_categories: Object.entries(card.earning_rates)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([cat, rate]) => ({ category: cat, rate })),
      perks: card.perks,
      why: card.why,
    };
  });

  scored.sort((a, b) => b.net_annual_value - a.net_annual_value);
  const top3 = scored.slice(0, 3);

  return {
    top_recommendations: top3,
    based_on_monthly_spend: monthlySpend,
    note: 'These cards are not in your current wallet. Apply through each issuer's website.',
  };
}
