import assert from 'assert'
import { defaultNewInstance } from "./";

describe("defaultNewInstance", _ => {
  it("should return instance with predefined fields from the passed filter", () => {
    const filter = {
      contractId: "YYYYYYYYYYY"
    };
    const result = defaultNewInstance({ filter });

    assert.deepEqual(
      result,
      filter
    )
  });
});
