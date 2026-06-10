export interface EarningRates {
  travel: number;
  dining: number;
  groceries: number;
  gas: number;
  everything_else: number;
  streaming?: number;
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

export interface SignOnBonus {
  amount: number;
  spend_requirement: number;
  days: number;
}

export type CardType = 'travel' | 'rewards' | 'cashback' | 'student';
export type RewardsCurrency = 'miles' | 'points' | 'cashback';

export interface Card {
  id: string;
  name: string;
  issuer: string;
  network: string;
  type: CardType;
  annual_fee: number;
  apr: number;
  foreign_transaction_fee: number;
  rewards_currency: RewardsCurrency;
  points_to_dollar_rate: number;
  sign_on_bonus: SignOnBonus | null;
  earning_rates: EarningRates;
  perks: string[];
  user_balance: UserBalance;
  expiration: Expiration;
}

export type SpendingCategory = 'dining' | 'travel' | 'groceries' | 'gas' | 'everything_else' | 'streaming';
export type RedemptionGoal = 'flights' | 'cashback' | 'gift_cards';

export interface SpendingProfile {
  top_categories: string[];
  monthly_spend: Record<string, number>;
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
