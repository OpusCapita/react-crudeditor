import { expect } from 'chai';
import { getUi } from './';
import { DEFAULT_FIELD_TYPE } from '../../common/constants';

describe('edit view / index / getUi', () => {
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
    expect(result).to.have.ownProperty('formLayout');
    expect(result.formLayout).to.be.instanceof(Function);
  })
})
