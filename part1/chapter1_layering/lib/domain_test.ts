import { assertEquals } from "../dev_deps.ts";

import { Crew, Domain, IDataSource } from "./domain.ts";

Deno.test("Domain", async (t) => {
  const crews = [
    new Crew(1, "Sanji", BigInt(330_000_000)),
    new Crew(2, "Chopper", BigInt(100)),
  ];

  const TestDataSource: IDataSource = class {
    static list(): Promise<Crew[]> {
      return Promise.resolve(crews);
    }
  };

  const domain = new Domain(TestDataSource);

  await t.step("strawHatPirates", async () => {
    const expected = {
      totalBounty: BigInt(330_000_100),
      crews,
    };
    assertEquals(await domain.strawHatPirates(), expected);
  });
});
