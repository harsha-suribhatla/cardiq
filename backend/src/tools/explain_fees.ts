import { getCardsForUser } from '../db';

export const explainFeesDef = {
  name: 'explain_fees',
  description:
    "Explains a card's fees in plain English, including what you need to earn back the annual fee and what carrying a balance costs",
  input_schema: {
    type: 'object' as const,
    properties: {
      user_id: { type: 'string', description: 'The user ID' },
      card_id: { type: 'string', description: 'The card ID to explain fees for' },
    },
    required: ['user_id', 'card_id'],
  },
};

export async function explainFees(input: {
  user_id: string;
  card_id: string;
}): Promise<unknown> {
  const cards = await getCardsForUser(input.user_id);
  const card = cards.find((c) => c.id === input.card_id);

  if (!card) {
    return { error: `Card ${input.card_id} not found for user ${input.user_id}` };
  }

  const annualFeeExplanation =
    card.annual_fee === 0
      ? 'This card has no annual fee — it costs you nothing to keep open.'
      : `This card costs $${card.annual_fee}/year. To break even, you need to earn at least $${card.annual_fee} in rewards annually. At your current spend, that means earning at least $${(card.annual_fee / 12).toFixed(2)}/month in rewards.`;

  const balanceInterestMonthly = +(1000 * (card.apr / 100) / 12).toFixed(2);
  const aprExplanation = `Your APR is ${card.apr}%. If you carry a $1,000 balance for a month, that's about $${balanceInterestMonthly} in interest. Over a year, a $1,000 balance would cost you around $${+(1000 * (card.apr / 100)).toFixed(2)} in interest charges. Always pay in full if you can.`;

  const foreignTransactionExplanation =
    card.foreign_transaction_fee === 0
      ? 'No foreign transaction fees — great for international travel or online purchases in foreign currencies.'
      : `This card charges a ${card.foreign_transaction_fee}% foreign transaction fee. On a $500 international purchase, that's $${+(500 * card.foreign_transaction_fee / 100).toFixed(2)} extra. Consider using a no-fee card abroad.`;

  const lateFeeNote =
    'Missing a payment can trigger a late fee (typically $29–$40) and may increase your APR. Set up autopay for at least the minimum payment to avoid this.';

  const breakEvenMonthlySpend =
    card.annual_fee > 0
      ? Math.ceil(card.annual_fee / 12 / ((card.earning_rates['everything_else'] ?? 1) * card.points_to_dollar_rate))
      : 0;

  return {
    card_name: card.name,
    annual_fee: card.annual_fee,
    apr: card.apr,
    foreign_transaction_fee: card.foreign_transaction_fee,
    annual_fee_explanation: annualFeeExplanation,
    apr_explanation: aprExplanation,
    foreign_transaction_explanation: foreignTransactionExplanation,
    late_fee_note: lateFeeNote,
    break_even_monthly_spend: breakEvenMonthlySpend,
    break_even_note:
      card.annual_fee > 0
        ? `You need to spend at least $${breakEvenMonthlySpend}/month on this card just to cover the annual fee.`
        : 'No spending threshold — every dollar earned is pure upside.',
  };
}
