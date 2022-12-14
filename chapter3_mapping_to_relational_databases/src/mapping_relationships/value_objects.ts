import { client } from "../postgres_client.ts";

export class Money {
  constructor(
    public amount: bigint,
    public currency: string,
  ) {}

  equalsTo(money: Money) {
    return this.amount === money.amount && this.currency === money.currency;
  }
}

interface CrewsRow {
  id: number;
  name: string;
  bounty_amount: bigint;
  bounty_currency: string;
}

export class CrewGateway {
  constructor(
    private _id: number,
    public name: string,
    public bounty: Money,
  ) {}

  get id(): number {
    return this._id;
  }

  async insert(): Promise<void> {
    await client.queryArray`
      INSERT INTO crews (id, name, bounty_amount, bounty_currency)
      VALUES (${this.id}, ${this.name}, ${this.bounty.amount}, ${this.bounty.currency})
    `;
  }

  static async find(id: number): Promise<CrewGateway> {
    const { rows: [row] } = await client.queryObject<CrewsRow>`
      SELECT
        id,
        name,
        bounty_amount,
        bounty_currency
      FROM crews
      WHERE id = ${id}
    `;
    if (!row) {
      throw new Error("Record Not Found");
    }
    const bounty = new Money(row.bounty_amount, row.bounty_currency);
    return new CrewGateway(row.id, row.name, bounty);
  }
}
