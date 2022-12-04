import {
  afterAll,
  afterEach,
  assertEquals,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import {
  CrewGateway,
  Money,
} from "../../src/mapping_relationships/value_objects.ts";
import { client } from "../../src/postgres_client.ts";
import { dropTable, truncateCrewsTable } from "../test_helper.ts";

async function insertData() {
  const bounty = new Money(BigInt(60_000_000), "Berry");
  const data = new CrewGateway(1, "Nami", bounty);
  await data.insert();
}

describe("Money", () => {
  it("equalsTo", () => {
    const money1 = new Money(BigInt(1_000_000), "Berry");

    const money2 = new Money(BigInt(1_000_000), "Berry");
    assertEquals(money1.equalsTo(money2), true);

    const money3 = new Money(BigInt(999_999), "Berry");
    assertEquals(money1.equalsTo(money3), false);

    const money4 = new Money(BigInt(1_000_000), "Yen");
    assertEquals(money1.equalsTo(money4), false);
  });
});

describe("CrewGateway", () => {
  beforeAll(async () => {
    await client.queryArray`
      CREATE TABLE IF NOT EXISTS crews (
        id SERIAL PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        bounty_amount BIGINT NOT NULL,
        bounty_currency VARCHAR(256) NOT NULL
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
    assertEquals(data.bounty.amount, BigInt(60_000_000));
    assertEquals(data.bounty.currency, "Berry");
  });
});
