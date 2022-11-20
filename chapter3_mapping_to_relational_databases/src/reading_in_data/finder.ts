import { client } from "../postgres_client.ts";

export class Crew {
  constructor(
    private id: number,
    public name: string,
    public bounty: bigint,
    public ranking: number,
  ) {}

  getId(): number {
    return this.id;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (name, bounty)
      VALUES (${this.name}, ${this.bounty})
    `;
  }

  isDanger(): boolean {
    return this.bounty >= 1_000_000_000;
  }
}

export interface PopularityVoteService {
  getRanking: (id: number) => Promise<number>;
}

interface CrewsRow {
  id: number;
  name: string;
  bounty: bigint;
}

export class CrewFinder {
  constructor(
    private popularityVoteService: PopularityVoteService,
  ) {}

  async find(id: number): Promise<Crew> {
    const { rows: [row] } = await client.queryObject<CrewsRow>`
      SELECT id, name, bounty
      FROM crews
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }

    const ranking = await this.popularityVoteService.getRanking(row.id);

    const crewGateway = new Crew(
      row.id,
      row.name,
      row.bounty,
      ranking,
    );
    return crewGateway;
  }
}
