import React from 'react'
import PropTypes from 'prop-types'
import Heading from '../EditHeading';
import Tab from '../EditTab';
import WithFieldErrors from '../FieldErrors/WithFieldErrorsHOC';
import WithSpinner from '../Spinner/SpinnerOverlayHOC';
import FormGrid from '../FormGrid';

const CreateMain = ({ model, fieldErrorsWrapper }) => {
  const ActiveTabComponent = model.data.activeTab && model.data.activeTab.Component;

  return (<div>
    <Heading model={model} />
    <Tab model={model} fieldErrorsWrapper={fieldErrorsWrapper}>
      {ActiveTabComponent ?
        <ActiveTabComponent viewName={model.data.viewName} instance={model.data.persistentInstance} /> :
        <FormGrid model={model} fieldErrorsWrapper={fieldErrorsWrapper}/>
      }
    </Tab>
  </div>)
}

CreateMain.propTypes = {
  model: PropTypes.object.isRequired,
  fieldErrorsWrapper: PropTypes.object
}

export default WithSpinner(WithFieldErrors(CreateMain));
