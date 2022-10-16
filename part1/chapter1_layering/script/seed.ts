import { Transaction } from '../deps.ts';
import { client } from '../lib/postgres_client.ts';

async function insertCrew(transaction: Transaction, name: string) {
  const result = await transaction.queryArray
    `SELECT * from crews where name = ${name}`;

  if (result.rows.length == 0) {
    await transaction.queryArray
      `INSERT INTO crews VALUES (nextval('crews_id_seq'), ${name})`;
  }
}

const transaction = client.createTransaction('seed');
await transaction.begin();

await transaction.queryArray
  `CREATE TABLE IF NOT EXISTS crews (id SERIAL, name VARCHAR(256))`;
await insertCrew(transaction, 'Ruffy');
await insertCrew(transaction, 'Zorro');

await transaction.commit();
