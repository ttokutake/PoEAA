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

export interface IDataSource {
  list: () => Promise<Crew[]>;
}

export interface Pirate {
  totalBounty: bigint;
  crews: Crew[];
}

export class Domain {
  dataSource: IDataSource;

  constructor(dataSource: IDataSource) {
    this.dataSource = dataSource;
  }

  async strawHatPirates(): Promise<Pirate> {
    const crews = await this.dataSource.list();
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
