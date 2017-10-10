import assert from 'assert'

import number from './number'

describe('uiTypes: number', () => {
  const vNumber = 14;
  const ivNumber = '23e';

  it('should return valid for number', () => {
    assert.strictEqual(
      number.isValid(vNumber),
      true
    );
  });

  it('should return valid for null', () => {
    assert.strictEqual(
      number.isValid(null),
      true
    );
  });

  it('should return null as empty value', () => {
    assert.strictEqual(
      number.EMPTY_VALUE,
      null
    );
  });

  it('should return invalid for not-a-number', () => {
    assert.strictEqual(
      number.isValid(ivNumber),
      false
    );
  });
});
