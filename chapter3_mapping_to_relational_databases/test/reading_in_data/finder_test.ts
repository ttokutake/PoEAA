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
  Crew,
  CrewFinder,
  PopularityVoteService,
} from "../../src/reading_in_data/finder.ts";
import { createTable, dropTable, truncateTable } from "../test_helper.ts";

async function insertData() {
  const crew = new Crew(0, "Luffy", BigInt(1_500_000_000), 0);
  await crew.insert();
}

const PopularityVoteServiceStub: PopularityVoteService = class {
  static getRanking(_id: number): Promise<number> {
    return Promise.resolve(1);
  }
};

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

  it("find", async () => {
    const crewFinder = new CrewFinder(PopularityVoteServiceStub);
    const crew = await crewFinder.find(1);

    assertEquals(crew.name, "Luffy");
    assertEquals(crew.bounty, BigInt(1_500_000_000));
    assertEquals(crew.ranking, 1);
  });
});