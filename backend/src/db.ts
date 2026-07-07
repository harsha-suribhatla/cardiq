import dotenv from 'dotenv';
dotenv.config();

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import staticData from '../../cards.json';

export interface Card {
  id: string;
  name: string;
  issuer: string;
  network: string;
  type: string;
  annual_fee: number;
  apr: number;
  foreign_transaction_fee: number;
  rewards_currency: string;
  points_to_dollar_rate: number;
  sign_on_bonus: {
    amount: number;
    spend_requirement: number;
    days: number;
  } | null;
  earning_rates: Record<string, number>;
  perks: string[];
  user_balance: {
    points: number;
    dollar_value: number;
  };
  expiration: {
    expires: boolean;
    months_until_expiry?: number;
    note: string;
  };
}

export interface User {
  id: string;
  name: string;
  age: number;
  connected_cards: string[];
  total_rewards_value: number;
  spending_profile: {
    top_categories: string[];
    monthly_spend: Record<string, number>;
  };
  redemption_goal: string;
}

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabase) return supabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('your-project')) return null;
  try {
    supabase = createClient(url, key);
    return supabase;
  } catch {
    return null;
  }
}

export async function seedData(): Promise<void> {
  const client = getSupabase();
  if (!client) {
    console.log('Supabase not configured — skipping seed, using static data');
    return;
  }
  try {
    const { data: existingUser } = await client
      .from('users')
      .select('id')
      .eq('id', staticData.user.id)
      .single();

    if (!existingUser) {
      await client.from('users').insert({
        id: staticData.user.id,
        name: staticData.user.name,
        age: staticData.user.age,
        connected_cards: staticData.user.connected_cards,
        total_rewards_value: staticData.user.total_rewards_value,
        spending_profile: staticData.user.spending_profile,
        redemption_goal: staticData.user.redemption_goal,
      });

      for (const card of staticData.cards) {
        await client.from('cards').insert({
          id: card.id,
          user_id: staticData.user.id,
          name: card.name,
          issuer: card.issuer,
          network: card.network,
          type: card.type,
          annual_fee: card.annual_fee,
          apr: card.apr,
          foreign_transaction_fee: card.foreign_transaction_fee,
          rewards_currency: card.rewards_currency,
          points_to_dollar_rate: card.points_to_dollar_rate,
          sign_on_bonus: card.sign_on_bonus,
          earning_rates: card.earning_rates,
          perks: card.perks,
        });

        await client.from('rewards_balances').insert({
          card_id: card.id,
          points: card.user_balance.points,
          dollar_value: card.user_balance.dollar_value,
          expires_at: card.expiration.expires && card.expiration.months_until_expiry
            ? new Date(Date.now() + card.expiration.months_until_expiry * 30 * 24 * 60 * 60 * 1000).toISOString()
            : null,
        });
      }
      console.log('Seed data inserted into Supabase');
    }
  } catch (err) {
    console.warn('Supabase seed failed, falling back to static data:', err);
  }
}

export async function getCardsForUser(userId: string): Promise<Card[]> {
  const client = getSupabase();
  if (!client) return staticData.cards as Card[];

  try {
    const { data, error } = await client
      .from('cards')
      .select(`
        *,
        rewards_balances (points, dollar_value, expires_at)
      `)
      .eq('user_id', userId);

    if (error || !data || data.length === 0) {
      return staticData.cards as Card[];
    }

    return data.map((row: Record<string, unknown>) => {
      const rb = Array.isArray(row.rewards_balances) ? row.rewards_balances[0] : null;
      const expiresAt = rb?.expires_at ? new Date(rb.expires_at as string) : null;
      const monthsUntilExpiry = expiresAt
        ? Math.round((expiresAt.getTime() - Date.now()) / (30 * 24 * 60 * 60 * 1000))
        : undefined;

      return {
        id: row.id,
        name: row.name,
        issuer: row.issuer,
        network: row.network,
        type: row.type,
        annual_fee: row.annual_fee,
        apr: row.apr,
        foreign_transaction_fee: row.foreign_transaction_fee,
        rewards_currency: row.rewards_currency,
        points_to_dollar_rate: row.points_to_dollar_rate,
        sign_on_bonus: row.sign_on_bonus,
        earning_rates: row.earning_rates,
        perks: row.perks,
        user_balance: rb
          ? { points: rb.points, dollar_value: rb.dollar_value }
          : { points: 0, dollar_value: 0 },
        expiration: {
          expires: expiresAt !== null,
          months_until_expiry: monthsUntilExpiry,
          note: expiresAt !== null ? 'Expires based on account activity' : 'Rewards never expire',
        },
      } as Card;
    });
  } catch {
    return staticData.cards as Card[];
  }
}

export async function getUserData(userId: string): Promise<User | null> {
  if (userId === staticData.user.id || userId === 'user_001') {
    return staticData.user as User;
  }

  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return staticData.user as User;
    return data as User;
  } catch {
    return staticData.user as User;
  }
}
