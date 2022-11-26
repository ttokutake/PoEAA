export class Crew {
  constructor(
    private _id: number,
    public name: string,
    public bounty: bigint,
    public specialMoves: string[],
  ) {}

  get id(): number {
    return this._id;
  }

  isDanger(): boolean {
    return this.bounty >= 1_000_000_000;
  }
}

export class SpecialMove {
  constructor(
    private _id: number,
    public name: string,
    public crewId: number,
  ) {}
}
