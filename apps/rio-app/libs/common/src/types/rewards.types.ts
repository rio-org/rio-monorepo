export type RewardsResponse = {
  eth_rewards_in_period: string;
  yearly_rewards_percent: string;
};

export type RewardsForAddressQueryResponse = RewardsResponse & {
  yearly_eth_rewards: string;
  starting_rate: string;
  final_rate: string;
  starting_token_balance: string;
  token_change: string;
  token_change_eth_value: string;
  total_eth_paid_in_range: string;
  change_eth_value_reward_ratio: string;
  start_eth_value: string;
  final_token_balance: string;
  final_eth_value: string;
  eth_rewards_on_starting_balance: string;
  eth_rewards_on_change: string;
  change_eth_value_starting_balance_ratio: string;
};

export interface RewardChainAndToken {
  _chainId: number;
  _token: string;
}
