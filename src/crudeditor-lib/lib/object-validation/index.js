import PropTypes from 'prop-types';
import modelPropTypes from './propTypes/modelDefinition';
import searchUiPropTypes from './propTypes/search-ui';
import formLayoutPropTypes from './propTypes/formLayout';

export const checkModelDefinition = modelDefinition => PropTypes.
  checkPropTypes(
    modelPropTypes(modelDefinition),
    modelDefinition,
    'property',
    'React-CrudEditor Model'
  )

export const checkSearchUi = searchUi => PropTypes.
  checkPropTypes(
    searchUiPropTypes,
    searchUi,
    'property',
    'React-CrudEditor Search UI'
  )

export const checkFormLayout = formLayout => PropTypes.
  checkPropTypes(
    formLayoutPropTypes,
    { formLayout },
    'property',
    'React-CrudEditor Form Layout'
  )
