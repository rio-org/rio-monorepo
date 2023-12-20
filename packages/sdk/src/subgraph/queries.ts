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

export const TokenWrapperFields = graphql(`
  fragment TokenWrapperFields on TokenWrapper {
    id
    address
    wrappedToken {
      id
    }
    unwrappedToken {
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
    gateway {
      id
    }
    poolId
    underlyingTokens(orderBy: index, orderDirection: asc) {
      address
      token {
        symbol
        name
        wrapper {
          ...TokenWrapperFields
        }
      }
      index
      strategy
    }
  }
`);

export const JoinFields = graphql(`
  fragment JoinFields on Join {
    id
    type
    sender
    tokensIn {
      id
    }
    amountsIn
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

export const ExitFields = graphql(`
  fragment ExitFields on Exit {
    id
    type
    sender
    tokensOut {
      id
    }
    amountsOut
    sharesOwed
    amountIn
    restakingToken {
      id
    }
    userBalanceAfter
    timestamp
    blockNumber
    tx
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

export const TokenWrapperQuery = graphql(`
  query tokenWrapper($id: ID!) {
    tokenWrapper(id: $id) {
      ...TokenWrapperFields
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

export const ManyTokenWrappers = graphql(`
  query manyTokenWrappers(
    $first: Int!
    $skip: Int!
    $orderBy: TokenWrapper_orderBy
    $orderDirection: OrderDirection
    $where: TokenWrapper_filter
  ) {
    tokenWrappers(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...TokenWrapperFields
    }
  }
`);

export const ManyJoinsQuery = graphql(`
  query manyJoins(
    $first: Int!
    $skip: Int!
    $orderBy: Join_orderBy
    $orderDirection: OrderDirection
    $where: Join_filter
  ) {
    joins(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...JoinFields
    }
  }
`);

export const ManyExitsQuery = graphql(`
  query manyExits(
    $first: Int!
    $skip: Int!
    $orderBy: Exit_orderBy
    $orderDirection: OrderDirection
    $where: Exit_filter
  ) {
    exits(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      ...ExitFields
    }
  }
`);

//#endregion
