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
  '\n  fragment TokenWrapperFields on TokenWrapper {\n    id\n    address\n    wrappedToken {\n      id\n    }\n    unwrappedToken {\n      id\n    }\n  }\n':
    types.TokenWrapperFieldsFragmentDoc,
  '\n  fragment LiquidRestakingTokenFields on LiquidRestakingToken {\n    id\n    address\n    symbol\n    name\n    createdTimestamp\n    totalSupply\n    gateway {\n      id\n    }\n    poolId\n    underlyingTokens(orderBy: index, orderDirection: asc) {\n      address\n      token {\n        symbol\n        name\n        wrapper {\n          ...TokenWrapperFields\n        }\n      }\n      index\n      strategy\n    }\n  }\n':
    types.LiquidRestakingTokenFieldsFragmentDoc,
  '\n  fragment JoinFields on Join {\n    id\n    type\n    sender\n    tokensIn {\n      id\n    }\n    amountsIn\n    amountOut\n    restakingToken {\n      id\n    }\n    timestamp\n    blockNumber\n    tx\n  }\n':
    types.JoinFieldsFragmentDoc,
  '\n  fragment ExitFields on Exit {\n    id\n    type\n    sender\n    tokensOut {\n      id\n    }\n    amountsOut\n    sharesOwed\n    amountIn\n    restakingToken {\n      id\n    }\n    timestamp\n    blockNumber\n    tx\n  }\n':
    types.ExitFieldsFragmentDoc,
  '\n  query issuer($id: ID!) {\n    issuer(id: $id) {\n      ...IssuerFields\n    }\n  }\n':
    types.IssuerDocument,
  '\n  query liquidRestakingToken($id: ID!) {\n    liquidRestakingToken(id: $id) {\n      ...LiquidRestakingTokenFields\n    }\n  }\n':
    types.LiquidRestakingTokenDocument,
  '\n  query tokenWrapper($id: ID!) {\n    tokenWrapper(id: $id) {\n      ...TokenWrapperFields\n    }\n  }\n':
    types.TokenWrapperDocument,
  '\n  query manyLiquidRestakingTokens(\n    $first: Int!\n    $skip: Int!\n    $orderBy: LiquidRestakingToken_orderBy\n    $orderDirection: OrderDirection\n    $where: LiquidRestakingToken_filter\n  ) {\n    liquidRestakingTokens(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...LiquidRestakingTokenFields\n    }\n  }\n':
    types.ManyLiquidRestakingTokensDocument,
  '\n  query manyTokenWrappers(\n    $first: Int!\n    $skip: Int!\n    $orderBy: TokenWrapper_orderBy\n    $orderDirection: OrderDirection\n    $where: TokenWrapper_filter\n  ) {\n    tokenWrappers(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...TokenWrapperFields\n    }\n  }\n':
    types.ManyTokenWrappersDocument,
  '\n  query manyJoins(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Join_orderBy\n    $orderDirection: OrderDirection\n    $where: Join_filter\n  ) {\n    joins(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...JoinFields\n    }\n  }\n':
    types.ManyJoinsDocument,
  '\n  query manyExits(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Exit_orderBy\n    $orderDirection: OrderDirection\n    $where: Exit_filter\n  ) {\n    exits(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...ExitFields\n    }\n  }\n':
    types.ManyExitsDocument
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
): typeof documents['\n  fragment IssuerFields on Issuer {\n    id\n    address\n    tokensIssued\n    tokens {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TokenWrapperFields on TokenWrapper {\n    id\n    address\n    wrappedToken {\n      id\n    }\n    unwrappedToken {\n      id\n    }\n  }\n'
): typeof documents['\n  fragment TokenWrapperFields on TokenWrapper {\n    id\n    address\n    wrappedToken {\n      id\n    }\n    unwrappedToken {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment LiquidRestakingTokenFields on LiquidRestakingToken {\n    id\n    address\n    symbol\n    name\n    createdTimestamp\n    totalSupply\n    gateway {\n      id\n    }\n    poolId\n    underlyingTokens(orderBy: index, orderDirection: asc) {\n      address\n      token {\n        symbol\n        name\n        wrapper {\n          ...TokenWrapperFields\n        }\n      }\n      index\n      strategy\n    }\n  }\n'
): typeof documents['\n  fragment LiquidRestakingTokenFields on LiquidRestakingToken {\n    id\n    address\n    symbol\n    name\n    createdTimestamp\n    totalSupply\n    gateway {\n      id\n    }\n    poolId\n    underlyingTokens(orderBy: index, orderDirection: asc) {\n      address\n      token {\n        symbol\n        name\n        wrapper {\n          ...TokenWrapperFields\n        }\n      }\n      index\n      strategy\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment JoinFields on Join {\n    id\n    type\n    sender\n    tokensIn {\n      id\n    }\n    amountsIn\n    amountOut\n    restakingToken {\n      id\n    }\n    timestamp\n    blockNumber\n    tx\n  }\n'
): typeof documents['\n  fragment JoinFields on Join {\n    id\n    type\n    sender\n    tokensIn {\n      id\n    }\n    amountsIn\n    amountOut\n    restakingToken {\n      id\n    }\n    timestamp\n    blockNumber\n    tx\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ExitFields on Exit {\n    id\n    type\n    sender\n    tokensOut {\n      id\n    }\n    amountsOut\n    sharesOwed\n    amountIn\n    restakingToken {\n      id\n    }\n    timestamp\n    blockNumber\n    tx\n  }\n'
): typeof documents['\n  fragment ExitFields on Exit {\n    id\n    type\n    sender\n    tokensOut {\n      id\n    }\n    amountsOut\n    sharesOwed\n    amountIn\n    restakingToken {\n      id\n    }\n    timestamp\n    blockNumber\n    tx\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query issuer($id: ID!) {\n    issuer(id: $id) {\n      ...IssuerFields\n    }\n  }\n'
): typeof documents['\n  query issuer($id: ID!) {\n    issuer(id: $id) {\n      ...IssuerFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query liquidRestakingToken($id: ID!) {\n    liquidRestakingToken(id: $id) {\n      ...LiquidRestakingTokenFields\n    }\n  }\n'
): typeof documents['\n  query liquidRestakingToken($id: ID!) {\n    liquidRestakingToken(id: $id) {\n      ...LiquidRestakingTokenFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query tokenWrapper($id: ID!) {\n    tokenWrapper(id: $id) {\n      ...TokenWrapperFields\n    }\n  }\n'
): typeof documents['\n  query tokenWrapper($id: ID!) {\n    tokenWrapper(id: $id) {\n      ...TokenWrapperFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query manyLiquidRestakingTokens(\n    $first: Int!\n    $skip: Int!\n    $orderBy: LiquidRestakingToken_orderBy\n    $orderDirection: OrderDirection\n    $where: LiquidRestakingToken_filter\n  ) {\n    liquidRestakingTokens(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...LiquidRestakingTokenFields\n    }\n  }\n'
): typeof documents['\n  query manyLiquidRestakingTokens(\n    $first: Int!\n    $skip: Int!\n    $orderBy: LiquidRestakingToken_orderBy\n    $orderDirection: OrderDirection\n    $where: LiquidRestakingToken_filter\n  ) {\n    liquidRestakingTokens(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...LiquidRestakingTokenFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query manyTokenWrappers(\n    $first: Int!\n    $skip: Int!\n    $orderBy: TokenWrapper_orderBy\n    $orderDirection: OrderDirection\n    $where: TokenWrapper_filter\n  ) {\n    tokenWrappers(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...TokenWrapperFields\n    }\n  }\n'
): typeof documents['\n  query manyTokenWrappers(\n    $first: Int!\n    $skip: Int!\n    $orderBy: TokenWrapper_orderBy\n    $orderDirection: OrderDirection\n    $where: TokenWrapper_filter\n  ) {\n    tokenWrappers(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...TokenWrapperFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query manyJoins(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Join_orderBy\n    $orderDirection: OrderDirection\n    $where: Join_filter\n  ) {\n    joins(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...JoinFields\n    }\n  }\n'
): typeof documents['\n  query manyJoins(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Join_orderBy\n    $orderDirection: OrderDirection\n    $where: Join_filter\n  ) {\n    joins(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...JoinFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query manyExits(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Exit_orderBy\n    $orderDirection: OrderDirection\n    $where: Exit_filter\n  ) {\n    exits(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...ExitFields\n    }\n  }\n'
): typeof documents['\n  query manyExits(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Exit_orderBy\n    $orderDirection: OrderDirection\n    $where: Exit_filter\n  ) {\n    exits(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...ExitFields\n    }\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
