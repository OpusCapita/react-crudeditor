import PropTypes from 'prop-types';
import { allowedSome, allPropTypes } from './lib';

import {
  PERMISSION_CREATE,
  PERMISSION_DELETE,
  PERMISSION_EDIT,
  PERMISSION_VIEW
} from '../common/constants';

const modelPropTypes = /* istanbul ignore next */ modelDefinition => ({
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
    crudOperations: allPropTypes(
      PropTypes.shape({
        [PERMISSION_CREATE]: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        [PERMISSION_EDIT]: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        [PERMISSION_DELETE]: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        [PERMISSION_VIEW]: PropTypes.oneOfType([PropTypes.bool, PropTypes.func])
      }).isRequired,
      (props, propName, componentName) => {
        if (!props || !props[propName]) {
          return; // don't duplicate an Error because it'll be returned by 'isRequired' above
        }
        if (
          !Object.keys(props[propName]).some(
            p => props[propName][p] === true || props[propName][p] instanceof Function
          )
        ) {
          // eslint-disable-next-line consistent-return,max-len
          return new Error(`${componentName}: At least one field in permissions.crudOperations must be defined as boolean 'true' OR function, otherwise all operations are forbidden`);
        }
      }
    )
  }).isRequired,
  api: PropTypes.shape({
    get: allowedSome([PERMISSION_VIEW, PERMISSION_EDIT], modelDefinition) ?
      PropTypes.func.isRequired : PropTypes.func,
    search: allowedSome([PERMISSION_VIEW, PERMISSION_EDIT], modelDefinition) ?
      PropTypes.func.isRequired : PropTypes.func,
    delete: allowedSome([PERMISSION_DELETE], modelDefinition) ? PropTypes.func.isRequired : PropTypes.func,
    create: allowedSome([PERMISSION_CREATE], modelDefinition) ? PropTypes.func.isRequired : PropTypes.func,
    update: allowedSome([PERMISSION_EDIT], modelDefinition) ? PropTypes.func.isRequired : PropTypes.func,
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
      formLayout: PropTypes.func
    }),
    show: PropTypes.shape({
      formLayout: PropTypes.func
    }),
    customViews: PropTypes.objectOf(PropTypes.func),
    customOperations: PropTypes.func
  })
})

export default /* istanbul ignore next */ modelDefinition => PropTypes.checkPropTypes(
  modelPropTypes(modelDefinition),
  modelDefinition,
  'property',
  'React-CrudEditor Model'
)
