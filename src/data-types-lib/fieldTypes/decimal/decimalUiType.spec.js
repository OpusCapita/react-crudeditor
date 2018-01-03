import { expect } from 'chai';
import converter from './decimalUiType';

describe('fieldTypes :: decimal <-> decimal', () => {
  it('should return itself for format', () => {
    const value = 10.12;
    const result = converter.format({ value });

    expect(result).to.equal(value);
  });

  it('should return itself for parse', () => {
    const value = 10.12;
    const result = converter.parse({ value });

    expect(result).to.equal(value);
  });
});
