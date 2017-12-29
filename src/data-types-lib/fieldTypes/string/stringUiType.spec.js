import { expect } from 'chai';
import converter from './stringUiType';

describe('fieldTypes :: string <-> string', () => {
  it('should return itself for format', () => {
    const value = 'ewrewrewrw2342rwe';
    const result = converter.format({ value });

    expect(result).to.equal(value);
  });

  it('should return itself for parse if not empty string', () => {
    const value = 'ewrewrewrw2342rwe';
    const result = converter.parse({ value });

    expect(result).to.equal(value);
  });

  it('should return null for parse if empty string', () => {
    const value = '';
    const result = converter.parse({ value });

    expect(result).to.equal(null);
  });
});
