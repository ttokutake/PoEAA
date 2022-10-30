import { client } from "../lib/postgres_client.ts";

async function insertCrew(
  id: number,
  name: string,
  bounty: number,
) {
  await client.queryArray`
    INSERT INTO crews
    VALUES (${id}, ${name}, ${bounty})
    ON CONFLICT ON CONSTRAINT crews_pkey
    DO NOTHING
  `;
}

await client.queryArray`
  CREATE TABLE IF NOT EXISTS crews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256),
    bounty BIGINT
  )
`;
await insertCrew(1, "Ruffy", 1_500_000_000);
await insertCrew(2, "Zoro", 320_000_000);
