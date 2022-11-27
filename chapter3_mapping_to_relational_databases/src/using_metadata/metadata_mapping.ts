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

  static get allFields(): ConfigField[] {
    return [this.idField, ...this.fields];
  }

  [index: string]: unknown;

  constructor(protected id: number, ...values: unknown[]) {
    (<typeof BaseModel> this.constructor).fields.forEach((field, index) => {
      this[field.name] = values[index];
    });
  }

  async insert(): Promise<void> {
    const self = <typeof BaseModel> this.constructor;
    const columnNames = self.allFields.map(({ column }) => column);
    const placeholders = self.allFields.map((_v, i) => `$${i + 1}`);
    const values = self.allFields.map(({ name }) => this[name]);

    await client.queryArray(
      `
        INSERT INTO ${self.table} (${columnNames.join(",")})
        VALUES (${placeholders.join(",")})
      `,
      values,
    );
  }

  static async find(id: unknown): Promise<BaseModel> {
    const columnNames = this.allFields.map(({ column }) => column);
    const { rows: [row] } = await client.queryArray(`
      SELECT ${columnNames.join(",")}
      FROM ${this.table}
      WHERE ${this.idField.column} = ${id}
    `);
    if (!row) {
      throw new Error("Record Not Found");
    }
    // @ts-ignore: I don't know how to specify concrete class except "this"
    return new this(...row);
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
