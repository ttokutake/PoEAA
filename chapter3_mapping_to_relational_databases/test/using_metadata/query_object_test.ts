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
  Criteria,
  QueryObject,
  SpecialMove,
} from "../../src/using_metadata/query_object.ts";
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
  for (const { id, name, bounty, specialMoves } of data) {
    const crew = new Crew(name, bounty);
    await crew.insert();
    for (const specialMoveName of specialMoves) {
      const specialMove = new SpecialMove(specialMoveName, id);
      await specialMove.insert();
    }
  }
}

describe("Base", () => {
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
    const idCriteria = Criteria.in("id", [1]);
    const crewQueryObject = new QueryObject(Crew);
    crewQueryObject.addCriteria(idCriteria);
    const crewWhereClause = crewQueryObject.generateWhereClause();
    const [crew] = await Crew.findBy(crewWhereClause);

    assertEquals(crew.name, "Luffy");
    assertEquals(crew.bounty, BigInt(1_500_000_000));

    const crewIdCriteria = Criteria.in("crewId", [1]);
    const specialMoveQueryObject = new QueryObject(SpecialMove);
    specialMoveQueryObject.addCriteria(crewIdCriteria);
    const specialMoveWhereClause = specialMoveQueryObject.generateWhereClause();
    const specialMoves = await SpecialMove.findBy(specialMoveWhereClause);

    assertEquals(specialMoves[0].name, "Gum-Gum Pistol");
    assertEquals(specialMoves[1].name, "Gum-Gum Bazooka");
  });
});
