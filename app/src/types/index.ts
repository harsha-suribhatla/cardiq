export interface SignOnBonus {
  amount: number;
  spend_requirement: number;
  days: number;
}

export interface EarningRates {
  travel?: number;
  dining?: number;
  groceries?: number;
  gas?: number;
  everything_else?: number;
  streaming?: number;
  [key: string]: number | undefined;
}

export interface UserBalance {
  points: number;
  dollar_value: number;
}

export interface Expiration {
  expires: boolean;
  months_until_expiry?: number;
  note: string;
}

export type CardType = 'travel' | 'cashback' | 'rewards' | 'student';

export interface Card {
  id: string;
  name: string;
  issuer: string;
  network: string;
  type: CardType;
  annual_fee: number;
  apr: number;
  foreign_transaction_fee: number;
  rewards_currency: string;
  points_to_dollar_rate: number;
  sign_on_bonus: SignOnBonus | null;
  earning_rates: EarningRates;
  perks: string[];
  user_balance: UserBalance;
  expiration: Expiration;
}

export interface MonthlySpend {
  dining: number;
  groceries: number;
  travel: number;
  gas: number;
  everything_else: number;
  [key: string]: number;
}

export interface SpendingProfile {
  top_categories: string[];
  monthly_spend: MonthlySpend;
}

export interface User {
  id: string;
  name: string;
  age: number;
  connected_cards: string[];
  total_rewards_value: number;
  spending_profile: SpendingProfile;
  redemption_goal: string;
}

export interface CardsData {
  cards: Card[];
  user: User;
}

export type SpendCategory = 'dining' | 'travel' | 'groceries' | 'gas' | 'everything_else';

export type RedemptionGoal = 'flights' | 'cashback' | 'gift_cards';

// Card Finder recommendation card type (not in user's wallet)
export interface RecommendedCard {
  id: string;
  name: string;
  issuer: string;
  network: string;
  type: CardType;
  annual_fee: number;
  apr: number;
  foreign_transaction_fee: number;
  rewards_currency: string;
  points_to_dollar_rate: number;
  sign_on_bonus: SignOnBonus | null;
  earning_rates: EarningRates;
  perks: string[];
  why: string;
  estimated_annual_value?: number;
  best_category?: string;
}
