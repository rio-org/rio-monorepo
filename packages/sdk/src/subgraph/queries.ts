import { graphql } from './generated';

//#region Fields

export const IssuerFields = graphql(`
  fragment IssuerFields on Issuer {
    id
    address
    tokensIssued
    tokens {
      id
    }
  }
`);

export const LiquidRestakingTokenFields = graphql(`
  fragment LiquidRestakingTokenFields on LiquidRestakingToken {
    id
    address
    symbol
    name
    createdTimestamp
    totalSupply
    totalValueETH
    totalValueUSD
    exchangeRateETH
    exchangeRateUSD
    percentAPY
    underlyingAssets {
      address
      asset {
        latestUSDPrice
        latestUSDPriceTimestamp
        symbol
        name
      }
      strategy
      depositCap
      balance
    }
    coordinator {
      id
    }
    assetRegistry {
      id
    }
    operatorRegistry {
      id
    }
    avsRegistry {
      id
    }
    depositPool {
      id
    }
    withdrawalQueue {
      id
    }
    rewardDistributor {
      id
    }
  }
`);

export const DepositFields = graphql(`
  fragment DepositFields on Deposit {
    id
    sender
    assetIn {
      id
    }
    amountIn
    amountOut
    restakingToken {
      id
    }
    restakingTokenPriceUSD
    userBalanceAfter
    valueUSD
    timestamp
    blockNumber
    tx
  }
`);

export const WithdrawalRequestFields = graphql(`
  fragment WithdrawalRequestFields on WithdrawalRequest {
    id
    sender
    epoch {
      epoch
      status
      sharesOwed
      assetsReceived
    }
    assetOut {
      id
    }
    sharesOwed
    amountIn
    restakingToken {
      id
    }
    restakingTokenPriceUSD
    userBalanceAfter
    valueUSD
    timestamp
    blockNumber
    tx

    isClaimed
    claim {
      id
      tx
    }
  }
`);

export const WithdrawalClaimFields = graphql(`
  fragment WithdrawalClaimFields on WithdrawalClaim {
    id
    sender
    epoch {
      epoch
    }
    assetOut {
      id
    }
    amountOut
    restakingToken {
      id
    }
    restakingTokenPriceUSD
    requests {
      id
    }
    valueUSD
    timestamp
    blockNumber
    tx
  }
`);

export const OperatorFields = graphql(`
  fragment OperatorFields on Operator {
    id
    operatorId
    address
    delegator
    manager
    earningsReceiver
    metadataURI
    metadata {
      name
      website
      description
      logo
      twitter
    }
    delegationApprover
    stakerOptOutWindowBlocks
    restakingToken {
      id
    }
  }
`);

//#region

//#region Single Record Queries

export const IssuerQuery = graphql(`
  query issuer($id: ID!) {
    issuer(id: $id) {
      ...IssuerFields
    }
  }
`);

export const LiquidRestakingTokenQuery = graphql(`
  query liquidRestakingToken($id: ID!) {
    liquidRestakingToken(id: $id) {
      ...LiquidRestakingTokenFields
    }
  }
`);

//#endregion

//#region Many Record Queries

export const ManyLiquidRestakingTokensQuery = graphql(`
  query manyLiquidRestakingTokens(
    $first: Int!
    $skip: Int!
    $orderBy: LiquidRestakingToken_orderBy
    $orderDirection: OrderDirection
    $where: LiquidRestakingToken_filter
  ) {
    liquidRestakingTokens(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...LiquidRestakingTokenFields
    }
  }
`);

export const ManyDepositsQuery = graphql(`
  query manyDeposits(
    $first: Int!
    $skip: Int!
    $orderBy: Deposit_orderBy
    $orderDirection: OrderDirection
    $where: Deposit_filter
  ) {
    deposits(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...DepositFields
    }
  }
`);

export const ManyWithdrawalRequestsQuery = graphql(`
  query manyWithdrawalRequests(
    $first: Int!
    $skip: Int!
    $orderBy: WithdrawalRequest_orderBy
    $orderDirection: OrderDirection
    $where: WithdrawalRequest_filter
  ) {
    withdrawalRequests(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...WithdrawalRequestFields
    }
  }
`);

export const ManyWithdrawalClaimsQuery = graphql(`
  query manyWithdrawalClaims(
    $first: Int!
    $skip: Int!
    $orderBy: WithdrawalClaim_orderBy
    $orderDirection: OrderDirection
    $where: WithdrawalClaim_filter
  ) {
    withdrawalClaims(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...WithdrawalClaimFields
    }
  }
`);

export const ManyOperatorsQuery = graphql(`
  query manyOperators(
    $first: Int!
    $skip: Int!
    $orderBy: Operator_orderBy
    $orderDirection: OrderDirection
    $where: Operator_filter
  ) {
    operators(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...OperatorFields
    }
  }
`);

//#endregion
