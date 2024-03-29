import { DrizzleConnectionConfigTypes } from '../types';
import { asc, desc } from 'drizzle-orm';

export const getOrderOperators = () => {
  return {
    desc,
    asc,
  };
};

export const getConnectionString = <
  T extends
    | DrizzleConnectionConfigTypes['INDIVIDUAL']
    | DrizzleConnectionConfigTypes['CONNECTION_STRING'],
>({
  user,
  database,
  password,
  port,
  host,
  connectionString,
}: T) =>
  connectionString ??
  `postgres://${user}:${password}@${host}:${port}/${database}`;
