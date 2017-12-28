import assert from 'assert'
import { I18nManager } from '@opuscapita/i18n';

import {
  ERROR_CODE_PARSING,
  ERROR_INVALID_INTEGER
} from '../../constants';

import converter from './stringUiType';

describe('fieldTypes :: decimal <-> string', () => {
  const i18n = new I18nManager();

  it('should convert integer to string', () => {
    const value = 1012567;
    const result = converter.format({ value, i18n });

    assert.strictEqual(
      result,
      i18n.formatNumber(value)
    )
  });

  it('should convert stringified integer to decimal', () => {
    const value = '132345';
    const result = converter.parse({ value, i18n });

    assert.strictEqual(
      result,
      i18n.parseNumber(value)
    )
  });

  it('should throw for unparsable value', () => {
    const value = 'sdfsdfdsf';

    try {
      converter.parse({ value, i18n })
      assert(false)
    } catch (e) {
      assert.deepEqual(
        e, {
          code: ERROR_CODE_PARSING,
          id: ERROR_INVALID_INTEGER,
          message: 'Invalid integer'
        }
      )
    }
  });

  it('should throw for decimal string value', () => {
    const value = '12.21';

    try {
      converter.parse({ value, i18n })
      assert(false)
    } catch (e) {
      assert.deepEqual(
        e, {
          code: ERROR_CODE_PARSING,
          id: ERROR_INVALID_INTEGER,
          message: 'Invalid integer'
        }
      )
    }
  });
});
