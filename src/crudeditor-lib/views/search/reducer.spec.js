import { assert } from 'chai';
import { buildDefaultStoreState } from './reducer';
import {
  DEFAULT_OFFSET,
  DEFAULT_ORDER
} from './constants';

describe('search view reducer', () => {
  describe('buildDefaultStoreState', () => {
    const fields = [
      { name: 'one' },
      { name: 'two' },
      { name: 'three' },
      { name: 'four' }
    ];

    fields.forEach(field => {
      field.render = { // eslint-disable-line no-param-reassign
        value: {
          converter: {
            format: value => value
          }
        }
      }
    });

    const modelDefinition = {
      ui: {
        search: {
          searchableFields: [
            ...fields
          ],
          resultFields: [
            ...fields
          ],
          pagination: {
            defaultMax: 30
          }
        }
      }
    }

    it('should return default state', () => {
      const result = buildDefaultStoreState(modelDefinition);

      assert.deepEqual(
        result, {
          resultFilter: {
            one: null,
            two: null,
            three: null,
            four: null
          },
          formFilter: {
            one: null,
            two: null,
            three: null,
            four: null
          },
          formattedFilter: {
            one: null,
            two: null,
            three: null,
            four: null
          },
          sortParams: {
            field: 'one',
            order: DEFAULT_ORDER
          },
          pageParams: {
            max: modelDefinition.ui.search.pagination.defaultMax,
            offset: DEFAULT_OFFSET
          },
          selectedInstances: [],
          errors: {
            fields: {}
          },
          status: 'uninitialized',
          hideSearchForm: false,
          resultInstances: undefined,
          totalCount: undefined,
          gotoPage: ''
        }
      )
    });
  });
});
