export class Crew {
  constructor(
    private id: number,
    public name: string,
    private reward: number,
  ){}

  isDanger() {
    return this.reward >= 1_000_000_000;
  }
}

export interface IDataSource {
  list: () => Promise<Crew[]>;
}

export class Domain {
  dataSource: IDataSource;

  constructor(dataSource: IDataSource) {
    this.dataSource = dataSource;
  }

  crews(): Promise<Crew[]> {
    return this.dataSource.list();
  }
}
