import PropTypes from 'prop-types';
import { allowedAny, allPropTypes } from './lib';

import {
  PERMISSION_CREATE,
  PERMISSION_DELETE,
  PERMISSION_EDIT,
  PERMISSION_VIEW
} from '../common/constants';

const modelPropTypes = modelDefinition => ({
  model: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fields: allPropTypes(
      PropTypes.objectOf(PropTypes.shape({
        unique: PropTypes.bool,
        type: PropTypes.string,
        constraints: PropTypes.shape({
          max: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.instanceOf(Date),
            PropTypes.string
          ]),
          min: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.instanceOf(Date),
            PropTypes.string
          ]),
          required: PropTypes.bool,
          email: PropTypes.bool,
          matches: PropTypes.instanceOf(RegExp),
          url: PropTypes.bool,
          validate: PropTypes.func
        })
      })).isRequired,
      (props, propName, componentName) => {
        if (!props[propName]) {
          return; // don't duplicate an Error because it'll be returned by 'isRequired' above
        }
        const noUniqueFields = Object.keys(props[propName]).
          filter(fieldName => props[propName][fieldName].unique).length === 0;

        if (noUniqueFields) {
          // eslint-disable-next-line consistent-return
          return new Error(`${componentName}: At least one field should have property 'unique: true'.`);
        }
      }
    ),
    validate: PropTypes.func
  }).isRequired,
  permissions: PropTypes.shape({
    crudOperations: PropTypes.shape({
      [PERMISSION_CREATE]: PropTypes.bool,
      [PERMISSION_EDIT]: PropTypes.bool,
      [PERMISSION_DELETE]: PropTypes.bool,
      [PERMISSION_VIEW]: PropTypes.bool
    }).isRequired
  }).isRequired,
  api: PropTypes.shape({
    get: allowedAny([PERMISSION_VIEW, PERMISSION_EDIT], modelDefinition) ?
      PropTypes.func.isRequired : PropTypes.func,
    search: allowedAny([PERMISSION_VIEW, PERMISSION_EDIT], modelDefinition) ?
      PropTypes.func.isRequired : PropTypes.func,
    delete: allowedAny([PERMISSION_DELETE], modelDefinition) ? PropTypes.func.isRequired : PropTypes.func,
    create: allowedAny([PERMISSION_CREATE], modelDefinition) ? PropTypes.func.isRequired : PropTypes.func,
    update: allowedAny([PERMISSION_EDIT], modelDefinition) ? PropTypes.func.isRequired : PropTypes.func,
  }),
  ui: PropTypes.shape({
    spinner: PropTypes.func,
    search: PropTypes.func,
    instanceLabel: PropTypes.func,
    create: PropTypes.shape({
      defaultNewInstance: PropTypes.func,
      formLayout: PropTypes.func
    }),
    edit: PropTypes.shape({
      formLayout: PropTypes.func,
      standardOperations: PropTypes.shape({
        delete: PropTypes.func
      })
    }),
    show: PropTypes.shape({
      formLayout: PropTypes.func
    }),
    customViews: PropTypes.objectOf(PropTypes.func),
    operations: PropTypes.func
  })
})

export default modelDefinition => PropTypes.checkPropTypes(
  modelPropTypes(modelDefinition),
  modelDefinition,
  'property',
  'React-CrudEditor Model'
)
