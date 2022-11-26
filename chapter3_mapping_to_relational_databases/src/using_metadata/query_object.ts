import { client } from "../postgres_client.ts";
import { dirname, fromFileUrl } from "../../deps.ts";

export class Criteria {
  private constructor(
    private sqlOperator: string,
    protected fieldName: string,
    protected value: unknown,
  ) {}

  static in(fieldName: string, value: unknown[]): Criteria {
    return new Criteria("IN", fieldName, value);
  }

  generateSql(fields: ConfigField[]): string {
    const field = fields.find(({ name }) => name == this.fieldName);
    if (!field) {
      throw new Error(`Field Not Found: ${this.fieldName}`);
    }
    const rightSide = Array.isArray(this.value)
      ? `(${this.value.join(",")})`
      : this.value;
    return `${field.column} ${this.sqlOperator} ${rightSide}`;
  }
}

export class QueryObject {
  private criteria: Criteria[] = [];

  constructor(
    private klass: typeof BaseModel,
  ) {}

  addCriteria(criteria: Criteria): void {
    this.criteria.push(criteria);
  }

  generateWhereClause(): string {
    const conditions = this.criteria.map((c) =>
      c.generateSql(this.klass.allFields)
    );
    return conditions.join(" AND ");
  }
}

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

  static get allFields(): ConfigField[] {
    return [this.idField, ...this.fields];
  }

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

  static async findBy(whereClause: string): Promise<BaseModel[]> {
    const columnNames = this.fields.map(({ column }) => column);
    const { rows } = await client.queryArray(`
      SELECT ${this.idField.column}, ${columnNames.join(",")}
      FROM ${this.table}
      WHERE ${whereClause}
    `);
    const instances = rows.map((row) => {
      const valuesWithoutId = row.slice(1);
      // @ts-ignore: I don't know how to specify concrete class except "this"
      const instance = new this(...valuesWithoutId);
      instance._id = row[0] as number;
      return instance;
    });
    return instances;
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
