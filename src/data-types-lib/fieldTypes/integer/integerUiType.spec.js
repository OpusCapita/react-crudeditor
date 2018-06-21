import { expect } from 'chai';
import converter from './integerUiType';

describe('fieldTypes :: integer <-> integer', () => {
  it('should return itself for format', () => {
    const value = 1012;
    const result = converter.format(value);

    expect(result).to.equal(value);
  });

  it('should return itself for parse', () => {
    const value = 1012;
    const result = converter.parse(value);

    expect(result).to.equal(value);
  });
});
