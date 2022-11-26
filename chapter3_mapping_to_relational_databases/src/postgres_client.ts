import { Client } from "../deps.ts";

const connectionParams = {
  user: "postgres",
  password: "password",
  database: "postgres",
  hostname: "db",
  port: 5432,
};

const client = new Client(connectionParams);

await client.connect();

export { client };
