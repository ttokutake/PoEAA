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

  doComplexThings(): Promise<Crew[]> {
    // Imagine that complex things will be done in this method.
    return this.dataSource.list();
  }
}
