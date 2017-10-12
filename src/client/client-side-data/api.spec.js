import assert from 'assert';
import entries from 'object.entries';
import {
  get,
  create,
  update,
  deleteMany,
  getNumberOfInstances,
  getContracts
} from './api';

if (!Object.entries) {
  entries.shim();
}

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

describe('get ', () => {
  const before = getNumberOfInstances();
  it('should get a contract instance', () => {
    const instance = get({ instance: { "contractId": realInstance.contractId } });
    const after = getNumberOfInstances();
    assert.deepEqual(
      instance,
      realInstance
    );
    assert.equal(before, after)
  });
});

describe('create ', () => {
  const instance = { "contractId": "t0tALly RanD0m ContracT ID", "description": "random description" };

  it('should return a saved contract instance', () => {
    const before = getNumberOfInstances();
    const savedInstance = create({ instance });
    const after = getNumberOfInstances();
    assert.deepEqual(
      instance,
      savedInstance
    );
    assert.equal(before + 1, after)
  });

  it('should return Error if contract already exists', () => {
    const error = create({ instance });
    assert.equal(
      error instanceof Error,
      true
    );
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
      result,
      updatedInstance
    );
    assert.equal(before, after)
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
    assert.equal(before - numToDelete, after)
  });
});
