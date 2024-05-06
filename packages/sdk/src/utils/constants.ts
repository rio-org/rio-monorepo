/**
 * The ETH pseudo-address.
 */
export const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

/**
 * The scalar of ETH and most ERC20s.
 */
export const WAD = 10n ** 18n;

/**
 * Mapping of token addresses for each supported chain ID.
 */
export const TOKEN_ADDRESSES_WITH_CHAINS = {
    1: {
      rn: '0x3c61297E71E9bB04b9fBfead72A6d3c70e4f1E4A',
      reeth: '0x', // To do: contract address needs to be added when deployed
    },
    17000: {
      rn: '0x',
      reeth: '0x84a63F1025b8f1B54dAAd3083A54678E31604973',
    },
  };
