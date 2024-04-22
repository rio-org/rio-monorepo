import { gql } from '@apollo/client';
import { Address } from 'viem';

export const getAssetList = () => {
  return gql`
    query getAssetList {
      liquidRestakingTokens {
        id
        address
        name
        symbol
      }
      assets {
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
        totalSupply
        totalValueUSD
        totalValueETH
        exchangeRateETH
        exchangeRateUSD
        underlyingAssets {
          strategy
          balance
          address
          asset {
            id
            name
            symbol
            address
            decimals
            latestUSDPrice
            latestUSDPriceTimestamp
          }
        }
      }
    }
  `;
};

export const getLatestAssetUSDPrice = (tokenAddress: Address) => {
  return gql`
    query getLatestAssetUSDPrice {
      asset(id: "${tokenAddress.toLowerCase()}") {
        id
        address
        name
        symbol
        decimals
        latestUSDPrice
        latestUSDPriceTimestamp
      }
    }
  `;
};

export const getUserExits = (address: Address) => {
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

export const getUserTxHistory = (address: Address) => {
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
