import { client } from '../lib/postgres_client.ts';

const transaction = client.createTransaction('seed');
await transaction.begin();

await transaction.queryArray
  `CREATE TABLE IF NOT EXISTS crews (id SERIAL, name VARCHAR(256))`;

await transaction.queryArray
  `INSERT INTO crews VALUES (nextval('crews_id_seq'), 'Ruffy')`;

await transaction.queryArray
  `INSERT INTO crews VALUES (nextval('crews_id_seq'), 'Zorro')`;

await transaction.commit();
