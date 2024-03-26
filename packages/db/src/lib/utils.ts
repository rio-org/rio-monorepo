import { DrizzleConnectionConfigTypes } from '../types';

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
