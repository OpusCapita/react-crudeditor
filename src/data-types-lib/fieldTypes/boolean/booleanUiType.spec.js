import { expect } from 'chai';
import converter from './booleanUiType';

describe('fieldTypes :: boolean <-> boolean', () => {
  it('should return itself for format', () => {
    expect(converter.format({ value: true })).to.equal(true);
    expect(converter.format({ value: false })).to.equal(false);
  });

  it('should return itself for parse', () => {
    expect(converter.parse({ value: true })).to.equal(true);
    expect(converter.parse({ value: false })).to.equal(false);
  });
});
