import PropTypes from 'prop-types';
import find from 'lodash/find';
import { uiTypes, allPropTypes } from './lib';

const searchUiPropTypes = /* istanbul ignore next */ fieldsMeta => ({
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
      const brokenField = find(props[propName], field => field.render && !field.render.component);

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
      const brokenField = find(props[propName], ({ name, component }) => !component && !fieldsMeta[name])

      if (brokenField) {
        return new Error(`${componentName}:
          Composite field "${brokenField.name}" in resultFields must have "component" property
        `);
      }
    }
  ),
  pagination: allPropTypes(
    PropTypes.shape({
      defaultMax: PropTypes.number,
      options: PropTypes.arrayOf(PropTypes.shape({
        max: PropTypes.number,
        label: PropTypes.string
      }))
    }),
    (props, propName, componentName) => { // eslint-disable-line consistent-return
      const pagination = props[propName];

      if (pagination && pagination.options.findIndex(({ max }) => max === pagination.defaultMax) === -1) {
        return new Error(`${componentName}:
          pagination.defaultMax "${props[propName].defaultMax}" should be equal to one of "max" in pagination.options
        `);
      }
    }
  )
})

export default /* istanbul ignore next */ ({ searchMeta, fieldsMeta }) => PropTypes.checkPropTypes(
  searchUiPropTypes(fieldsMeta),
  searchMeta,
  'property',
  'React-CrudEditor Search UI'
)
