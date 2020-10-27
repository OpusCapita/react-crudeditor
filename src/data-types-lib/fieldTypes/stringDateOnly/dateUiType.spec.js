import { expect } from 'chai';

import converter from './dateUiType';

describe('fieldTypes :: stringDateOnly <-> date', () => {
  it('should convert stringDateOnly to date', () => {
    const value = '2017-12-20';
    const result = converter.format(value);
    expect(result.valueOf()).to.equal(new Date(value).valueOf())
  });

  it('should convert date to stringDateOnly ("YYYY-MM-DD" String)', () => {
    const date = '2017-12-20';
    const value = new Date(date);
    const result = converter.parse(value);
    expect(result).to.equal(date)
  });
});
