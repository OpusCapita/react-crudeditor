import { assert, expect } from 'chai';
import { cleanFilter, getDefaultSortField } from './lib';
import { EMPTY_FIELD_VALUE } from '../../common/constants';

describe('search view lib', () => {
  describe('cleanFilter', () => {
    const filter = {
      'firstField': null,
      'secondField': 'second value',
      'thirdField': 10
    }

    it('should return filter with not-null values only', () => {
      const result = cleanFilter(filter);
      assert.deepEqual(
        result, Object.keys(filter).filter(key => filter[key] !== EMPTY_FIELD_VALUE).reduce(
          (acc, cur) => ({ ...acc, [cur]: filter[cur] }), undefined
        )
      )
    });

    it('should return undefined for filter with all null values', () => {
      const result = cleanFilter(Object.keys(filter).reduce((acc, cur) => ({ ...acc, [cur]: null }), undefined));
      expect(result).to.not.exist; // eslint-disable-line no-unused-expressions
    });
  });

  describe('getDefaultSortField', () => {
    const searchMeta = {
      resultFields: [
        { name: 'first' },
        { name: 'second' },
        { name: 'third' }
      ]
    }

    it(`should return first field name if no 'sortByDefault' found`, () => {
      const result = getDefaultSortField(searchMeta);
      expect(result).to.equal(searchMeta.resultFields[0].name)
    });

    it(`should return field name with 'sortByDefault' prop`, () => {
      searchMeta.resultFields[2].sortByDefault = true;
      const result = getDefaultSortField(searchMeta);
      expect(result).to.equal(searchMeta.resultFields[2].name)
    });
  });
});
