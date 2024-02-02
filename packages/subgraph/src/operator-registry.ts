import { ETHDepositsAllocated, ETHDepositsDeallocated, OperatorAdded, ValidatorDetailsAdded, ValidatorDetailsRemoved } from '../generated/templates/OperatorRegistry/RioLRTOperatorRegistry';
import { OperatorMetadata as OperatorMetadataTemplate } from '../generated/templates';
import { DelegationManager } from '../generated/DelegationManager/DelegationManager';
import { Address, Bytes, dataSource, store } from '@graphprotocol/graph-ts';
import { OperatorRegistry, Operator, OperatorDelegator, Validator } from '../generated/schema';
import { DELEGATION_MANAGERS, ONE_BI, ValidatorStatus, ZERO_BI } from './helpers/constants';
import { getIPFSContentID, getOperatorDelegatorID, splitPublicKeys } from './helpers/utils';

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
  operator.address = event.params.operator;
  operator.metadataURI = event.params.initialMetadataURI;
  operator.metadata = getIPFSContentID(operator.metadataURI);

  if (!operatorDetails.reverted) {
    operator.delegationApprover = operatorDetails.value.delegationApprover;
    operator.stakerOptOutWindowBlocks = operatorDetails.value.stakerOptOutWindowBlocks;
  }

  if (operator.metadata) {
    OperatorMetadataTemplate.create(operator.metadata!);
  }
  operator.save();

  const operatorDelegator = new OperatorDelegator(getOperatorDelegatorID(operatorRegistry.id, event.params.operatorId));
  operatorDelegator.address = event.params.delegator;
  operatorDelegator.delegatorId = event.params.operatorId;
  operatorDelegator.operator = operator.id;
  operatorDelegator.manager = event.params.initialManager;
  operatorDelegator.earningsReceiver = event.params.initialEarningsReceiver;
  operatorDelegator.restakingToken = operatorRegistry.restakingToken;
  operatorDelegator.unusedValidatorKeyCount = ZERO_BI;
  operatorDelegator.depositedValidatorKeyCount = ZERO_BI;
  operatorDelegator.exitedValidatorKeyCount = ZERO_BI;
  operatorDelegator.totalValidatorKeyCount = ZERO_BI;
  operatorDelegator.save();
}

export function handleValidatorDetailsAdded(event: ValidatorDetailsAdded): void {
  const operatorDelegator = OperatorDelegator.load(getOperatorDelegatorID(event.address.toHex(), event.params.operatorId))!;
  operatorDelegator.unusedValidatorKeyCount = operatorDelegator.unusedValidatorKeyCount.plus(ONE_BI);
  operatorDelegator.totalValidatorKeyCount = operatorDelegator.totalValidatorKeyCount.plus(ONE_BI);
  operatorDelegator.save();

  const validator = new Validator(event.params.pubkey.toHex());
  validator.status = ValidatorStatus.UNUSED;
  validator.delegator = operatorDelegator.id;
  validator.publicKey = event.params.pubkey;
  validator.save();
}

export function handleValidatorDetailsRemoved(event: ValidatorDetailsRemoved): void {
  const operatorDelegator = OperatorDelegator.load(getOperatorDelegatorID(event.address.toHex(), event.params.operatorId))!;
  operatorDelegator.unusedValidatorKeyCount = operatorDelegator.unusedValidatorKeyCount.minus(ONE_BI);
  operatorDelegator.totalValidatorKeyCount = operatorDelegator.totalValidatorKeyCount.minus(ONE_BI);
  operatorDelegator.save();

  store.remove('Validator', event.params.pubkey.toHex());
}

export function handleETHDepositsAllocated(event: ETHDepositsAllocated): void {
  const operatorDelegator = OperatorDelegator.load(getOperatorDelegatorID(event.address.toHex(), event.params.operatorId))!;
  operatorDelegator.unusedValidatorKeyCount = operatorDelegator.unusedValidatorKeyCount.minus(event.params.depositsAllocated);
  operatorDelegator.depositedValidatorKeyCount = operatorDelegator.depositedValidatorKeyCount.plus(event.params.depositsAllocated);
  operatorDelegator.save();

  const publicKeys = splitPublicKeys(event.params.pubKeyBatch.toHex());
  for (let i = 0; i < publicKeys.length; i++) {
    const validator = Validator.load(event.params.pubKeyBatch.toHex())!;
    validator.status = ValidatorStatus.DEPOSITED;
    validator.save();
  }
}

export function handleETHDepositsDeallocated(event: ETHDepositsDeallocated): void {
  const operatorDelegator = OperatorDelegator.load(getOperatorDelegatorID(event.address.toHex(), event.params.operatorId))!;
  operatorDelegator.depositedValidatorKeyCount = operatorDelegator.depositedValidatorKeyCount.minus(event.params.depositsDeallocated);
  operatorDelegator.exitedValidatorKeyCount = operatorDelegator.exitedValidatorKeyCount.plus(event.params.depositsDeallocated);
  operatorDelegator.save();

  const publicKeys = splitPublicKeys(event.params.pubKeyBatch.toHex());
  for (let i = 0; i < publicKeys.length; i++) {
    const validator = Validator.load(event.params.pubKeyBatch.toHex())!;
    validator.status = ValidatorStatus.EXITED;
    validator.save();
  }
}
