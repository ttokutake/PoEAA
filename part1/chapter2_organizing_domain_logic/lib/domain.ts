import { Row, TableDataGateway } from "./data_source.ts";

export interface Crew {
  name: string;
  isDanger: boolean;
}

export interface Pirate {
  totalBounty: bigint;
  crews: Crew[];
}

export class TransactionScript {
  static async listStrawHatPirates(): Promise<Pirate> {
    const rows = await TableDataGateway.findAll();
    const totalBounty = rows.reduce(
      (sum: bigint, r: Row) => sum + r.bounty,
      BigInt(0),
    );
    const crews = rows.map(
      (r: Row) => ({ name: r.name, isDanger: r.bounty >= 1_000_000_000 }),
    );
    return {
      totalBounty,
      crews,
    };
  }
}
