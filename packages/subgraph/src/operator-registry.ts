import { OperatorAdded } from '../generated/templates/OperatorRegistry/RioLRTOperatorRegistry';
import { OperatorMetadata as OperatorMetadataTemplate } from '../generated/templates';
import { DelegationManager } from '../generated/DelegationManager/DelegationManager';
import { Address, Bytes, dataSource } from '@graphprotocol/graph-ts';
import { OperatorRegistry, Operator } from '../generated/schema';
import { DELEGATION_MANAGERS } from './helpers/constants';
import { getIPFSContentID } from './helpers/utils';

export function handleOperatorAdded(event: OperatorAdded): void {
  const operatorRegistry = OperatorRegistry.load(event.address.toHex())!;

  const delegationManager = Bytes.fromHexString(DELEGATION_MANAGERS.get(dataSource.network()));
  const delegationManagerContract = DelegationManager.bind(changetype<Address>(delegationManager));

  const operatorDetails = delegationManagerContract.try_operatorDetails(event.params.operator);

  // This handler makes the assumption that an operator will never receive delegations from
  // multiple delegator contracts, or across multiple LRTs. This assumption is made so that we can track
  // metadata and configuration updated without separating the delegator from the underlying operator.
  // In the future, we can separate these, if needed.
  const operator = new Operator(event.params.operator.toHex());
  operator.operatorId = event.params.operatorId;
  operator.address = event.params.operator;
  operator.delegator = event.params.delegator;
  operator.manager = event.params.initialManager;
  operator.earningsReceiver = event.params.initialEarningsReceiver;
  operator.metadataURI = event.params.initialMetadataURI;
  operator.metadata = getIPFSContentID(operator.metadataURI);
  operator.restakingToken = operatorRegistry.restakingToken;

  if (!operatorDetails.reverted) {
    operator.delegationApprover = operatorDetails.value.delegationApprover;
    operator.stakerOptOutWindowBlocks = operatorDetails.value.stakerOptOutWindowBlocks;
  }

  if (operator.metadata) {
    OperatorMetadataTemplate.create(operator.metadata!);
  }
  operator.save();
}
