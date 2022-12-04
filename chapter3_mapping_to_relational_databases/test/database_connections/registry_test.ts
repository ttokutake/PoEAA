import {
  afterAll,
  afterEach,
  assertEquals,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import { CrewGateway } from "../../src/database_connections/registry.ts";
import {
  createCrewsTable,
  dropTable,
  truncateCrewsTable,
} from "../test_helper.ts";

async function insertData() {
  const crewGateway = new CrewGateway();
  await crewGateway.insert(1, "Nami", BigInt(60_000_000));
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

    assertEquals(row.name, "Nami");
    assertEquals(row.bounty, BigInt(60_000_000));
  });
});
