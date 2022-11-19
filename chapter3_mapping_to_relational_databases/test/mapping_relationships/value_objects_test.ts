import {
  afterAll,
  afterEach,
  assertEquals,
  assertThrows,
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
  const data = new CrewGateway("Nami", bounty);
  await data.insert();
}

describe("Money", () => {
  it("isGreaterThan", () => {
    const money1 = new Money(BigInt(1_000_000), "Berry");

    const money2 = new Money(BigInt(1_000), "Berry");
    assertEquals(money1.isGreaterThan(money2), true);

    const money3 = new Money(BigInt(1_000_000_000), "Berry");
    assertEquals(money1.isGreaterThan(money3), false);

    const money4 = new Money(BigInt(1_000), "Yen");
    assertThrows(
      () => money1.isGreaterThan(money4),
      Error,
      "Cannot compare Berry to Yen",
    );
  });
});

describe("CrewGateway", () => {
  beforeAll(async () => {
    await client.queryArray`
      CREATE TABLE IF NOT EXISTS crews (
        id SERIAL PRIMARY KEY,
        name VARCHAR(256),
        bounty_amount BIGINT,
        bounty_currency VARCHAR(256)
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
