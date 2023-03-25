export class Crew {
  constructor(
    public id: number,
    public name: string,
    public bounty: number,
    public specialMoves: SpecialMove[],
  ) {}

  static fetch(_id: number) {
    // TODO: Fetch data from a data source like DB
    const specialMoves = [
      new SpecialMove(1, "Gum-Gum Pistol"),
      new SpecialMove(2, "Gum-Gum Bazooka"),
    ];
    return new Crew(
      1,
      "Luffy",
      1_500_000_000,
      specialMoves,
    );
  }
}

export class SpecialMove {
  constructor(
    public id: number,
    public name: string,
  ) {}
}
