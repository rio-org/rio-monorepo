// import { WithdrawEvent } from './src/lib/typings';

export const tvl = 9283382.419992;
export const apr = 5.39;
export const exchangeRate = 1.02;
export const demoReadContractAddress =
  '0xdf9b7d26c8fc806b1ae6273684556761ff02d422';
export const ethInUSD = 1938.52;
export const reEthInUSD = 1942.52;
// export const historyData: WithdrawEvent[] = [
//   {
//     date: 'August 12, 2023',
//     status: 'Pending',
//     symbol: '＊ETH',
//     amount: 11.28
//   },
//   {
//     date: 'August 7, 2023',
//     status: 'Available',
//     symbol: '＊ETH',
//     amount: 7.77
//   },
//   {
//     date: 'August 1, 2023',
//     status: 'Claimed',
//     symbol: '＊ETH',
//     amount: 3.25
//   }
// ];
export const statsData = [
  {
    label: 'Rewards',
    value: '0.5992',
    denominator: 'reETH'
  },
  {
    label: 'Restaking points',
    value: '13290',
    denominator: ''
  },
  {
    label: 'Average APY',
    value: '5.38',
    denominator: '%'
  }
];
export const emptyStatsData = [
  {
    label: 'Rewards',
    value: '0.00',
    denominator: 'reETH'
  },
  {
    label: 'Restaking points',
    value: '0',
    denominator: ''
  },
  {
    label: 'Average APR',
    value: '0',
    denominator: '%'
  }
];

export const txHistoryTableHeader = [
  'Date',
  'Transaction',
  'Historical reETH price',
  'Amount (USD)',
  'Balance'
];

export const txHistoryData = [
  {
    date: 'August 12, 2023',
    txId: '0x0000',
    type: 'Withdraw',
    historicalReEthPrice: 1780.52,
    amountReEth: 24.0,
    balance: 0
  },
  {
    date: 'August 12, 2023',
    txId: '0x0000',
    type: 'Restaked',
    historicalReEthPrice: 1780.52,
    amountReEth: 24.0,
    balance: 24.0
  },
  {
    date: 'August 12, 2023',
    txId: '0x0000',
    type: 'Withdraw',
    historicalReEthPrice: 1780.52,
    amountReEth: 24.0,
    balance: 24.0
  },
  {
    date: 'August 12, 2023',
    txId: '0x0000',
    type: 'Restaked',
    historicalReEthPrice: 1780.52,
    amountReEth: 24.0,
    balance: 24.0
  },
  {
    date: 'August 12, 2023',
    txId: '0x0000',
    type: 'Restaked',
    historicalReEthPrice: 1780.52,
    amountReEth: 24.0,
    balance: 24.0
  }
];
