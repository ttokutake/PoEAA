import {
  afterAll,
  afterEach,
  assertEquals,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import { CrewGateway } from "../../src/behavioral_problem/identity_map.ts";
import {
  createCrewsTable,
  dropTable,
  truncateCrewsTable,
} from "../test_helper.ts";

async function insertData() {
  const crewGateway = new CrewGateway();
  await crewGateway.insert(1, "Luffy", BigInt(1_500_000_000));
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

  it("find", async () => {
    const crewGateway = new CrewGateway();

    const [row1] = await crewGateway.find(1);
    row1.name = "Franky";

    const [row2] = await crewGateway.find(1);
    row2.bounty = BigInt(94_000_000);

    await crewGateway.update(row2.id, row2.name, row2.bounty);

    assertEquals(row1.name, "Franky");
    assertEquals(row1.bounty, BigInt(94_000_000));
  });
});
