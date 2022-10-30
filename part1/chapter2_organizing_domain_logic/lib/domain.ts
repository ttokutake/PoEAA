import { RecordSet, Row, TableDataGateway } from "./data_source.ts";

export class Crew {
  constructor(
    public name: string,
    private bounty: bigint,
  ) {}

  isDanger() {
    return this.bounty >= 1_000_000_000;
  }
}

export class StrawHatPirates {
  crews: Crew[];
  totalBounty: bigint;

  private constructor(recordSet: RecordSet) {
    this.crews = recordSet.map((r: Row) => new Crew(r.name, r.bounty));
    this.totalBounty = recordSet.reduce(
      (sum: bigint, r: Row) => sum + r.bounty,
      BigInt(0),
    );
  }

  static async build() {
    const recordSet = await TableDataGateway.findAll();
    return new this(recordSet);
  }
}
