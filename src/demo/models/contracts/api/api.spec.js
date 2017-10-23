import assert from 'assert';
import entries from 'object.entries';
import {
  get,
  create,
  update,
  search,
  deleteMany,
  getNumberOfInstances,
  getContracts,
  testNumberFieldType
} from './api';

import asyncApi from './';

if (!Object.entries) {
  entries.shim();
}

const removeTestField = obj => Object.keys(obj).
  filter(key => testNumberFieldType.indexOf(key) === -1).
  reduce((o, cur) => ({ ...o, [cur]: obj[cur] }), {});

const stripAuditable = obj => Object.keys(obj).
  filter(key => ['createdOn', 'createdBy', 'changedOn', 'changedBy'].indexOf(key) === -1).
  reduce((o, cur) => ({ ...o, [cur]: obj[cur] }), {});

const realInstance = {
  "contractId": "Excision of mouth NEC",
  "extContractId": "Dilation of R Fem Art with 4+ Intralum Dev, Perc Approach",
  "description": "Person outside 3-whl mv inj in clsn w hv veh in traf, subs",
  "statusId": "105",
  "currencyId": "PEN",
  "minOrderValueRequired": null,
  "minOrderValue": null,
  "maxOrderValue": null,
  "isStandard": true,
  "isFrameContract": true,
  "isOffer": false,
  "isPreferred": false,
  "isInternal": true,
  "createdOn": "2011-02-19T00:03:43Z",
  "changedOn": "2016-12-14T18:06:34Z",
  "createdBy": "Gabbi Detheridge",
  "changedBy": "Murvyn Grouer",
  "validRange": {
    "from": "2017-07-19T22:09:36Z",
    "to": "2017-12-24T12:02:43Z"
  },
  "extContractLineId": "Mult birth NOS-nonhosp",
  "freeShippingBoundary": 18827,
  "totalContractedAmount": 6085,
  "smallVolumeSurcharge": 82038,
  "freightSurcharge": 36792
};

describe('Sync api functions:', () => {
  describe('get ', () => {
    const before = getNumberOfInstances();

    it('should get a contract instance', () => {
      const instance = get({ instance: { "contractId": realInstance.contractId } });
      const after = getNumberOfInstances();
      assert.deepEqual(
        removeTestField(instance),
        realInstance
      );
      assert.equal(before, after, 'Source data length changed unexpectedly!')
    });

    it('should throw for unknown contractId', () => {
      try {
        const i = get({ instance: { "contractId": "TotallyRANDOMcontractId000003-_1934ir23" } });
        assert.fail(i);
      } catch (e) {
        assert.ok(true);
      }
      const after = getNumberOfInstances();
      assert.equal(before, after, 'Source data length changed unexpectedly!')
    });
  });

  describe('create ', () => {
    const instance = {
      ...realInstance,
      "contractId": "t0tALly RanD0m ContracT ID",
      "description": "random description" };

    it('should return a saved contract instance', () => {
      const before = getNumberOfInstances();
      const savedInstance = create({ instance });
      const after = getNumberOfInstances();
      assert.deepEqual(
        stripAuditable(instance),
        stripAuditable(savedInstance)
      );
      assert.equal(before + 1, after, 'Source data length changed unexpectedly!')
    });

    it('should throw if contract already exists', () => {
      try {
        const i = create({ instance });
        assert.fail(i);
      } catch (e) {
        assert.ok(true);
      }
    });
  });

  describe('update ', () => {
    const updatedInstance = {
      ...realInstance,
      description: "UPDATED!"
    }

    it('should return an updated instance', () => {
      const before = getNumberOfInstances();
      const result = update({ instance: updatedInstance });
      const after = getNumberOfInstances();
      assert.deepEqual(
        stripAuditable(result),
        stripAuditable(updatedInstance)
      );
      assert.equal(before, after, 'Source data length changed unexpectedly!')

      // restore updated value
      update({ instance: realInstance });
    });

    it('should throw for unknown contractId', () => {
      const before = getNumberOfInstances();
      const instance = { contractId: "mP%*}RSI{E6>g~}~}(4|.NdJ]9w&<q-c-suS56G/f#oB(zXR=xHq1BlB*T}GJssU" };

      try {
        const i = update({ instance });
        assert.fail(i);
      } catch (e) {
        assert.ok(true);
      } finally {
        const after = getNumberOfInstances();
        assert.equal(before, after, 'Source data length changed unexpectedly!')
      }
    });
  });

  describe('deleteMany ', () => {
    const numToDelete = 14;
    it('should return a number of deleted instances', () => {
      const before = getNumberOfInstances();
      const itemsToDelete = getContracts().slice(100, 100 + numToDelete)
      const numDeleted = deleteMany({ instances: itemsToDelete });
      const after = getNumberOfInstances();
      assert.deepEqual(
        numDeleted,
        numToDelete
      );
      assert.equal(before - numToDelete, after, "Deleted wrong number of items")

      // restore deleted items
      for (const instance of itemsToDelete) {
        create({ instance })
      }
      const afterRestore = getNumberOfInstances();
      assert.equal(before, afterRestore, "Not properly restored deleted items")
    });
  });

  describe('search ', () => {
    const filter = {
      "contractId": "Excision of mouth NEC",
      "extContractId": "Dilation of R Fem Art with 4+ Intralum Dev, Perc Approach",
      "isFrameContract": true,
      "isOffer": false,
    }

    it('should throw if a field doesn\'t exist on instance', () => {
      try {
        const err = search({ filter: {
          ...filter,
          "randomField21745723": "badField"
        } })
        assert.fail(err);
      } catch (e) {
        assert.ok(true);
      }
    });

    it('should find proper instance', () => {
      const before = getNumberOfInstances();
      const { instances } = search({ filter })
      const after = getNumberOfInstances();

      assert.deepEqual(
        stripAuditable(instances[0]),
        stripAuditable(realInstance)
      );

      assert.equal(before, after, 'Source data length changed unexpectedly!')
    });

    it('should find by string', () => {
      const before = getNumberOfInstances();
      const filter = {
        description: 'cavity'
      }
      const { instances, totalCount } = search({ filter })
      const after = getNumberOfInstances();

      assert.deepEqual(
        instances,
        getContracts().filter(c => c.description && ~c.description.indexOf(filter.description))
      );

      assert.equal(
        totalCount,
        instances.length
      )

      assert.equal(before, after, 'Source data length changed unexpectedly!')
    });

    it('should find by stringNumber from..to range (maxOrderValue)', () => {
      const before = getNumberOfInstances();
      const filter = {
        maxOrderValue: {
          from: "5000",
          to: "13000"
        }
      }
      const { instances, totalCount } = search({ filter })
      const after = getNumberOfInstances();

      assert(instances.length > 0)

      assert.deepEqual(
        instances,
        getContracts().filter(
          c => Number(c.maxOrderValue) >= filter.maxOrderValue.from &&
            Number(c.maxOrderValue) <= filter.maxOrderValue.to
        )
      );

      assert.equal(
        totalCount,
        instances.length
      )

      assert.equal(before, after, 'Source data length changed unexpectedly!')
    });

    it('should find by stringDate from..to range (createdOn)', () => {
      const before = getNumberOfInstances();
      const filter = {
        createdOn: {
          from: "2011-03-10",
          to: "2011-07-01"
        }
      }
      const { instances, totalCount } = search({ filter })
      const after = getNumberOfInstances();

      assert(instances.length > 0)

      assert.deepEqual(
        instances,
        getContracts().filter(
          ({ createdOn }) => new Date(createdOn) >= new Date(filter.createdOn.from) &&
            new Date(createdOn) <= new Date(filter.createdOn.to)
        )
      );

      assert.equal(
        totalCount,
        instances.length
      )

      assert.equal(before, after, 'Source data length changed unexpectedly!')
    });

    it('should find by boolean value', () => {
      const before = getNumberOfInstances();
      const filter = {
        isOffer: true,
        isPreferred: false
      }
      const { instances } = search({ filter })
      const after = getNumberOfInstances();

      assert.deepEqual(
        instances,
        getContracts().filter(
          c => Boolean(c.isOffer) === filter.isOffer && Boolean(c.isPreferred) === filter.isPreferred
        )
      );

      assert.equal(before, after, 'Source data length changed unexpectedly!')
    });

    it('should sort by field', () => {
      const before = getNumberOfInstances();
      const filter = { extContractId: 'Replacement' };
      const sort = 'statusId';
      const { instances } = search({ filter, sort })
      const after = getNumberOfInstances();

      assert.equal(
        instances.length,
        getContracts().filter(
          c => c.extContractId && ~c.extContractId.indexOf(filter.extContractId)
        ).length
      );

      assert.deepEqual(
        instances.map(e => e[sort]),
        instances.map(e => e[sort]).sort(),
        "Result was not sorted properly"
      )

      assert.equal(before, after, 'Source data length changed unexpectedly!')
    });

    it('should sort in ascending order', () => {
      const before = getNumberOfInstances();
      const filter = { extContractId: 'Replacement' };
      const sort = 'statusId';
      const { instances } = search({ filter, sort, order: 'asc' })
      const after = getNumberOfInstances();

      assert.equal(
        instances.length,
        getContracts().filter(
          c => c.extContractId && ~c.extContractId.indexOf(filter.extContractId)
        ).length
      );

      assert.deepEqual(
        instances.map(e => e[sort]),
        instances.map(e => e[sort]).sort(),
        "Result was not sorted properly"
      )

      assert.equal(before, after, 'Source data length changed unexpectedly!')
    });

    it('should sort in descending order', () => {
      const before = getNumberOfInstances();
      const filter = { extContractId: 'Replacement' };
      const sort = 'statusId';
      const { instances } = search({ filter, sort, order: 'desc' })
      const after = getNumberOfInstances();

      assert.equal(
        instances.length,
        getContracts().filter(
          c => c.extContractId && ~c.extContractId.indexOf(filter.extContractId)
        ).length
      );

      assert.deepEqual(
        instances.map(e => e[sort]),
        instances.map(e => e[sort]).sort().reverse(),
        "Result was not sorted properly"
      )

      assert.equal(before, after, 'Source data length changed unexpectedly!')
    });

    it('should handle offset properly', () => {
      const before = getNumberOfInstances();
      const offset = 13;
      const { instances, totalCount } = search({ offset })
      const after = getNumberOfInstances();

      assert.equal(
        instances.length,
        getContracts().length - offset
      );

      assert.deepEqual(
        instances,
        getContracts().slice(offset),
        "Returned array is not the one expected"
      )

      assert.equal(
        totalCount,
        instances.length + offset
      )

      assert.equal(before, after, 'Source data length changed unexpectedly!')
    });

    it('should handle max properly', () => {
      const before = getNumberOfInstances();
      const max = 23;
      const { instances } = search({ max })
      const after = getNumberOfInstances();

      assert.equal(
        instances.length,
        max
      );

      assert.deepEqual(
        instances,
        getContracts().slice(0, max),
        "Returned array is not the one expected"
      )

      assert.equal(before, after, 'Source data length changed unexpectedly!')
    });
  });
});

describe('Async (converted to a promise with fake timeout) api', _ => {
  describe('async get', _ => {
    it('should return a proper instance', done => {
      asyncApi.get({ instance: { "contractId": realInstance.contractId } }).
        then(res => {
          assert.deepEqual(
            stripAuditable(res),
            stripAuditable(realInstance)
          );
          done()
        }).
        catch(done)
    });

    it('should reject for unknown contractId', done => {
      const instance = { contractId: "TotallyRANDOMcontractId000003-_1934ir23" };
      asyncApi.get({ instance }).
        then(done).
        catch(err => {
          assert.deepEqual(
            err,
            { code: 404, message: `Contract "${instance.contractId}" not found` }
          );
          done()
        })
    });
  });

  describe('async create ', _ => {
    const instance = {
      ...realInstance,
      contractId: "t0tALly RanD0m ContracT ID 2",
      "description": "random description"
    };

    it('should return a saved contract instance', done => {
      const before = getNumberOfInstances();
      asyncApi.create({ instance }).then(
        result => {
          const after = getNumberOfInstances();
          assert.deepEqual(
            stripAuditable(result),
            stripAuditable(instance)
          );
          assert.equal(before + 1, after, 'Source data length changed unexpectedly!');
          done()
        }
      ).catch(done)
    });

    it('should return error if contract already exists', done => {
      const before = getNumberOfInstances();
      asyncApi.create({ instance }).
        then(done).
        catch(err => {
          const after = getNumberOfInstances();
          assert.deepEqual(
            err,
            {
              code: 403,
              message: `Instance with contractId="${instance.contractId}" already exists in the database`
            }
          );
          assert.equal(before, after, 'Source data length changed unexpectedly!');
          done()
        }
        )
    });
  });

  describe('async update ', _ => {
    const updatedInstance = {
      ...realInstance,
      description: "UPDATED!"
    }

    it('should return an updated instance', done => {
      const before = getNumberOfInstances();
      asyncApi.update({ instance: updatedInstance }).
        then(result => {
          const after = getNumberOfInstances();

          assert.deepEqual(
            stripAuditable(result),
            stripAuditable(updatedInstance)
          );

          assert.equal(before, after, 'Source data length changed unexpectedly!')

          // restore updated value
          update({ instance: realInstance });
          done()
        }).
        catch(done)
    });

    it('should reject for unknown contractId', done => {
      const before = getNumberOfInstances();
      const instance = { contractId: "mP%*}RSI{E6>g~}~}(4|.NdJ]9w&<q-c-suS56G/f#oB(zXR=xHq1BlB*T}GJssU" };

      asyncApi.update({ instance }).
        then(done).
        catch(err => {
          const after = getNumberOfInstances();

          assert.deepEqual(
            err,
            { code: 400, message: `Contract "${instance.contractId}" not found` }
          );

          assert.equal(before, after, 'Source data length changed unexpectedly!')
          done()
        }).
        catch(done)
    });
  });

  describe('async delete ', _ => {
    const numToDelete = 14;
    it('should return a number of deleted instances', done => {
      const before = getNumberOfInstances();
      const itemsToDelete = getContracts().slice(100, 100 + numToDelete)

      asyncApi.delete({ instances: itemsToDelete }).
        then(
          numDeleted => {
            const after = getNumberOfInstances();
            assert.equal(
              numDeleted,
              numToDelete
            );
            assert.equal(before - numToDelete, after, "Deleted wrong number of items")

            // restore deleted items
            for (const instance of itemsToDelete) {
              create({ instance })
            }
            const afterRestore = getNumberOfInstances();
            assert.equal(before, afterRestore, "Not properly restored deleted items")
            done()
          }
        ).
        catch(done)
    });
  });

  describe('async search ', _ => {
    it('should find and sort by field', done => {
      const before = getNumberOfInstances();
      const filter = { extContractId: 'Replacement' };
      const sort = 'statusId';

      asyncApi.search({ filter, sort }).
        then(({ instances }) => {
          const after = getNumberOfInstances();

          assert.equal(
            instances.length,
            getContracts().filter(
              c => c.extContractId && ~c.extContractId.indexOf(filter.extContractId)
            ).length
          );

          assert.deepEqual(
            instances.map(e => e[sort]),
            instances.map(e => e[sort]).sort(),
            "Result was not sorted properly"
          )

          assert.equal(before, after, 'Source data length changed unexpectedly!')
          done()
        }).
        catch(done)
    });
  });
});
