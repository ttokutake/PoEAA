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
      specialMoves: [
        {
          id: 1,
          name: "Gum-Gum Pistol",
        },
        {
          id: 2,
          name: "Gum-Gum Bazooka",
        },
      ],
    },
    {
      id: 2,
      name: "Zoro",
      bounty: BigInt(320_000_000),
      specialMoves: [
        {
          id: 3,
          name: "Oni Giri",
        },
        {
          id: 4,
          name: "Tora Gari",
        },
      ],
    },
  ];
  const crewMapper = new CrewMapper();
  const specialMoveMapper = new SpecialMoveMapper();
  for (const { id: cId, name: cName, bounty, specialMoves } of data) {
    const crew = new Crew(cId, cName, bounty, []);
    await crewMapper.insert(crew);
    for (const { id: sId, name: sName } of specialMoves) {
      const specialMove = new SpecialMove(sId, sName, cId);
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
    assertEquals(crew.specialMoves, ["Gum-Gum Pistol", "Gum-Gum Bazooka"]);
  });
});
