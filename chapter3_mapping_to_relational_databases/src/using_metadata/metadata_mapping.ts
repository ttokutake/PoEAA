import { client } from "../postgres_client.ts";
import { dirname, fromFileUrl } from "../../deps.ts";

interface ConfigField {
  name: string;
  column: string;
}

abstract class BaseModel {
  protected static table: string;
  protected static fields: ConfigField[];

  protected static idField = { name: "id", column: "id" };
  protected _id = 0;

  [index: string]: unknown;

  constructor(...values: unknown[]) {
    (<typeof BaseModel> this.constructor).fields.forEach((field, index) => {
      this[field.name] = values[index];
    });
  }

  get id(): number {
    return this._id;
  }

  async insert(): Promise<void> {
    const self = <typeof BaseModel> this.constructor;
    const columnNames = self.fields.map(({ column }) => column);
    const placeholders = self.fields.map((_v, i) => `$${i + 1}`);
    const values = self.fields.map(({ name }) => this[name]);

    await client.queryArray(
      `
        INSERT INTO ${self.table} (${columnNames.join(",")})
        VALUES (${placeholders.join(",")})
      `,
      values,
    );
  }

  static async find(id: unknown): Promise<BaseModel> {
    const columnNames = this.fields.map(({ column }) => column);
    const { rows: [row] } = await client.queryArray(`
      SELECT ${this.idField.column}, ${columnNames.join(",")}
      FROM ${this.table}
      WHERE ${this.idField.column} = ${id}
    `);
    if (!row) {
      throw new Error("Record Not Found");
    }
    const valuesWithoutId = row.slice(1);
    // @ts-ignore: I don't know how to specify concrete class except "this"
    const instance = new this(...valuesWithoutId);
    instance._id = row[0] as number;
    return instance;
  }
}

const __dirname = dirname(fromFileUrl(import.meta.url));
const configJson = await Deno.readTextFile(`${__dirname}/config.json`);
const config = JSON.parse(configJson);

export class Crew extends BaseModel {
  protected static table = config.crew.table;
  protected static fields: ConfigField[] = config.crew.fields;
}

export class SpecialMove extends BaseModel {
  protected static table = config.special_move.table;
  protected static fields: ConfigField[] = config.special_move.fields;
}
