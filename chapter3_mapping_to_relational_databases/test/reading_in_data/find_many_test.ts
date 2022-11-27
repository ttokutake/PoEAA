import {
  afterAll,
  afterEach,
  assertObjectMatch,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import { CrewGateway } from "../../src/reading_in_data/find_many.ts";
import {
  createCrewsTable,
  dropTable,
  truncateCrewsTable,
} from "../test_helper.ts";

async function insertData() {
  const data = [
    { id: 1, name: "Luffy", bounty: BigInt(1_500_000_000) },
    { id: 2, name: "Zoro", bounty: BigInt(320_000_000) },
  ];
  for (const { id, name, bounty } of data) {
    const crewGateway = new CrewGateway(id, name, bounty);
    await crewGateway.insert();
  }
}

describe("CrewGateway", () => {
  beforeAll(async () => {
    await createCrewsTable();
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

  it("findManyInGoodWay", async () => {
    const crewGateways = await CrewGateway.findManyInGoodWay([1, 2]);

    assertObjectMatch(crewGateways[0], {
      name: "Luffy",
      bounty: BigInt(1_500_000_000),
    });
    assertObjectMatch(crewGateways[1], {
      name: "Zoro",
      bounty: BigInt(320_000_000),
    });
  });

  it("findManyInBadWay", async () => {
    const crewGateways = await CrewGateway.findManyInBadWay([1, 2]);

    assertObjectMatch(crewGateways[0], {
      name: "Luffy",
      bounty: BigInt(1_500_000_000),
    });
    assertObjectMatch(crewGateways[1], {
      name: "Zoro",
      bounty: BigInt(320_000_000),
    });
  });
});
