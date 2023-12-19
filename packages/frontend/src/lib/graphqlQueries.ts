import { gql } from '@apollo/client';
import { EthereumAddress } from './typings';

// Demo Query
export const getProposalsByDao = (
  collectionAddress: EthereumAddress,
  amount: number
) => {
  return gql`
  query getProposal {
    proposals(where: {dao: "${collectionAddress}"}, first: ${amount}) {
      id
      title
      description
    }
  }`;
};

export const getAssetList = () => {
  return gql`
    query getAssetList {
      liquidRestakingTokens {
        id
        address
        name
        symbol
      }
      tokens {
        id
        address
        name
        symbol
        decimals
      }
    }
  `;
};

export const getLatestAssetUSDPrice = (tokenAddress: EthereumAddress) => {
  return gql`
    query getLatestAssetUSDPrice {
      token(id: "${tokenAddress}") {
        address
        symbol
        latestUSDPrice
        latestUSDPriceTimestamp
      }
    }
  `;
};

export const getUserExits = (address: EthereumAddress) => {
  return gql`
    query getUserExits {
      exits(
        first: 1000
        where: {user:  "${address.toLowerCase()}"}) {
          type
          sharesOwed
          id
          amountIn
          amountsOut
          tx
          valueUSD
          timestamp
          tokensOut {
            symbol
            latestUSDPrice
            latestUSDPriceTimestamp
          }
      }
    }
  `;
};

export const getUserTxHistory = (address: EthereumAddress) => {
  return gql`
    query getUserTxHistory {
      joins(
        first: 1000
        where: {user: "${address.toLowerCase()}"}
      ) {
        amountOut
        amountsIn
        tx
        timestamp
        type
        valueUSD
        user {
          address
        }
      }
      exits(
        first: 1000
        where: {user: "${address.toLowerCase()}"}
      ) {
        
        amountIn
        tx
        timestamp
        type
        valueUSD
        user {
          address
        }
      }
    }
  `;
};
