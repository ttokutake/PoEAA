import {
  afterAll,
  afterEach,
  assertEquals,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import { CrewGateway } from "../../src/mapping_relationships/serialized_lob.ts";
import { client } from "../../src/postgres_client.ts";
import { dropTable, truncateCrewsTable } from "../test_helper.ts";

async function insertData() {
  const wikipedia = {
    "Conception and creation":
      "Nami was based on two of Eiichiro Oda's earlier characters named Silk and Ann, from his one-shot manga Romance Dawn.",
    "Characteristics":
      "Nami possesses several abilities. She can tell climate changes and draw sea charts.",
    "Reference": "https://en.wikipedia.org/wiki/Nami_(One_Piece)",
  };
  const data = new CrewGateway(1, "Nami", BigInt(60_000_000), wikipedia);
  await data.insert();
}

describe("CrewGateway", () => {
  beforeAll(async () => {
    await client.queryArray`
      CREATE TABLE IF NOT EXISTS crews (
        id SERIAL PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        bounty BIGINT NOT NULL,
        wikipedia JSON NOT NULL
      )
    `;
  });
  afterAll(async () => {
    await dropTable();
  });

  beforeEach(async () => {
    await insertData();
  });
  afterEach(async () => {
    await truncateCrewsTable();
  });

  it("find", async () => {
    const data = await CrewGateway.find(1);

    assertEquals(data.name, "Nami");
    assertEquals(data.bounty, BigInt(60_000_000));
    assertEquals(
      data.wikipedia["Reference"],
      "https://en.wikipedia.org/wiki/Nami_(One_Piece)",
    );
  });
});
