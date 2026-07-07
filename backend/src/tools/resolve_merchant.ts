import { getCardsForUser } from '../db';

export const resolveMerchantDef = {
  name: 'resolve_merchant',
  description:
    "Infers the spending category and likely merchant type from the user's GPS coordinates, and recommends the best card to use",
  input_schema: {
    type: 'object' as const,
    properties: {
      lat: { type: 'number', description: 'Latitude of the user' },
      lng: { type: 'number', description: 'Longitude of the user' },
      user_id: { type: 'string', description: 'The user ID' },
    },
    required: ['lat', 'lng', 'user_id'],
  },
};

interface LocationHint {
  region: string;
  likely_category: string;
  merchant_hint: string;
  confidence: 'high' | 'medium' | 'low';
}

function inferLocation(lat: number, lng: number): LocationHint {
  // San Francisco Bay Area
  if (lat >= 37 && lat <= 38 && lng >= -122.5 && lng <= -121) {
    const innerSF = lat >= 37.7 && lat <= 37.8 && lng >= -122.5 && lng <= -122.3;
    return {
      region: 'San Francisco area',
      likely_category: innerSF ? 'dining' : 'groceries',
      merchant_hint: innerSF
        ? 'Dense restaurant district — likely dining (Mission, SOMA, or Financial District)'
        : 'Suburban SF area — likely groceries or gas',
      confidence: 'high',
    };
  }

  // New York City
  if (lat >= 40.5 && lat <= 40.9 && lng >= -74.1 && lng <= -73.7) {
    const manhattan = lat >= 40.7 && lat <= 40.85 && lng >= -74.02 && lng <= -73.93;
    return {
      region: 'New York area',
      likely_category: manhattan ? 'dining' : 'travel',
      merchant_hint: manhattan
        ? 'Manhattan — high density of restaurants, bars, and takeout'
        : 'NYC metro area — likely transit, travel, or dining',
      confidence: 'high',
    };
  }

  // Los Angeles
  if (lat >= 33.7 && lat <= 34.2 && lng >= -118.7 && lng <= -117.9) {
    return {
      region: 'Los Angeles area',
      likely_category: 'dining',
      merchant_hint: 'LA area — likely dining, groceries, or gas',
      confidence: 'medium',
    };
  }

  // Chicago
  if (lat >= 41.6 && lat <= 42.1 && lng >= -87.9 && lng <= -87.5) {
    return {
      region: 'Chicago area',
      likely_category: 'dining',
      merchant_hint: 'Chicago — likely dining or groceries',
      confidence: 'medium',
    };
  }

  // Airport zones (rough)
  const airports = [
    { name: 'SFO', lat: 37.62, lng: -122.38 },
    { name: 'JFK', lat: 40.64, lng: -73.78 },
    { name: 'LAX', lat: 33.94, lng: -118.41 },
    { name: 'ORD', lat: 41.98, lng: -87.91 },
    { name: 'ATL', lat: 33.64, lng: -84.43 },
  ];

  for (const airport of airports) {
    const dist = Math.sqrt(Math.pow(lat - airport.lat, 2) + Math.pow(lng - airport.lng, 2));
    if (dist < 0.1) {
      return {
        region: `${airport.name} Airport`,
        likely_category: 'travel',
        merchant_hint: `Near ${airport.name} — airport dining, lounges, or ground transport`,
        confidence: 'high',
      };
    }
  }

  return {
    region: 'Unknown location',
    likely_category: 'everything_else',
    merchant_hint: 'Location not recognized — defaulting to general spending',
    confidence: 'low',
  };
}

export async function resolveMerchant(input: {
  lat: number;
  lng: number;
  user_id: string;
}): Promise<unknown> {
  const hint = inferLocation(input.lat, input.lng);
  const cards = await getCardsForUser(input.user_id);
  const category = hint.likely_category;

  // Find best card for inferred category
  let bestCard = cards[0];
  let bestRate = 0;

  for (const card of cards) {
    const rate =
      card.earning_rates[category] ??
      card.earning_rates['everything_else'] ??
      1;
    const effective = rate * card.points_to_dollar_rate;
    if (effective > bestRate) {
      bestRate = effective;
      bestCard = card;
    }
  }

  const earnRate =
    bestCard.earning_rates[category] ??
    bestCard.earning_rates['everything_else'] ??
    1;

  return {
    inferred_category: category,
    merchant_hint: hint.merchant_hint,
    region: hint.region,
    confidence: hint.confidence,
    recommended_card: bestCard.name,
    card_type: bestCard.type,
    earn_rate: earnRate,
    effective_rate_pct: +(bestRate * 100).toFixed(2),
    rationale: `You're in ${hint.region} — ${hint.merchant_hint}. Use your ${bestCard.name} for ${earnRate}x ${bestCard.rewards_currency} (${(bestRate * 100).toFixed(1)}¢ per dollar).`,
  };
}
