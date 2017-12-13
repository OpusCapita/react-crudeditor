import assert from 'assert'

import decimal from './decimal'

describe('uiTypes: decimal', () => {
  const vNumber = 14;
  const ivNumber = '23e';

  it('should return valid for decimal', () => {
    assert.strictEqual(
      decimal.isValid(vNumber),
      true
    );
  });

  it('should return valid for null', () => {
    assert.strictEqual(
      decimal.isValid(null),
      true
    );
  });

  it('should return null as empty value', () => {
    assert.strictEqual(
      decimal.EMPTY_VALUE,
      null
    );
  });

  it('should return invalid for not-a-decimal', () => {
    assert.strictEqual(
      decimal.isValid(ivNumber),
      false
    );
  });
});
