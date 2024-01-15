import { gql } from '@apollo/client';
import { EthereumAddress } from './typings';

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

export const getLiquidRestakingTokenList = () => {
  return gql`
    query getLiquidRestakingTokenList {
      liquidRestakingTokens {
        id
        symbol
        name
        address
        percentAPY
        totalSupply
        totalValueUSD
        totalValueETH
        underlyingAssets {
          strategy
          balance
          asset {
            id
            name
            symbol
            decimals
            latestUSDPrice
            latestUSDPriceTimestamp
          }
        }
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
        userBalanceAfter
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
        userBalanceAfter
        user {
          address
        }
      }
    }
  `;
};
