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
