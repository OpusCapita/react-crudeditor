import superagent from 'superagent'
import DateRangeCellRender from './DateRangeCellRender';
import StatusField from './StatusField';

export default {
  model: {
    name: "Contract",
    idField: "contractId",
    fields: {
      "contractBoilerplates": {"type": "collection", "constraints": {"required": false}},
      "hierarchyCode": {"type": "string", "constraints": {"max": 100, "required": false}},
      "termsOfPaymentId": {"type": "string", "constraints": {"max": 20, "required": false}},
      "description": {"type": "string", "constraints": {"max": 100, "required": false}},
      "termsOfDeliveryId": {"type": "string", "constraints": {"max": 20, "required": false}},
      "freeShippingBoundary": {"type": "number", "constraints": {"min": 0, "max": 999999999, "required": false}},
      "createdOn": {"type": "date", "constraints": {"required": true}},
      "changedOn": {"type": "date", "constraints": {"required": true}},
      "contractedCatalogs": {"type": "collection", "constraints": {"required": false}},
      "minOrderValueRequired": {"type": "boolean", "constraints": {"required": false}},
      "contractedClassificationGroups": {"type": "collection", "constraints": {"required": false}},
      "extContractId": {"type": "string", "constraints": {"max": 10, "required": false}},
      "children": {"type": "collection", "constraints": {"required": false}},
      "changedBy": {"type": "string", "constraints": {"required": true}},
      "translations": {"type": "collection", "constraints": {"required": false}},
      "usages": {"type": "collection", "constraints": {"required": false}},
      "currencyId": {"type": "string", "constraints": {"max": 3, "required": false}},
      "isFrameContract": {"type": "boolean", "constraints": {"required": false}},
      "totalContractedAmount": {"type": "number", "constraints": {"min": 0, "max": 999999999, "required": false}},
      "smallVolumeSurcharge": {"type": "number", "constraints": {"min": 0, "max": 999999999, "required": false}},
      "provisionings": {"type": "collection", "constraints": {"required": false}},
      "isOffer": {"type": "boolean", "constraints": {"required": false}},
      "maxOrderValue": {"type": "number", "constraints": {"min": 0, "max": 999999999, "required": false}},
      "validRange": {"type": "com.jcatalog.core.DateRange", "constraints": {"required": false}},
      "isPreferred": {"type": "boolean", "constraints": {"required": false}},
      "isInternal": {"type": "boolean", "constraints": {"required": false}},
      "contractCategory": {"type": "com.jcatalog.contract.ContractCategory", "constraints": {"required": false}},
      "freightSurcharge": {"type": "number", "constraints": {"min": 0, "max": 999999999, "required": false}},
      "isStandard": {"type": "boolean", "constraints": {"required": false}},
      "statusId": {"type": "string", "constraints": {"max": 20, "required": true}},
      "createdBy": {"type": "string", "constraints": {"required": true}},
      "extContractLineId": {"type": "string", "constraints": {"max": 10, "required": false}},
      "contractId": {"type": "string", "constraints": {"max": 100, "required": true}},
      "parentContract": {"type": "com.jcatalog.contract.Contract", "constraints": {"required": false}},
      "minOrderValue": {"type": "number", "constraints": {"min": 0, "max": 999999999, "required": false}}
    }
  },
  api: {
    get(id) {
      return superagent.
        get('/api/contracts/' + encodeURIComponent(id)).
        accept('json').
        then(({ body }) => body);
    },
    search({ filter, sort, order, offset, max }) {
      return superagent.
        get('/api/contracts').
        query({ filter, sort, order, offset, max }).
        accept('json').
        then(({
          header: {
            'content-range': contentRange
          },
          body: instances
        }) => ({
          totalCount: Number(contentRange.substring(contentRange.indexOf('/') + 1)),
          instances
        }));
    },
    delete(ids) {
      return superagent.
        del('/api/contracts').
        send(ids).
        accept('json').
        then(({ body: deletedCount }) => deletedCount);
    },
    create(instance) {
      return superagent.
        post('/api/contracts').
        send(instance).
        accept('json');
    },
    update(instance) {
      const {contractId} = instance;
      return superagent.
        put('/api/contracts/' + encodeURIComponent(contractId)).
        send(instance).
        accept('json');
    }
  },
  ui: {
    search() {
      return {
        searchableFields: [{
          name: 'contractId',
        }, {
          name: 'description'
        }, {
          name: 'extContractId'
        }, {
          name: 'extContractLineId'
        }, {
          name: 'statusId'
          //Component: StatusField
        }],
        resultFields: [{
          name: 'contractId',
          sortable: true,
        }, {
          name: 'description',
          sortable: true,
        }, {
          name: 'extContractId',
          sortable: true,
        }, {
          name: 'extContractLineId',
          sortable: true
        }, {
          name: 'validRange'
          //Component: DateRangeCellRender
        }]
      };
    }
  }
};
