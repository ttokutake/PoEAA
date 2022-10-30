import { Row, TableDataGateway } from "./data_source.ts";
import { Crew } from "./domain.ts";

export interface Pirate {
  crews: Crew[];
  totalBounty: bigint;
}

export class StrawHatPiratesService {
  static async list(): Promise<Pirate> {
    const recordSet = await TableDataGateway.findAll();
    const crews = recordSet.map((r: Row) => new Crew(r.name, r.bounty));
    const totalBounty = recordSet.reduce(
      (sum: bigint, r: Row) => sum + r.bounty,
      BigInt(0),
    );
    return { crews, totalBounty };
  }
}
