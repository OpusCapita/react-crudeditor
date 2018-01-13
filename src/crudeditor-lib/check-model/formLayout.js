import PropTypes from 'prop-types';
import { uiTypes } from './lib';

const fieldPropTypes = PropTypes.shape({
  field: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  render: PropTypes.shape({
    component: PropTypes.func.isRequired,
    props: PropTypes.object,
    value: PropTypes.shape({
      converter: PropTypes.shape({
        format: PropTypes.func,
        parse: PropTypes.func
      }),
      propName: PropTypes.string,
      type: PropTypes.oneOf(uiTypes)
    })
  })
})

const formLayoutPropTypes = {
  formLayout: PropTypes.arrayOf(PropTypes.arrayOf(
    PropTypes.oneOfType([
      fieldPropTypes,
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          fieldPropTypes,
          PropTypes.array
        ])
      )
    ])
  ))
}

export default formLayout => PropTypes.checkPropTypes(
  formLayoutPropTypes,
  { formLayout },
  'property',
  'React-CrudEditor Form Layout'
)
