import React from 'react';
import PropTypes from 'prop-types';
import Heading from '../EditHeading';
import Tab from '../EditTab';
import WithFieldErrors from '../FieldErrors/WithFieldErrorsHOC';
import WithSpinner from '../Spinner/SpinnerOverlayHOC';
import FormGrid from '../FormGrid';

const EditMain = ({ model, fieldErrors }) => {
  const ActiveTabComponent = model.data.activeTab && model.data.activeTab.component;
  return (<div>
    <Heading model={model} />
    {ActiveTabComponent ?
      <ActiveTabComponent viewName={model.data.viewName} instance={model.data.persistentInstance} /> :
      <Tab model={model} fieldErrors={fieldErrors}>
        <FormGrid model={model} fieldErrors={fieldErrors}/>
      </Tab>
    }
  </div>);
};

EditMain.propTypes = {
  model: PropTypes.object.isRequired,
  fieldErrorsWrapper: PropTypes.object
}

export default WithSpinner(WithFieldErrors(EditMain));
