import {
  afterAll,
  afterEach,
  assertEquals,
  assertRejects,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import { Crew } from "../../src/architectural_patterns/domain.ts";
import { CrewMapper } from "../../src/architectural_patterns/data_mapper.ts";
import { createTable, dropTable, truncateTable } from "../test_helper.ts";

async function insertData() {
  const crewMapper = new CrewMapper();
  const crew = new Crew(1, "Nami", BigInt(60_000_000));
  await crewMapper.insert(crew);
}

describe("CrewMapper", () => {
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

  it("update", async () => {
    const crewMapper = new CrewMapper();
    const crew = await crewMapper.find(1);
    crew.name = "Usopp";
    await crewMapper.update(crew);

    const updatedCrew = await crewMapper.find(1);
    assertEquals(updatedCrew.name, "Usopp");
    assertEquals(updatedCrew.bounty, BigInt(60_000_000));
  });

  it("delete", async () => {
    const crewMapper = new CrewMapper();
    const crew = await crewMapper.find(1);
    await crewMapper.delete(crew);

    assertRejects(() => crewMapper.find(1), Error, "Record Not Found");
  });

  it("find", async () => {
    const crewMapper = new CrewMapper();
    const crew = await crewMapper.find(1);

    assertEquals(crew.name, "Nami");
    assertEquals(crew.bounty, BigInt(60_000_000));
  });
});
