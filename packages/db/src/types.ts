import { ClientConfig } from 'pg';

export type DrizzleConnectionConfigTypes = {
  INDIVIDUAL: {
    user: ClientConfig['user'];
    database: ClientConfig['database'];
    password: string;
    port: ClientConfig['port'];
    host: ClientConfig['host'];
    connectionString?: never;
  };
  CONNECTION_STRING: {
    connectionString: ClientConfig['connectionString'];
    user?: never;
    database?: never;
    password?: never;
    port?: never;
    host?: never;
  };
};
