import Anthropic from '@anthropic-ai/sdk';
import { getDashboardSummaryDef, getDashboardSummary } from './get_dashboard_summary';
import { recommendSwipeDef, recommendSwipe } from './recommend_swipe';
import { getUnifiedRewardsValueDef, getUnifiedRewardsValue } from './get_unified_rewards_value';
import { recommendRedemptionDef, recommendRedemption } from './recommend_redemption';
import { checkExpiringRewardsDef, checkExpiringRewards } from './check_expiring_rewards';
import { findBetterCardDef, findBetterCard } from './find_better_card';
import { explainFeesDef, explainFees } from './explain_fees';
import { resolveMerchantDef, resolveMerchant } from './resolve_merchant';

export const TOOLS: Anthropic.Tool[] = [
  getDashboardSummaryDef,
  recommendSwipeDef,
  getUnifiedRewardsValueDef,
  recommendRedemptionDef,
  checkExpiringRewardsDef,
  findBetterCardDef,
  explainFeesDef,
  resolveMerchantDef,
];

export async function executeToolCall(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<string> {
  switch (toolName) {
    case 'get_dashboard_summary':
      return JSON.stringify(await getDashboardSummary(toolInput as { user_id: string }));
    case 'recommend_swipe':
      return JSON.stringify(
        await recommendSwipe(toolInput as { user_id: string; category: string })
      );
    case 'get_unified_rewards_value':
      return JSON.stringify(await getUnifiedRewardsValue(toolInput as { user_id: string }));
    case 'recommend_redemption':
      return JSON.stringify(
        await recommendRedemption(
          toolInput as { user_id: string; goal: 'flights' | 'cashback' | 'gift_cards' }
        )
      );
    case 'check_expiring_rewards':
      return JSON.stringify(
        await checkExpiringRewards(
          toolInput as { user_id: string; days_threshold?: number }
        )
      );
    case 'find_better_card':
      return JSON.stringify(await findBetterCard(toolInput as { user_id: string }));
    case 'explain_fees':
      return JSON.stringify(
        await explainFees(toolInput as { user_id: string; card_id: string })
      );
    case 'resolve_merchant':
      return JSON.stringify(
        await resolveMerchant(toolInput as { lat: number; lng: number; user_id: string })
      );
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
