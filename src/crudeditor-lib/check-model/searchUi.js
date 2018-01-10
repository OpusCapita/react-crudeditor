import PropTypes from 'prop-types';
import { uiTypes } from './lib';

const searchUiPropTypes = {
  searchableFields: PropTypes.arrayOf(PropTypes.shape({
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
  })),
  resultFields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    sortable: PropTypes.bool,
    sortByDefault: PropTypes.bool,
    textAlignment: PropTypes.oneOf(['left', 'center', 'right']),
    component: PropTypes.func
  })),
  standardOperations: PropTypes.objectOf(PropTypes.func)
}

export default searchUi => PropTypes.checkPropTypes(
  searchUiPropTypes,
  searchUi,
  'property',
  'React-CrudEditor Search UI'
)
