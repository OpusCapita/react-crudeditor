import superagent from 'superagent'
import DateRangeCellRender from './DateRangeCellRender';
import StatusField from './StatusField';

export default urlMapper => ({
  name: 'contract',
  api: {
    get(id) {
      return superagent.
        get('/api/contracts/' + encodeURIComponent(id)).
        accept('json').
        then(({ body }) => body);
    },
    search(filter, { sort, order, offset, max }) {
      return superagent.
        get('/api/contracts').
        query({filter, sort, order, offset, max}).
        accept('json').
        then(({
          header: {
            'content-range': contentRange
          },
          body: entities
        }) => ({
          totalCount: Number(contentRange.substring(contentRange.indexOf('/') + 1)),
          entities
        }));
    },
    delete(ids) {
      return superagent.
        del('/api/contracts').
        send(ids).
        accept('json').
        then(({ body: entityIds }) => entityIds);
    },
    create(object) {
      return superagent.
        post('/api/contracts').
        send(object).
        accept('json');
    },
    save(object) {
      const {contractId} = object;
      return superagent.
        put('/api/contracts/' + encodeURIComponent(contractId)).
        send(object).
        accept('json');
    }
  },
  search: {
    criteria: {
      fields: [
        {
          name: 'contractId',
          //default: 'car'
        },
        {
          name: 'description'
        },
        {
          name: 'extContractId'
        },
        {
          name: 'extContractLineId'
        },
        {
          name: 'statusId',
          Component: StatusField
        },
      ]
    },
    result: {
      fields: [
        {
          name: 'contractId',
          sortable: true,
        },
        {
          name: 'description',
          sortable: true,
        },
        {
          name: 'extContractId',
          sortable: true,
        },
        {
          name: 'extContractLineId',
          sortable: true
        },
        {
          name: 'validRange',
          Component: DateRangeCellRender
        }
      ],
      pagination: {
        max: 4
      }
    }
  },
  edit: {

  },
  externalOperations: [{
    operation(contract) {
      urlMapper.revisions(contract.contractId);
    },
    name: 'revisions'
  }, {
    operation() {
      urlMapper.google();
    },
    name: 'google'
  }]
});
