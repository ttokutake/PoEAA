export class Crew {
  constructor(
    public name: string,
    public bounty: bigint,
  ) {}

  static findAll(): Crew[] {
    const crews = [
      new Crew("Luffy", BigInt(1_500_000_000)),
      new Crew("Zoro", BigInt(320_000_000)),
    ];
    return crews;
  }
}
