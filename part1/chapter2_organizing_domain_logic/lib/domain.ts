import { RecordSet, Row, TableDataGateway } from "./data_source.ts";

export class Crew {
  constructor(
    public name: string,
    public bounty: bigint,
  ) {}

  isDanger() {
    return this.bounty >= 1_000_000_000;
  }
}

export class StrawHatPirates {
  crews: Crew[];

  private constructor(recordSet: RecordSet) {
    this.crews = recordSet.map((r: Row) => new Crew(r.name, r.bounty));
  }

  totalBounty(): bigint {
    return this.crews.reduce(
      (sum: bigint, c: Crew) => sum + c.bounty,
      BigInt(0),
    );
  }

  static async build() {
    const recordSet = await TableDataGateway.findAll();
    return new this(recordSet);
  }
}
