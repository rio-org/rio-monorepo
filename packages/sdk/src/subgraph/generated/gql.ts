/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  fragment IssuerFields on Issuer {\n    id\n    address\n    tokensIssued\n    tokens {\n      id\n    }\n  }\n':
    types.IssuerFieldsFragmentDoc,
  '\n  fragment LiquidRestakingTokenFields on LiquidRestakingToken {\n    id\n    address\n    symbol\n    name\n    createdTimestamp\n    totalSupply\n    coordinator {\n      id\n    }\n    underlyingAssets {\n      address\n      asset {\n        symbol\n        name\n      }\n      strategy\n      priceFeed\n      depositCap\n      balance\n    }\n  }\n':
    types.LiquidRestakingTokenFieldsFragmentDoc,
  '\n  fragment DepositFields on Deposit {\n    id\n    sender\n    assetIn {\n      id\n    }\n    amountIn\n    amountOut\n    restakingToken {\n      id\n    }\n    userBalanceAfter\n    timestamp\n    blockNumber\n    tx\n  }\n':
    types.DepositFieldsFragmentDoc,
  '\n  fragment WithdrawalFields on Withdrawal {\n    id\n    sender\n    assetOut {\n      id\n    }\n    sharesOwed\n    amountIn\n    restakingToken {\n      id\n    }\n    userBalanceAfter\n    timestamp\n    blockNumber\n    requestTx\n\n    isReadyToClaim\n    isClaimed\n    amountOut\n    claimTx\n  }\n':
    types.WithdrawalFieldsFragmentDoc,
  '\n  query issuer($id: ID!) {\n    issuer(id: $id) {\n      ...IssuerFields\n    }\n  }\n':
    types.IssuerDocument,
  '\n  query liquidRestakingToken($id: ID!) {\n    liquidRestakingToken(id: $id) {\n      ...LiquidRestakingTokenFields\n    }\n  }\n':
    types.LiquidRestakingTokenDocument,
  '\n  query manyLiquidRestakingTokens(\n    $first: Int!\n    $skip: Int!\n    $orderBy: LiquidRestakingToken_orderBy\n    $orderDirection: OrderDirection\n    $where: LiquidRestakingToken_filter\n  ) {\n    liquidRestakingTokens(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...LiquidRestakingTokenFields\n    }\n  }\n':
    types.ManyLiquidRestakingTokensDocument,
  '\n  query manyDeposits(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Deposit_orderBy\n    $orderDirection: OrderDirection\n    $where: Deposit_filter\n  ) {\n    deposits(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...DepositFields\n    }\n  }\n':
    types.ManyDepositsDocument,
  '\n  query manyWithdrawals(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Withdrawal_orderBy\n    $orderDirection: OrderDirection\n    $where: Withdrawal_filter\n  ) {\n    withdrawals(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...WithdrawalFields\n    }\n  }\n':
    types.ManyWithdrawalsDocument
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment IssuerFields on Issuer {\n    id\n    address\n    tokensIssued\n    tokens {\n      id\n    }\n  }\n'
): (typeof documents)['\n  fragment IssuerFields on Issuer {\n    id\n    address\n    tokensIssued\n    tokens {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment LiquidRestakingTokenFields on LiquidRestakingToken {\n    id\n    address\n    symbol\n    name\n    createdTimestamp\n    totalSupply\n    coordinator {\n      id\n    }\n    underlyingAssets {\n      address\n      asset {\n        symbol\n        name\n      }\n      strategy\n      priceFeed\n      depositCap\n      balance\n    }\n  }\n'
): (typeof documents)['\n  fragment LiquidRestakingTokenFields on LiquidRestakingToken {\n    id\n    address\n    symbol\n    name\n    createdTimestamp\n    totalSupply\n    coordinator {\n      id\n    }\n    underlyingAssets {\n      address\n      asset {\n        symbol\n        name\n      }\n      strategy\n      priceFeed\n      depositCap\n      balance\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment DepositFields on Deposit {\n    id\n    sender\n    assetIn {\n      id\n    }\n    amountIn\n    amountOut\n    restakingToken {\n      id\n    }\n    userBalanceAfter\n    timestamp\n    blockNumber\n    tx\n  }\n'
): (typeof documents)['\n  fragment DepositFields on Deposit {\n    id\n    sender\n    assetIn {\n      id\n    }\n    amountIn\n    amountOut\n    restakingToken {\n      id\n    }\n    userBalanceAfter\n    timestamp\n    blockNumber\n    tx\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment WithdrawalFields on Withdrawal {\n    id\n    sender\n    assetOut {\n      id\n    }\n    sharesOwed\n    amountIn\n    restakingToken {\n      id\n    }\n    userBalanceAfter\n    timestamp\n    blockNumber\n    requestTx\n\n    isReadyToClaim\n    isClaimed\n    amountOut\n    claimTx\n  }\n'
): (typeof documents)['\n  fragment WithdrawalFields on Withdrawal {\n    id\n    sender\n    assetOut {\n      id\n    }\n    sharesOwed\n    amountIn\n    restakingToken {\n      id\n    }\n    userBalanceAfter\n    timestamp\n    blockNumber\n    requestTx\n\n    isReadyToClaim\n    isClaimed\n    amountOut\n    claimTx\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query issuer($id: ID!) {\n    issuer(id: $id) {\n      ...IssuerFields\n    }\n  }\n'
): (typeof documents)['\n  query issuer($id: ID!) {\n    issuer(id: $id) {\n      ...IssuerFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query liquidRestakingToken($id: ID!) {\n    liquidRestakingToken(id: $id) {\n      ...LiquidRestakingTokenFields\n    }\n  }\n'
): (typeof documents)['\n  query liquidRestakingToken($id: ID!) {\n    liquidRestakingToken(id: $id) {\n      ...LiquidRestakingTokenFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query manyLiquidRestakingTokens(\n    $first: Int!\n    $skip: Int!\n    $orderBy: LiquidRestakingToken_orderBy\n    $orderDirection: OrderDirection\n    $where: LiquidRestakingToken_filter\n  ) {\n    liquidRestakingTokens(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...LiquidRestakingTokenFields\n    }\n  }\n'
): (typeof documents)['\n  query manyLiquidRestakingTokens(\n    $first: Int!\n    $skip: Int!\n    $orderBy: LiquidRestakingToken_orderBy\n    $orderDirection: OrderDirection\n    $where: LiquidRestakingToken_filter\n  ) {\n    liquidRestakingTokens(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...LiquidRestakingTokenFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query manyDeposits(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Deposit_orderBy\n    $orderDirection: OrderDirection\n    $where: Deposit_filter\n  ) {\n    deposits(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...DepositFields\n    }\n  }\n'
): (typeof documents)['\n  query manyDeposits(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Deposit_orderBy\n    $orderDirection: OrderDirection\n    $where: Deposit_filter\n  ) {\n    deposits(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...DepositFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query manyWithdrawals(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Withdrawal_orderBy\n    $orderDirection: OrderDirection\n    $where: Withdrawal_filter\n  ) {\n    withdrawals(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...WithdrawalFields\n    }\n  }\n'
): (typeof documents)['\n  query manyWithdrawals(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Withdrawal_orderBy\n    $orderDirection: OrderDirection\n    $where: Withdrawal_filter\n  ) {\n    withdrawals(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...WithdrawalFields\n    }\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
