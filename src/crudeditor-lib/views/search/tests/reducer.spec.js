// import '../../../../../tests/utils';
import buildReducer from '../reducer';
import { MIN_ENTITY_CONFIGURATION } from './constants';

describe('search reducer', () => {
  it('should return the initial state', () => {
    const modelDefinition = {
      model: {
        fields: {
          'contractId': {},
          'description': {},
          'extContractId': {},
          'extContractLineId': {},
          'statusId': {},
          'contractBoilerplates': {},
          'maxOrderValue': {}
        }
      },
      ui: {
        search: _ => ({
          searchableFields: [
            { name: 'contractId', },
            { name: 'description' }
          ],
          resultFields: [
            { name: 'contractId' },
            { name: 'extContractId' },
            { name: 'extContractLineId', sortByDefault: true },
            { name: 'validRange' }
          ]
        })
      }
    };

    const reducer = buildReducer(modelDefinition);

    expect(reducer(undefined, {})).toEqual({
      resultInstances: undefined,
      selectedInstances: [],
      status: 'search/UNINITIALIZED',
      totalCount: undefined,
      sortParams: {
        field: 'extContractLineId',
        order: 'asc'
      },
      pageParams: {
        max: 30,
        offset: 0
      },
      resultFilter: {
        contractId: undefined,
        description: undefined
      },
      formFilter: {
        contractId: undefined,
        description: undefined
      }
    });
  });

  it('should handle INSTANCES_SEARCH_SUCCESS', () => {
    const reducer = buildReducer(MIN_ENTITY_CONFIGURATION);

    expect(reducer(undefined, {
      type: 'search/INSTANCES_SEARCH_SUCCESS',
      payload: {
        instances: [
          {
            contractId: 'car001',
            description: 'Automobile',
          },
          {
            contractId: 'hrs001',
            description: 'Dienstleistungen',
          },
          {
            contractId: 'lyr001',
            description: 'Lyreco Büroartikel',
          }
        ],
        totalCount: 4,
        filter: {
          description: 'l'
        },
        sort: 'description',
        order: 'asc',
        max: 3,
        offset: 0
      },
      meta: {}
    })).toEqual({
      resultFilter: {
        description: 'l'
      },
      formFilter: {
        description: 'l'
      },
      sortParams: {
        field: 'description',
        order: 'asc'
      },
      pageParams: {
        max: 3,
        offset: 0
      },
      resultInstances: [
        {
          contractId: 'car001',
          description: 'Automobile',
        },
        {
          contractId: 'hrs001',
          description: 'Dienstleistungen',
        },
        {
          contractId: 'lyr001',
          description: 'Lyreco Büroartikel',
        }
      ],
      selectedInstances: [],
      totalCount: 4,
      status: 'search/READY'
    });
  });
});
