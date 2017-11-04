import React from 'react'
import PropTypes from 'prop-types'
import Heading from '../EditHeading';
import Tab from '../EditTab';
import SpinnerOverlay from '../Spinner/SpinnerOverlay';
import FormGrid from '../FormGrid';

const ShowMain = (props) => {
  const { model } = props;
  const ActiveTabComponent = model.data.activeTab && model.data.activeTab.Component;

  const spinnerElement = model.data.isLoading ? (<SpinnerOverlay />) : null;

  return (<div className="ready-for-spinner">
    {spinnerElement}
    <div className={`${model.data.isLoading ? 'under-active-spinner' : ''}`}>
      <Heading model={model} />
      {ActiveTabComponent ?
        <ActiveTabComponent viewName={model.data.viewName} instance={model.data.persistentInstance} /> :
        <Tab model={model}>
          <FormGrid model={model}/>
        </Tab>
      }
    </div>
  </div>);
};

ShowMain.propTypes = {
  model: PropTypes.object.isRequired
}

export default ShowMain;
