import PropTypes from 'prop-types';
import { uiTypes, allPropTypes } from './lib';

const searchUiPropTypes = fieldsMeta => ({
  searchableFields: allPropTypes(
    PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      render: PropTypes.shape({
        component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
        props: PropTypes.object,
        value: PropTypes.shape({
          propName: PropTypes.string,
          type: PropTypes.oneOf(uiTypes),
          converter: PropTypes.shape({
            format: PropTypes.func,
            parse: PropTypes.func
          })
        })
      })
    })).isRequired,
    (props, propName, componentName) => { // eslint-disable-line consistent-return
      const brokenField = props[propName].find(field => field.render && !field.render.component);

      if (brokenField) {
        return new Error(`${componentName}:
          searchableField "${brokenField.name}" must have render.component since custom render is specified
        `);
      }
    }
  ),
  resultFields: allPropTypes(
    PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      sortByDefault: PropTypes.bool,
      textAlignment: PropTypes.oneOf(['left', 'center', 'right']),
      component: PropTypes.func
    })).isRequired,
    (props, propName, componentName) => { // eslint-disable-line consistent-return
      const brokenField = props[propName].find(({ name, component }) => !component && !fieldsMeta[name]);

      if (brokenField) {
        return new Error(`${componentName}:
          Composite field "${brokenField.name}" in resultFields must have "component" property
        `);
      }
    }
  ),
  standardOperations: PropTypes.objectOf(PropTypes.func)
})

export default ({ searchMeta, fieldsMeta }) => PropTypes.checkPropTypes(
  searchUiPropTypes(fieldsMeta),
  searchMeta,
  'property',
  'React-CrudEditor Search UI'
)
