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
  '\n  fragment LiquidRestakingTokenFields on LiquidRestakingToken {\n    id\n    address\n    symbol\n    name\n    createdTimestamp\n    totalSupply\n    totalValueETH\n    totalValueUSD\n    exchangeRateETH\n    exchangeRateUSD\n    underlyingAssets {\n      address\n      asset {\n        latestUSDPrice\n        latestUSDPriceTimestamp\n        symbol\n        name\n      }\n      strategy\n      depositCap\n      balance\n    }\n    coordinator {\n      id\n    }\n    assetRegistry {\n      id\n    }\n    operatorRegistry {\n      id\n    }\n    avsRegistry {\n      id\n    }\n    depositPool {\n      id\n    }\n    withdrawalQueue {\n      id\n    }\n    rewardDistributor {\n      id\n    }\n  }\n':
    types.LiquidRestakingTokenFieldsFragmentDoc,
  '\n  fragment DepositFields on Deposit {\n    id\n    sender\n    assetIn {\n      id\n    }\n    amountIn\n    amountOut\n    restakingToken {\n      id\n    }\n    restakingTokenPriceUSD\n    userBalanceAfter\n    valueUSD\n    timestamp\n    blockNumber\n    tx\n  }\n':
    types.DepositFieldsFragmentDoc,
  '\n  fragment TokenTransferFields on TokenTransfer {\n    id\n    receiver {\n      id\n    }\n    sender {\n      id\n    }\n    restakingToken {\n      id\n    }\n    amount\n    restakingTokenPriceUSD\n    senderBalanceBefore\n    senderBalanceAfter\n    receiverBalanceBefore\n    receiverBalanceAfter\n    valueUSD\n    timestamp\n    blockNumber\n    tx\n  }\n':
    types.TokenTransferFieldsFragmentDoc,
  '\n  fragment WithdrawalRequestFields on WithdrawalRequest {\n    id\n    sender\n    epoch {\n      epoch\n      status\n      sharesOwed\n      assetsReceived\n    }\n    assetOut {\n      id\n    }\n    sharesOwed\n    amountIn\n    restakingToken {\n      id\n    }\n    restakingTokenPriceUSD\n    userBalanceAfter\n    valueUSD\n    timestamp\n    blockNumber\n    tx\n\n    isClaimed\n    claim {\n      id\n      tx\n    }\n  }\n':
    types.WithdrawalRequestFieldsFragmentDoc,
  '\n  fragment WithdrawalClaimFields on WithdrawalClaim {\n    id\n    sender\n    epoch {\n      epoch\n    }\n    assetOut {\n      id\n    }\n    amountOut\n    restakingToken {\n      id\n    }\n    restakingTokenPriceUSD\n    requests {\n      id\n    }\n    valueUSD\n    timestamp\n    blockNumber\n    tx\n  }\n':
    types.WithdrawalClaimFieldsFragmentDoc,
  '\n  fragment OperatorDelegatorFields on OperatorDelegator {\n    id\n    delegatorId\n    address\n    operator {\n      address\n      metadataURI\n      metadata {\n        name\n        website\n        description\n        logo\n        twitter\n      }\n      delegationApprover\n      stakerOptOutWindowBlocks\n    }\n    manager\n    earningsReceiver\n    unusedValidatorKeyCount\n    depositedValidatorKeyCount\n    exitedValidatorKeyCount\n    totalValidatorKeyCount\n    restakingToken {\n      id\n    }\n  }\n':
    types.OperatorDelegatorFieldsFragmentDoc,
  '\n  fragment ValidatorFields on Validator {\n    id\n    status\n    delegator {\n      id\n    }\n    keyIndex\n    publicKey\n    keyUploadTimestamp\n    keyUploadTx\n  }\n':
    types.ValidatorFieldsFragmentDoc,
  '\n  query issuer($id: ID!) {\n    issuer(id: $id) {\n      ...IssuerFields\n    }\n  }\n':
    types.IssuerDocument,
  '\n  query liquidRestakingToken($id: ID!) {\n    liquidRestakingToken(id: $id) {\n      ...LiquidRestakingTokenFields\n    }\n  }\n':
    types.LiquidRestakingTokenDocument,
  '\n  query manyLiquidRestakingTokens(\n    $first: Int!\n    $skip: Int!\n    $orderBy: LiquidRestakingToken_orderBy\n    $orderDirection: OrderDirection\n    $where: LiquidRestakingToken_filter\n  ) {\n    liquidRestakingTokens(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...LiquidRestakingTokenFields\n    }\n  }\n':
    types.ManyLiquidRestakingTokensDocument,
  '\n  query manyDeposits(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Deposit_orderBy\n    $orderDirection: OrderDirection\n    $where: Deposit_filter\n  ) {\n    deposits(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...DepositFields\n    }\n  }\n':
    types.ManyDepositsDocument,
  '\n  query manyTokenTransfers(\n    $first: Int!\n    $skip: Int!\n    $orderBy: TokenTransfer_orderBy\n    $orderDirection: OrderDirection\n    $where: TokenTransfer_filter\n  ) {\n    tokenTransfers(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...TokenTransferFields\n    }\n  }\n':
    types.ManyTokenTransfersDocument,
  '\n  query manyWithdrawalRequests(\n    $first: Int!\n    $skip: Int!\n    $orderBy: WithdrawalRequest_orderBy\n    $orderDirection: OrderDirection\n    $where: WithdrawalRequest_filter\n  ) {\n    withdrawalRequests(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...WithdrawalRequestFields\n    }\n  }\n':
    types.ManyWithdrawalRequestsDocument,
  '\n  query manyWithdrawalClaims(\n    $first: Int!\n    $skip: Int!\n    $orderBy: WithdrawalClaim_orderBy\n    $orderDirection: OrderDirection\n    $where: WithdrawalClaim_filter\n  ) {\n    withdrawalClaims(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...WithdrawalClaimFields\n    }\n  }\n':
    types.ManyWithdrawalClaimsDocument,
  '\n  query manyOperatorDelegators(\n    $first: Int!\n    $skip: Int!\n    $orderBy: OperatorDelegator_orderBy\n    $orderDirection: OrderDirection\n    $where: OperatorDelegator_filter\n  ) {\n    operatorDelegators(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...OperatorDelegatorFields\n    }\n  }\n':
    types.ManyOperatorDelegatorsDocument,
  '\n  query manyValidators(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Validator_orderBy\n    $orderDirection: OrderDirection\n    $where: Validator_filter\n  ) {\n    validators(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...ValidatorFields\n    }\n  }\n':
    types.ManyValidatorsDocument
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
  source: '\n  fragment LiquidRestakingTokenFields on LiquidRestakingToken {\n    id\n    address\n    symbol\n    name\n    createdTimestamp\n    totalSupply\n    totalValueETH\n    totalValueUSD\n    exchangeRateETH\n    exchangeRateUSD\n    underlyingAssets {\n      address\n      asset {\n        latestUSDPrice\n        latestUSDPriceTimestamp\n        symbol\n        name\n      }\n      strategy\n      depositCap\n      balance\n    }\n    coordinator {\n      id\n    }\n    assetRegistry {\n      id\n    }\n    operatorRegistry {\n      id\n    }\n    avsRegistry {\n      id\n    }\n    depositPool {\n      id\n    }\n    withdrawalQueue {\n      id\n    }\n    rewardDistributor {\n      id\n    }\n  }\n'
): (typeof documents)['\n  fragment LiquidRestakingTokenFields on LiquidRestakingToken {\n    id\n    address\n    symbol\n    name\n    createdTimestamp\n    totalSupply\n    totalValueETH\n    totalValueUSD\n    exchangeRateETH\n    exchangeRateUSD\n    underlyingAssets {\n      address\n      asset {\n        latestUSDPrice\n        latestUSDPriceTimestamp\n        symbol\n        name\n      }\n      strategy\n      depositCap\n      balance\n    }\n    coordinator {\n      id\n    }\n    assetRegistry {\n      id\n    }\n    operatorRegistry {\n      id\n    }\n    avsRegistry {\n      id\n    }\n    depositPool {\n      id\n    }\n    withdrawalQueue {\n      id\n    }\n    rewardDistributor {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment DepositFields on Deposit {\n    id\n    sender\n    assetIn {\n      id\n    }\n    amountIn\n    amountOut\n    restakingToken {\n      id\n    }\n    restakingTokenPriceUSD\n    userBalanceAfter\n    valueUSD\n    timestamp\n    blockNumber\n    tx\n  }\n'
): (typeof documents)['\n  fragment DepositFields on Deposit {\n    id\n    sender\n    assetIn {\n      id\n    }\n    amountIn\n    amountOut\n    restakingToken {\n      id\n    }\n    restakingTokenPriceUSD\n    userBalanceAfter\n    valueUSD\n    timestamp\n    blockNumber\n    tx\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TokenTransferFields on TokenTransfer {\n    id\n    receiver {\n      id\n    }\n    sender {\n      id\n    }\n    restakingToken {\n      id\n    }\n    amount\n    restakingTokenPriceUSD\n    senderBalanceBefore\n    senderBalanceAfter\n    receiverBalanceBefore\n    receiverBalanceAfter\n    valueUSD\n    timestamp\n    blockNumber\n    tx\n  }\n'
): (typeof documents)['\n  fragment TokenTransferFields on TokenTransfer {\n    id\n    receiver {\n      id\n    }\n    sender {\n      id\n    }\n    restakingToken {\n      id\n    }\n    amount\n    restakingTokenPriceUSD\n    senderBalanceBefore\n    senderBalanceAfter\n    receiverBalanceBefore\n    receiverBalanceAfter\n    valueUSD\n    timestamp\n    blockNumber\n    tx\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment WithdrawalRequestFields on WithdrawalRequest {\n    id\n    sender\n    epoch {\n      epoch\n      status\n      sharesOwed\n      assetsReceived\n    }\n    assetOut {\n      id\n    }\n    sharesOwed\n    amountIn\n    restakingToken {\n      id\n    }\n    restakingTokenPriceUSD\n    userBalanceAfter\n    valueUSD\n    timestamp\n    blockNumber\n    tx\n\n    isClaimed\n    claim {\n      id\n      tx\n    }\n  }\n'
): (typeof documents)['\n  fragment WithdrawalRequestFields on WithdrawalRequest {\n    id\n    sender\n    epoch {\n      epoch\n      status\n      sharesOwed\n      assetsReceived\n    }\n    assetOut {\n      id\n    }\n    sharesOwed\n    amountIn\n    restakingToken {\n      id\n    }\n    restakingTokenPriceUSD\n    userBalanceAfter\n    valueUSD\n    timestamp\n    blockNumber\n    tx\n\n    isClaimed\n    claim {\n      id\n      tx\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment WithdrawalClaimFields on WithdrawalClaim {\n    id\n    sender\n    epoch {\n      epoch\n    }\n    assetOut {\n      id\n    }\n    amountOut\n    restakingToken {\n      id\n    }\n    restakingTokenPriceUSD\n    requests {\n      id\n    }\n    valueUSD\n    timestamp\n    blockNumber\n    tx\n  }\n'
): (typeof documents)['\n  fragment WithdrawalClaimFields on WithdrawalClaim {\n    id\n    sender\n    epoch {\n      epoch\n    }\n    assetOut {\n      id\n    }\n    amountOut\n    restakingToken {\n      id\n    }\n    restakingTokenPriceUSD\n    requests {\n      id\n    }\n    valueUSD\n    timestamp\n    blockNumber\n    tx\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment OperatorDelegatorFields on OperatorDelegator {\n    id\n    delegatorId\n    address\n    operator {\n      address\n      metadataURI\n      metadata {\n        name\n        website\n        description\n        logo\n        twitter\n      }\n      delegationApprover\n      stakerOptOutWindowBlocks\n    }\n    manager\n    earningsReceiver\n    unusedValidatorKeyCount\n    depositedValidatorKeyCount\n    exitedValidatorKeyCount\n    totalValidatorKeyCount\n    restakingToken {\n      id\n    }\n  }\n'
): (typeof documents)['\n  fragment OperatorDelegatorFields on OperatorDelegator {\n    id\n    delegatorId\n    address\n    operator {\n      address\n      metadataURI\n      metadata {\n        name\n        website\n        description\n        logo\n        twitter\n      }\n      delegationApprover\n      stakerOptOutWindowBlocks\n    }\n    manager\n    earningsReceiver\n    unusedValidatorKeyCount\n    depositedValidatorKeyCount\n    exitedValidatorKeyCount\n    totalValidatorKeyCount\n    restakingToken {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ValidatorFields on Validator {\n    id\n    status\n    delegator {\n      id\n    }\n    keyIndex\n    publicKey\n    keyUploadTimestamp\n    keyUploadTx\n  }\n'
): (typeof documents)['\n  fragment ValidatorFields on Validator {\n    id\n    status\n    delegator {\n      id\n    }\n    keyIndex\n    publicKey\n    keyUploadTimestamp\n    keyUploadTx\n  }\n'];
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
  source: '\n  query manyTokenTransfers(\n    $first: Int!\n    $skip: Int!\n    $orderBy: TokenTransfer_orderBy\n    $orderDirection: OrderDirection\n    $where: TokenTransfer_filter\n  ) {\n    tokenTransfers(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...TokenTransferFields\n    }\n  }\n'
): (typeof documents)['\n  query manyTokenTransfers(\n    $first: Int!\n    $skip: Int!\n    $orderBy: TokenTransfer_orderBy\n    $orderDirection: OrderDirection\n    $where: TokenTransfer_filter\n  ) {\n    tokenTransfers(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...TokenTransferFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query manyWithdrawalRequests(\n    $first: Int!\n    $skip: Int!\n    $orderBy: WithdrawalRequest_orderBy\n    $orderDirection: OrderDirection\n    $where: WithdrawalRequest_filter\n  ) {\n    withdrawalRequests(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...WithdrawalRequestFields\n    }\n  }\n'
): (typeof documents)['\n  query manyWithdrawalRequests(\n    $first: Int!\n    $skip: Int!\n    $orderBy: WithdrawalRequest_orderBy\n    $orderDirection: OrderDirection\n    $where: WithdrawalRequest_filter\n  ) {\n    withdrawalRequests(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...WithdrawalRequestFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query manyWithdrawalClaims(\n    $first: Int!\n    $skip: Int!\n    $orderBy: WithdrawalClaim_orderBy\n    $orderDirection: OrderDirection\n    $where: WithdrawalClaim_filter\n  ) {\n    withdrawalClaims(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...WithdrawalClaimFields\n    }\n  }\n'
): (typeof documents)['\n  query manyWithdrawalClaims(\n    $first: Int!\n    $skip: Int!\n    $orderBy: WithdrawalClaim_orderBy\n    $orderDirection: OrderDirection\n    $where: WithdrawalClaim_filter\n  ) {\n    withdrawalClaims(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...WithdrawalClaimFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query manyOperatorDelegators(\n    $first: Int!\n    $skip: Int!\n    $orderBy: OperatorDelegator_orderBy\n    $orderDirection: OrderDirection\n    $where: OperatorDelegator_filter\n  ) {\n    operatorDelegators(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...OperatorDelegatorFields\n    }\n  }\n'
): (typeof documents)['\n  query manyOperatorDelegators(\n    $first: Int!\n    $skip: Int!\n    $orderBy: OperatorDelegator_orderBy\n    $orderDirection: OrderDirection\n    $where: OperatorDelegator_filter\n  ) {\n    operatorDelegators(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...OperatorDelegatorFields\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query manyValidators(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Validator_orderBy\n    $orderDirection: OrderDirection\n    $where: Validator_filter\n  ) {\n    validators(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...ValidatorFields\n    }\n  }\n'
): (typeof documents)['\n  query manyValidators(\n    $first: Int!\n    $skip: Int!\n    $orderBy: Validator_orderBy\n    $orderDirection: OrderDirection\n    $where: Validator_filter\n  ) {\n    validators(\n      first: $first\n      skip: $skip\n      orderBy: $orderBy\n      orderDirection: $orderDirection\n      where: $where\n    ) {\n      ...ValidatorFields\n    }\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
