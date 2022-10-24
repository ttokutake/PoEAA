import { Transaction } from "../deps.ts";
import { client } from "../lib/postgres_client.ts";

async function insertCrew(
  transaction: Transaction,
  name: string,
  reward: number,
) {
  const result = await transaction
    .queryArray`SELECT * from crews where name = ${name}`;

  if (result.rows.length == 0) {
    await transaction
      .queryArray`INSERT INTO crews VALUES (nextval('crews_id_seq'), ${name}, ${reward})`;
  }
}

const transaction = client.createTransaction("seed");
await transaction.begin();

await transaction
  .queryArray`CREATE TABLE IF NOT EXISTS crews (id SERIAL, name VARCHAR(256), reward BIGINT)`;
await insertCrew(transaction, "Ruffy", 1_500_000_000);
await insertCrew(transaction, "Zorro", 320_000_000);

await transaction.commit();
