import { expect } from 'chai';

import converter from './dateUiType';

describe('fieldTypes :: stringDate <-> date', () => {
  it('should convert stringDate to date', () => {
    const value = '2017-12-2';
    const result = converter.format(value);

    expect(result.valueOf()).to.equal(new Date(value).valueOf())
  });

  it('should convert date to stringDate (ISO String)', () => {
    const value = new Date();
    const result = converter.parse(value);

    expect(result).to.equal(value.toISOString())
  });
});
