import { expect } from 'chai';
import { getUi } from './';
import { DEFAULT_FIELD_TYPE } from '../../common/constants';

describe('search view / index / getUi', () => {
  const fieldName = 'id';

  const modelDefinition = {
    model: {
      fields: {
        [fieldName]: {
          type: DEFAULT_FIELD_TYPE
        }
      }
    },
    ui: {}
  }

  it('should generate proper ui', () => {
    const result = getUi(modelDefinition)
    expect(result).to.have.ownProperty('resultFields');
    expect(result).to.have.ownProperty('searchableFields');

    expect(result.resultFields[0]).to.have.ownProperty('format');
    expect(result.searchableFields[0]).to.have.ownProperty('render');

    expect(result.resultFields[0].name).to.equal(fieldName);
    expect(result.searchableFields[0].name).to.equal(fieldName);
  })
})
