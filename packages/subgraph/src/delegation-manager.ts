import { OperatorMetadata as OperatorMetadataTemplate } from '../generated/templates';
import { OperatorDetailsModified, OperatorMetadataURIUpdated } from '../generated/DelegationManager/DelegationManager';
import { getIPFSContentID } from './helpers/utils';
import { Operator } from '../generated/schema';
import { log } from '@graphprotocol/graph-ts';

export function handleOperatorMetadataURIUpdated(event: OperatorMetadataURIUpdated): void {
  const operator = Operator.load(event.params.operator.toHex());
  if (!operator) {
    return;
  }

  const contentId = getIPFSContentID(event.params.metadataURI);
  if (!contentId) {
    log.warning('[handleOperatorMetadataURIUpdated] Could not parse content ID from: {}', [event.params.metadataURI]);
    return;
  }
  
  operator.metadataURI = event.params.metadataURI;
  operator.metadata = contentId;

  OperatorMetadataTemplate.create(operator.metadataURI);

  operator.save();
}

export function handleOperatorDetailsModified(event: OperatorDetailsModified): void {
  const operator = Operator.load(event.params.operator.toHex());
  if (!operator) {
    return;
  }
  
  operator.delegationApprover = event.params.newOperatorDetails.delegationApprover;
  operator.stakerOptOutWindowBlocks = event.params.newOperatorDetails.stakerOptOutWindowBlocks;
  operator.save();
}
