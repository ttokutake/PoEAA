import { client } from "../postgres_client.ts";
import { dirname, fromFileUrl } from "../../deps.ts";

interface ConfigField {
  name: string;
  column: string;
}

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
    const field = fields.find(({ name }) => name === this.fieldName);
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

abstract class BaseModel {
  protected static table: string;
  protected static fields: ConfigField[];

  protected static idField = { name: "id", column: "id" };

  static get allFields(): ConfigField[] {
    return [this.idField, ...this.fields];
  }

  [index: string]: unknown;

  constructor(protected id: number, ...values: unknown[]) {
    const self = <typeof BaseModel> this.constructor;
    self.fields.forEach((field, index) => {
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

  static async findBy(whereClause: string): Promise<BaseModel[]> {
    const columnNames = this.allFields.map(({ column }) => column);
    const { rows } = await client.queryArray(`
      SELECT ${columnNames.join(",")}
      FROM ${this.table}
      WHERE ${whereClause}
    `);
    const instances = rows.map((row) => {
      // @ts-ignore: I don't know how to specify concrete class except "this"
      return new this(...row);
    });
    return instances;
  }
}

const __dirname = dirname(fromFileUrl(import.meta.url));
const configJson = await Deno.readTextFile(`${__dirname}/config.json`);
const config = JSON.parse(configJson);

export class Crew extends BaseModel {
  protected static table = config.Crew.table;
  protected static fields: ConfigField[] = config.Crew.fields;
}

export class SpecialMove extends BaseModel {
  protected static table = config.SpecialMove.table;
  protected static fields: ConfigField[] = config.SpecialMove.fields;
}
