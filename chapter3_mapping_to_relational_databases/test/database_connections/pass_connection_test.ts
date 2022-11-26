import {
  afterAll,
  afterEach,
  assertMatch,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "../../dev_deps.ts";

import { client } from "../../src/postgres_client.ts";
import { Presentation } from "../../src/database_connections/pass_connection.ts";
import {
  createCrewsTable,
  dropTable,
  truncateCrewsTable,
} from "../test_helper.ts";

async function insertData(): Promise<void> {
  await client.queryArray`
    INSERT INTO crews (name, bounty)
    VALUES (${"Nami"}, ${60_000_000})
  `;
}

async function streamToString(readableStream: ReadableStream): Promise<string> {
  async function streamToStringImpl(
    reader: ReadableStreamReader,
    result: string,
  ): Promise<string> {
    const { done, value } = await reader.read();
    if (done) {
      return result;
    }
    result += new TextDecoder().decode(value);
    return streamToStringImpl(reader, result);
  }
  const reader = readableStream.getReader();
  const result = await streamToStringImpl(reader, "");
  return result;
}

describe("Presentation", () => {
  beforeAll(async () => {
    await createCrewsTable();
  });
  afterAll(async () => {
    await dropTable();
  });

  beforeEach(async () => {
    await insertData();
  });
  afterEach(async () => {
    await truncateCrewsTable();
  });

  describe("handler", () => {
    it("returns Response", async () => {
      const request = new Request("http://example.com");
      const response = await Presentation.handler(request);
      const result = await streamToString(response.body!);
      assertMatch(result, /ID: 1/);
      assertMatch(result, /Name: Nami/);
    });
  });
});
