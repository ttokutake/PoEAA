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
  list: (isAsc: boolean) => Promise<Crew[]>;
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

  async listStrawHatPirates(isAsc: boolean): Promise<Pirate> {
    const crews = await this.dataSource.list(isAsc);
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
