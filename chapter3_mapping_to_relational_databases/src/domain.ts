export class Crew {
  constructor(
    private id: number,
    public name: string,
    public bounty: bigint,
  ) {}

  getId(): number {
    return this.id;
  }

  isDanger(): boolean {
    return this.bounty >= 1_000_000_000;
  }
}
