import { client } from "../postgres_client.ts";

export class Crew {
  public _popularityRanking = "";

  constructor(
    private _id: number,
    public name: string,
    public bounty: bigint,
  ) {}

  get id(): number {
    return this._id;
  }

  get popularityRanking(): string {
    return this._popularityRanking;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (id, name, bounty)
      VALUES (${this.id}, ${this.name}, ${this.bounty})
    `;
  }
}

export interface PopularityVoteService {
  getRanking: (id: number) => Promise<string>;
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
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }

    const ranking = await this.popularityVoteService.getRanking(row.id);

    const crewGateway = new Crew(
      row.id,
      row.name,
      row.bounty,
    );
    crewGateway._popularityRanking = ranking;
    return crewGateway;
  }
}
