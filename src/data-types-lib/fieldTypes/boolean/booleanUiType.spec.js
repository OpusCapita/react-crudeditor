import { expect } from 'chai';
import converter from './booleanUiType';

describe('fieldTypes :: boolean <-> boolean', () => {
  it('should return itself for format', () => {
    expect(converter.format(true)).to.equal(true);
    expect(converter.format(false)).to.equal(false);
  });

  it('should return itself for parse', () => {
    expect(converter.parse(true)).to.equal(true);
    expect(converter.parse(false)).to.equal(false);
  });
});
