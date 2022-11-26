import { describe, it } from "../../dev_deps.ts";

import { tryDbConnections } from "../../src/database_connections/connection_pool.ts";

describe("tryDbConnections", () => {
  it("tries database connections", async () => {
    await tryDbConnections();
  });
});
