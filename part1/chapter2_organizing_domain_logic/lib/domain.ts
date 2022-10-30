export class Crew {
  constructor(
    public name: string,
    private bounty: bigint,
  ) {}

  isDanger() {
    return this.bounty >= 1_000_000_000;
  }
}
