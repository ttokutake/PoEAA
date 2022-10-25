import { assertEquals } from "../dev_deps.ts";

import { Crew, Domain, IDataSource } from "./domain.ts";

Deno.test("Domain", async (t) => {
  const expected_crews = [
    new Crew(1, "Sanji", 330_000_000),
    new Crew(2, "Chopper", 100),
  ];

  const TestDataSource: IDataSource = class {
    static list(): Promise<Crew[]> {
      return Promise.resolve(expected_crews);
    }
  };

  const domain = new Domain(TestDataSource);

  await t.step("doComplexThings", async () => {
    assertEquals(await domain.doComplexThings(), expected_crews);
  });
});
