import { Client, Pool } from "../../deps.ts";

function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const connectionParams = {
  user: "postgres",
  password: "password",
  database: "postgres",
  hostname: "db",
  port: 5432,
};

export async function tryDbConnections() {
  const client = new Client(connectionParams);
  const pool = new Pool(connectionParams, 1);
  await sleep(1);

  for (let i = 0; i < 3; i++) {
    await client.connect();
    await client.end();

    const poolClient = await pool.connect();
    poolClient.release();
  }

  await pool.end();
}

// PostgreSQL logs
//
// 2022-11-26 05:01:49.315 UTC [169] LOG:  connection received: host=172.18.0.3 port=40146
// ...
// 2022-11-26 05:01:50.321 UTC [170] LOG:  connection received: host=172.18.0.3 port=40160
// ...
// 2022-11-26 05:01:50.348 UTC [171] LOG:  connection received: host=172.18.0.3 port=40164
// ...
// 2022-11-26 05:01:50.367 UTC [172] LOG:  connection received: host=172.18.0.3 port=40170
// ...
