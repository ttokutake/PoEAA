export class Crew {
  id: number;
  name: string;

  constructor({id, name}: {id: number, name: string}) {
    this.id = id;
    this.name = name;
  }

  isCaptain() {
    return this.name == 'Ruffy';
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
