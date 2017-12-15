import React from 'react';
import PropTypes from 'prop-types';
import Heading from '../EditHeading';
import Tab from '../EditTab';
import WithFieldErrors from '../FieldErrors/WithFieldErrorsHOC';
import WithSpinner from '../Spinner/SpinnerOverlayHOC';

const EditMain = ({ model, toggledFieldErrors, toggleFieldErrors }) => {
  const ActiveTabComponent = model.data.activeTab && model.data.activeTab.component;

  return (<div>
    <Heading model={model} />
    {ActiveTabComponent ?
      <ActiveTabComponent viewName={model.data.viewName} instance={model.data.persistentInstance} /> :
      <Tab model={model} toggledFieldErrors={toggledFieldErrors} toggleFieldErrors={toggleFieldErrors}/>
    }
  </div>);
};

EditMain.propTypes = {
  model: PropTypes.object.isRequired,
  toggledFieldErrors: PropTypes.object.isRequired,
  toggleFieldErrors: PropTypes.func.isRequired
}

export default WithSpinner(WithFieldErrors(EditMain));
