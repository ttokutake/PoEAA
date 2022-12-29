export class Crew {
  constructor(
    public id: number,
    public name: string,
    public bounty: bigint,
  ) {}

  static find(id: number): Crew {
    const crews = this.findAll();
    const crew = crews.find((crew) => crew.id == id);
    if (crew == undefined) {
      throw new Error("Crew Not Found");
    }
    return crew;
  }

  static findAll(): Crew[] {
    const crews = [
      new Crew(0, "Luffy", BigInt(1_500_000_000)),
      new Crew(1, "Zoro", BigInt(320_000_000)),
    ];
    return crews;
  }
}
