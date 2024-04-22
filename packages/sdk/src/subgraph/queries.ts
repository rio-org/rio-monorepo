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

export const TokenTransferFields = graphql(`
  fragment TokenTransferFields on TokenTransfer {
    id
    receiver {
      id
    }
    sender {
      id
    }
    restakingToken {
      id
    }
    amount
    restakingTokenPriceUSD
    senderBalanceBefore
    senderBalanceAfter
    receiverBalanceBefore
    receiverBalanceAfter
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
      amountIn
      assetsReceived
    }
    assetOut {
      id
    }
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

export const OperatorDelegatorFields = graphql(`
  fragment OperatorDelegatorFields on OperatorDelegator {
    id
    delegatorId
    address
    operator {
      address
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
    }
    manager
    earningsReceiver
    unusedValidatorKeyCount
    depositedValidatorKeyCount
    exitedValidatorKeyCount
    totalValidatorKeyCount
    restakingToken {
      id
    }
  }
`);

export const ValidatorFields = graphql(`
  fragment ValidatorFields on Validator {
    id
    status
    delegator {
      id
    }
    keyIndex
    publicKey
    keyUploadTimestamp
    keyUploadTx
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

export const ManyTokenTransfersQuery = graphql(`
  query manyTokenTransfers(
    $first: Int!
    $skip: Int!
    $orderBy: TokenTransfer_orderBy
    $orderDirection: OrderDirection
    $where: TokenTransfer_filter
  ) {
    tokenTransfers(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...TokenTransferFields
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

export const ManyOperatorDelegatorsQuery = graphql(`
  query manyOperatorDelegators(
    $first: Int!
    $skip: Int!
    $orderBy: OperatorDelegator_orderBy
    $orderDirection: OrderDirection
    $where: OperatorDelegator_filter
  ) {
    operatorDelegators(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...OperatorDelegatorFields
    }
  }
`);

export const ManyValidatorsQuery = graphql(`
  query manyValidators(
    $first: Int!
    $skip: Int!
    $orderBy: Validator_orderBy
    $orderDirection: OrderDirection
    $where: Validator_filter
  ) {
    validators(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...ValidatorFields
    }
  }
`);

//#endregion
