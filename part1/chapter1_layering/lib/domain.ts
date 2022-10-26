import { DataSource, Row } from "./data_source.ts";

export class Crew {
  constructor(
    private id: number,
    public name: string,
    public bounty: bigint,
  ) {}

  isDanger() {
    return this.bounty >= 1_000_000_000;
  }
}

export interface Pirate {
  totalBounty: bigint;
  crews: Crew[];
}

export class Domain {
  static async listStrawHatPirates(isAsc: boolean): Promise<Pirate> {
    const rows = await DataSource.list(isAsc);
    const crews = rows.map(({ id, name, bounty }: Row) =>
      new Crew(id, name, bounty)
    );
    const totalBounty = crews.reduce(
      (sum: bigint, c: Crew) => sum + c.bounty,
      BigInt(0),
    );
    return {
      totalBounty,
      crews,
    };
  }
}
