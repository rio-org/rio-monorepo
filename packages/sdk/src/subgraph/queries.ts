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
    coordinator {
      id
    }
    underlyingAssets {
      address
      asset {
        symbol
        name
      }
      strategy
      priceFeed
      depositCap
      balance
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
    userBalanceAfter
    timestamp
    blockNumber
    tx
  }
`);

export const WithdrawalFields = graphql(`
  fragment WithdrawalFields on Withdrawal {
    id
    sender
    assetOut {
      id
    }
    sharesOwed
    amountIn
    restakingToken {
      id
    }
    userBalanceAfter
    timestamp
    blockNumber
    requestTx

    isReadyToClaim
    isClaimed
    amountOut
    claimTx
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

export const ManyWithdrawalsQuery = graphql(`
  query manyWithdrawals(
    $first: Int!
    $skip: Int!
    $orderBy: Withdrawal_orderBy
    $orderDirection: OrderDirection
    $where: Withdrawal_filter
  ) {
    withdrawals(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...WithdrawalFields
    }
  }
`);

//#endregion
