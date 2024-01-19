import { json, Bytes, dataSource } from '@graphprotocol/graph-ts';
import { OperatorMetadata } from '../generated/schema';

export function handleOperatorMetadata(content: Bytes): void {
  const operatorMetadata = new OperatorMetadata(dataSource.stringParam());
  const value = json.fromBytes(content).toObject();
  if (value) {
    const name = value.get('name');
    const website = value.get('website');
    const description = value.get('description');
    const logo = value.get('logo');
    const twitter = value.get('twitter');

    if (name) operatorMetadata.name = name.toString();
    if (website) operatorMetadata.website = website.toString();
    if (description) operatorMetadata.description = description.toString();
    if (logo) operatorMetadata.logo = logo.toString();
    if (twitter) operatorMetadata.twitter = twitter.toString();

    operatorMetadata.save();
  }
}
