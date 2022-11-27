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
    const [row] = await crewGateway.find(1);

    assertEquals(row.name, "Luffy");
    assertEquals(row.bounty, BigInt(1_500_000_000));

    await crewGateway.delete(row.id);
    const [cachedRow] = await crewGateway.find(row.id);

    assertEquals(cachedRow.name, "Luffy");
    assertEquals(cachedRow.bounty, BigInt(1_500_000_000));

    crewGateway.clearIdentityMap();
    const recordSet = await crewGateway.find(row.id);

    assertEquals(recordSet, []);
  });
});
