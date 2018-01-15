import assert from 'assert';
import { expect } from 'chai';
import contracts from "./";

describe("Models / Contracts", _ => {
  describe("ui.create.defaultNewInstance", _ => {
    it("should return instance with predefined fields from the passed filter", () => {
      const filter = {
        contractId: "YYYYYYYYYYY"
      };
      const result = contracts.ui.create.defaultNewInstance({ filter });

      assert.deepEqual(
        result,
        filter
      )
    });
  });

  describe("ui.instanceLabel", _ => {
    it("should return empty string if instanceLabel is not specified for the instance", () => {
      const instance = {};
      const result = contracts.ui.instanceLabel(instance)
      assert.strictEqual(result, '')
    });
  });

  describe.skip("model.validate", _ => {
    it("should check for a required minOrderValue", () => {
      const instance = {
        minOrderValueRequired: true,
        minOrderValue: 100
      };
      const result = contracts.model.validate(instance);
      expect(result).to.be.true; // eslint-disable-line no-unused-expressions
    });

    it("should throw if a required minOrderValue is absent", () => {
      const instance = {
        contractId: 'myCoolId',
        minOrderValueRequired: true,
        minOrderValue: null
      };
      try {
        const result = contracts.model.validate(instance);
        assert.fail(result)
      } catch (e) {
        assert.deepEqual(
          e,
          [{
            code: 400,
            id: 'requiredFieldMissing',
            message: 'minOrderValue must be set when minOrderValueRequired is true',
            args: {
              contractId: instance.contractId
            }
          }]
        )
      }
    });
  });
});
