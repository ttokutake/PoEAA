import { Client } from '../deps.ts';

const client = new Client({
  user: 'postgres',
  password: 'password',
  database: 'postgres',
  hostname: 'db',
  port: 5432,
});

await client.connect();

export { client };
