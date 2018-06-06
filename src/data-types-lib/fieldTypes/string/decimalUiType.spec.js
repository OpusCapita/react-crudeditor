import { expect } from 'chai';
import assert from 'assert';
import {
  ERROR_CODE_FORMATING,
  ERROR_INVALID_DECIMAL
} from '../../constants';

import converter from './decimalUiType';

describe('fieldTypes :: string <-> decimal', () => {
  it('should convert stringified decimal to decimal', () => {
    const value = '213.21';
    const result = converter.format(value);

    expect(result).to.equal(213.21)
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
          id: ERROR_INVALID_DECIMAL,
          message: 'Invalid decimal number'
        }
      )
    }
  });

  it('should stringify decimal', () => {
    const value = 23432.323;

    expect(converter.parse(value)).to.equal(String(value));
  });
});
