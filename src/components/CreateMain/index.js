import React from 'react'
import PropTypes from 'prop-types'
import Heading from '../EditHeading';
import Tab from '../EditTab';
import WithFieldErrors from '../FieldErrors/WithFieldErrorsHOC';
import WithSpinner from '../Spinner/SpinnerOverlayHOC';
import { VIEW_NAME } from '../../crudeditor-lib/views/create/constants';

const CreateMain = ({ model, toggledFieldErrors, toggleFieldErrors }) => {
  const ActiveTabComponent = model.data.activeTab && model.data.activeTab.component;

  return (<div>
    <Heading model={model} />
    {ActiveTabComponent ?
      <ActiveTabComponent viewName={model.data.viewName} instance={model.data.formInstance} /> :
      <Tab model={model} toggledFieldErrors={toggledFieldErrors} toggleFieldErrors={toggleFieldErrors}/>
    }
  </div>)
}

CreateMain.propTypes = {
  model: PropTypes.shape({
    data: PropTypes.shape({
      viewName: PropTypes.oneOf([VIEW_NAME]).isRequired,
      formInstance: PropTypes.object.isRequired,
      activeTab: PropTypes.array
    }).isRequired
  }).isRequired,
  toggledFieldErrors: PropTypes.object.isRequired,
  toggleFieldErrors: PropTypes.func.isRequired
}

export default WithSpinner(WithFieldErrors(CreateMain));
