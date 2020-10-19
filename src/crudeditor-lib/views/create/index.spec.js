import { expect } from 'chai';
import { getUi } from './';
import { DEFAULT_FIELD_TYPE } from '../../common/constants';

describe('create view / index / getUi', () => {
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
    const result = getUi({ modelDefinition })

    expect(result).to.have.ownProperty('defaultNewInstance');
    expect(result).to.have.ownProperty('formLayout');

    expect(result.defaultNewInstance).to.be.instanceof(Function);
    expect(result.formLayout).to.be.instanceof(Function);
  })
})
