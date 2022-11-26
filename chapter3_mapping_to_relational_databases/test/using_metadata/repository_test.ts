import {
  afterAll,
  afterEach,
  assertEquals,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import { Crew, SpecialMove } from "../../src/using_metadata/domain.ts";
import {
  CrewMapper,
  CrewRepository,
  Criteria,
  SpecialMoveMapper,
} from "../../src/using_metadata/repository.ts";
import {
  createCrewsTable,
  createSpecialMovesTable,
  dropTable,
  truncateCrewsTable,
} from "../test_helper.ts";

async function insertData() {
  const data = [
    {
      id: 1,
      name: "Luffy",
      bounty: BigInt(1_500_000_000),
      specialMoves: ["Gum-Gum Pistol", "Gum-Gum Bazooka"],
    },
    {
      id: 2,
      name: "Zoro",
      bounty: BigInt(320_000_000),
      specialMoves: ["Oni Giri", "Tora Gari"],
    },
  ];
  const crewMapper = new CrewMapper();
  const specialMoveMapper = new SpecialMoveMapper();
  for (const { id, name, bounty, specialMoves } of data) {
    const crew = new Crew(0, name, bounty, []);
    await crewMapper.insert(crew);
    for (const specialMoveName of specialMoves) {
      const specialMove = new SpecialMove(0, specialMoveName, id);
      await specialMoveMapper.insert(specialMove);
    }
  }
}

describe("CrewRepository", () => {
  beforeAll(async () => {
    await createCrewsTable();
    await createSpecialMovesTable();
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

  it("findBy", async () => {
    const crewRepository = new CrewRepository();
    const idCriteria = Criteria.in("id", [1]);
    const [crew] = await crewRepository.findBy([idCriteria]);

    assertEquals(crew.name, "Luffy");
    assertEquals(crew.bounty, BigInt(1_500_000_000));
    assertEquals(crew.specialMoves[0], "Gum-Gum Pistol");
    assertEquals(crew.specialMoves[1], "Gum-Gum Bazooka");
  });
});
