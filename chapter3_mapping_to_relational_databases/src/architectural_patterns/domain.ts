export class Crew {
  constructor(
    private _id: number,
    public name: string,
    public bounty: bigint,
  ) {}

  get id(): number {
    return this._id;
  }

  isDanger(): boolean {
    return this.bounty >= 1_000_000_000;
  }
}
