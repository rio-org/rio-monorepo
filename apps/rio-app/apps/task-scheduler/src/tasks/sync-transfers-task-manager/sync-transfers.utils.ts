import { Injectable } from '@nestjs/common';
import { Deposit, TokenTransfer, WithdrawalRequest } from '@rionetwork/sdk';
import { parseEther, zeroAddress } from 'viem';
import {
  Deposit_OrderBy,
  OrderDirection,
  TokenTransfer_OrderBy,
  WithdrawalRequest_OrderBy,
} from '@rionetwork/sdk/dist/subgraph/generated/graphql';

@Injectable()
export class SyncTransfersUtils {
  /**
   * Creates a deposit row
   * @param chainId The chain id
   * @param symbol The symbol
   * @param deposit The deposit object
   */
  parseDeposit(chainId: number, symbol: string, deposit: Deposit) {
    return {
      chainId,
      blockNumber: +deposit.blockNumber,
      txHash: deposit.tx,
      from: zeroAddress,
      to: deposit.sender,
      value: parseEther(deposit.amountOut).toString(),
      asset: symbol,
      timestamp: new Date(+deposit.timestamp * 1000),
    };
  }

  /**
   * Creates a withdrawal row
   * @param chainId The chain id
   * @param symbol The symbol
   * @param withdrawal The withdrawal request object
   */
  parseWithdrawal(
    chainId: number,
    symbol: string,
    withdrawal: WithdrawalRequest,
  ) {
    return {
      chainId,
      blockNumber: +withdrawal.blockNumber,
      txHash: withdrawal.tx,
      from: withdrawal.sender,
      to: zeroAddress,
      value: parseEther(withdrawal.amountIn).toString(),
      asset: symbol,
      timestamp: new Date(+withdrawal.timestamp * 1000),
    };
  }

  /**
   * Creates a token transfer row
   * @param chainId The chain id
   * @param symbol The symbol
   * @param transfer The token transfer object
   */
  parseTokenTransfer(chainId: number, symbol: string, transfer: TokenTransfer) {
    return {
      chainId,
      blockNumber: +transfer.blockNumber,
      txHash: transfer.tx,
      from: transfer.sender,
      to: transfer.receiver,
      value: parseEther(transfer.amount).toString(),
      asset: symbol,
      timestamp: new Date(+transfer.timestamp * 1000),
    };
  }

  /**
   * Builds the query to pull data in a batch
   * @param blockNumber The block number
   * @param batchSize The batch size
   */
  buildBatchQueryConfigs(blockNumber: number, batchSize: number) {
    const common = {
      where: {
        blockNumber_gt: blockNumber,
        blockNumber_lte: blockNumber + batchSize,
      },
      perPage: 100,
      orderDirection: OrderDirection.Asc,
    };
    return {
      deposits: {
        ...common,
        orderBy: Deposit_OrderBy.BlockNumber,
      },
      withdrawals: {
        ...common,
        orderBy: WithdrawalRequest_OrderBy.BlockNumber,
      },
      transfers: {
        ...common,
        orderBy: TokenTransfer_OrderBy.BlockNumber,
      },
    };
  }
}
