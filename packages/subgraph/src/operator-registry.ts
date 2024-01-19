import { OperatorAdded } from '../generated/templates/OperatorRegistry/RioLRTOperatorRegistry';
import { DelegationManager } from '../generated/DelegationManager/DelegationManager';
import { Address, Bytes, dataSource } from '@graphprotocol/graph-ts';
import { OperatorRegistry, Operator } from '../generated/schema';
import { DELEGATION_MANAGERS } from './helpers/constants';
import { getOperatorID } from './helpers/utils';

export function handleOperatorAdded(event: OperatorAdded): void {
  const operatorRegistry = OperatorRegistry.load(event.address.toHex())!;

  const delegationManager = Bytes.fromHexString(DELEGATION_MANAGERS.get(dataSource.network()));
  const delegationManagerContract = DelegationManager.bind(changetype<Address>(delegationManager));

  const operatorDetails = delegationManagerContract.try_operatorDetails(event.params.operator);

  const operator = new Operator(getOperatorID(operatorRegistry.restakingToken, event.params.operatorId));
  operator.operatorId = event.params.operatorId;
  operator.address = event.params.operator;
  operator.delegator = event.params.delegator;
  operator.manager = event.params.initialManager;
  operator.earningsReceiver = event.params.initialEarningsReceiver;
  operator.restakingToken = operatorRegistry.restakingToken;

  if (!operatorDetails.reverted) {
    operator.delegationApprover = operatorDetails.value.delegationApprover;
    operator.stakerOptOutWindowBlocks = operatorDetails.value.stakerOptOutWindowBlocks;
  }
  operator.save();
}
