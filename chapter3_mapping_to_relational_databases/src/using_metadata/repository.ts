import { client } from "../postgres_client.ts";
import { dirname, fromFileUrl } from "../../deps.ts";

import { Crew, SpecialMove } from "./domain.ts";

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
    private klass: typeof BaseMapper,
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

abstract class BaseMapper {
  protected static _table: string;
  protected static fields: ConfigField[];

  protected static idField = { name: "id", column: "id" };

  static get table(): string {
    return this._table;
  }

  static get allFields(): ConfigField[] {
    return [this.idField, ...this.fields];
  }

  async insert(...values: unknown[]): Promise<void> {
    const self = <typeof BaseMapper> this.constructor;
    const columnNames = self.fields.map(({ column }) => column);
    const placeholders = self.fields.map((_v, i) => `$${i + 1}`);

    await client.queryArray(
      `
        INSERT INTO ${self.table} (${columnNames.join(",")})
        VALUES (${placeholders.join(",")})
      `,
      values,
    );
  }
}

const __dirname = dirname(fromFileUrl(import.meta.url));
const configJson = await Deno.readTextFile(`${__dirname}/config.json`);
const config = JSON.parse(configJson);

export class CrewMapper extends BaseMapper {
  protected static _table = config.crew.table;
  protected static fields: ConfigField[] = config.crew.fields;

  insert(crew: Crew): Promise<void> {
    return super.insert(crew.name, crew.bounty);
  }
}

export class SpecialMoveMapper extends BaseMapper {
  protected static _table = config.special_move.table;
  protected static fields: ConfigField[] = config.special_move.fields;

  insert(specialMove: SpecialMove): Promise<void> {
    return super.insert(specialMove.name, specialMove.crewId);
  }
}

export class CrewRepository {
  async findBy(criteria: Criteria[]): Promise<Crew[]> {
    const crewQueryObject = new QueryObject(CrewMapper);
    for (const c of criteria) {
      crewQueryObject.addCriteria(c);
    }
    const whereClause = crewQueryObject.generateWhereClause();

    const crewColumnNames = CrewMapper.allFields.map(({ column }) => column);
    const { rows: crewRows } = await client.queryArray(`
      SELECT ${crewColumnNames.join(",")}
      FROM ${CrewMapper.table}
      WHERE ${whereClause}
    `);
    if (!crewRows.length) {
      return [];
    }

    const specialMoveColumnNames = SpecialMoveMapper.allFields.map((
      { column },
    ) => column);
    const specialMoveCrewIdField = SpecialMoveMapper.allFields.find((
      { name },
    ) => name == "crewId");
    if (!specialMoveCrewIdField) {
      throw new Error("Field Not Found: crewId");
    }
    const crewIds = crewRows.map((row) => row[0]);
    const { rows: specialMoveRows } = await client.queryArray(`
      SELECT ${specialMoveColumnNames.join(",")}
      FROM ${SpecialMoveMapper.table}
      WHERE ${specialMoveCrewIdField.column} IN (${crewIds.join(",")})
    `);
    const crews = crewRows.map((crewRow) => {
      const [crewId, name, bounty] = crewRow as [number, string, bigint];
      const specialMoves = specialMoveRows.filter((row) => row[2] == crewId);
      const specialMoveNames = specialMoves.map((row) => row[1]) as string[];
      return new Crew(crewId, name, bounty, specialMoveNames);
    });
    return crews;
  }
}