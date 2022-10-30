import { RecordSet, Row } from "./data_source.ts";

export class TableModule {
  crews: RecordSet;

  constructor(recordSet: RecordSet) {
    this.crews = recordSet;
  }

  totalBounty() {
    return this.crews.reduce(
      (sum: bigint, r: Row) => sum + r.bounty,
      BigInt(0),
    );
  }

  isDanger(id: number) {
    const crew = this.crews.find((c: Row) => c.id == id);
    if (!crew) {
      throw Error("Crew is not found.");
    }
    return crew.bounty >= 1_000_000_000;
  }
}
