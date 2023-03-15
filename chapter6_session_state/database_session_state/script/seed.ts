import { Client } from "../deps.ts";

const client = new Client({
  user: "postgres",
  password: "password",
  database: "postgres",
  hostname: "db",
  port: 5432,
});

await client.queryArray`
  CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(256) PRIMARY KEY,
    name VARCHAR(256),
    bounty VARCHAR(256)
  )
`;
