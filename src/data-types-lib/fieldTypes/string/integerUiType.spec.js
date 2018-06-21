import { expect } from 'chai';
import assert from 'assert';
import {
  ERROR_CODE_FORMATING,
  ERROR_INVALID_INTEGER
} from '../../constants';

import converter from './integerUiType';

describe('fieldTypes :: string <-> integer', () => {
  it('should convert stringified integer to integer', () => {
    const value = '21321';
    const result = converter.format(value);

    expect(result).to.equal(21321)
  });

  it('should throw for decimal number', () => {
    const value = '132.125';

    try {
      converter.format(value);
      assert(false)
    } catch (e) {
      assert.deepEqual(
        e, {
          code: ERROR_CODE_FORMATING,
          id: ERROR_INVALID_INTEGER,
          message: 'Invalid integer'
        }
      )
    }
  });

  it('should throw for not a number', () => {
    const value = '23Hello';

    try {
      converter.format(value);
      assert(false)
    } catch (e) {
      assert.deepEqual(
        e, {
          code: ERROR_CODE_FORMATING,
          id: ERROR_INVALID_INTEGER,
          message: 'Invalid integer'
        }
      )
    }
  });

  it('should stringify integer', () => {
    const value = 2342423423;

    expect(converter.parse(value)).to.equal(String(value));
  });
});
