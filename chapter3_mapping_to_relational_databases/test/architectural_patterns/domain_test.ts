import { assertEquals, describe, it } from "../../dev_deps.ts";

import { Crew } from "../../src/architectural_patterns/domain.ts";

describe("Crew", () => {
  it("isDanger", () => {
    const crew = new Crew(1, "Nami", BigInt(60_000_000));
    crew.bounty = BigInt(999_999_999);
    assertEquals(crew.isDanger(), false);

    crew.bounty = BigInt(1_000_000_000);
    assertEquals(crew.isDanger(), true);
  });
});
