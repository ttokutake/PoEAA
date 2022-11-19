import {
  afterAll,
  afterEach,
  assertEquals,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import { CrewGateway } from "../../src/reading_in_data/find_many.ts";
import { createTable, dropTable, truncateTable } from "../test_helper.ts";

async function insertData() {
  const data = [
    { name: "Luffy", bounty: BigInt(1_500_000_000) },
    { name: "Zoro", bounty: BigInt(320_000_000) },
  ];
  for (const { name, bounty } of data) {
    const crewGateway = new CrewGateway(name, bounty);
    await crewGateway.insert();
  }
}

describe("CrewFinder", () => {
  beforeAll(async () => {
    await createTable();
  });
  afterAll(async () => {
    await dropTable();
  });

  beforeEach(async () => {
    await insertData();
  });
  afterEach(async () => {
    await truncateTable();
  });

  it("findManyInGoodWay", async () => {
    const crewGateways = await CrewGateway.findManyInGoodWay([1, 2]);

    assertEquals(crewGateways[0].name, "Luffy");
    assertEquals(crewGateways[0].bounty, BigInt(1_500_000_000));

    assertEquals(crewGateways[1].name, "Zoro");
    assertEquals(crewGateways[1].bounty, BigInt(320_000_000));
  });

  it("findManyInBadWay", async () => {
    const crewGateways = await CrewGateway.findManyInBadWay([1, 2]);

    assertEquals(crewGateways[0].name, "Luffy");
    assertEquals(crewGateways[0].bounty, BigInt(1_500_000_000));

    assertEquals(crewGateways[1].name, "Zoro");
    assertEquals(crewGateways[1].bounty, BigInt(320_000_000));
  });
});
