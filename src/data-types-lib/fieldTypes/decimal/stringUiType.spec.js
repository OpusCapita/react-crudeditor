import assert from 'assert'
import { I18nManager } from '@opuscapita/i18n';

import {
  ERROR_CODE_PARSING,
  ERROR_INVALID_DECIMAL
} from '../../constants';

import converter from './stringUiType';

describe('fieldTypes :: decimal <-> string', () => {
  const i18n = new I18nManager();

  it('should convert decimal to string', () => {
    const value = 10.12;
    const result = converter.format({ value, i18n });

    assert.strictEqual(
      result,
      i18n.formatDecimalNumber(value)
    )
  });

  it('should convert stringified decimal to decimal', () => {
    const value = '132.125';
    const result = converter.parse({ value, i18n });

    assert.strictEqual(
      result,
      i18n.parseDecimalNumber(value)
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
          id: ERROR_INVALID_DECIMAL,
          message: 'Invalid decimal number'
        }
      )
    }
  });
});
