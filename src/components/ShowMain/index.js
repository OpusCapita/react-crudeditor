import React from 'react'
import PropTypes from 'prop-types'
import Heading from '../EditHeading';
import Tab from '../EditTab';
import WithSpinner from '../Spinner/SpinnerOverlayHOC';
import FormGrid from '../FormGrid';

const ShowMain = (props) => {
  const { model } = props;
  const ActiveTabComponent = model.data.activeTab && model.data.activeTab.Component;

  return (<div>
    <Heading model={model} />

    <Tab model={model}>
      {ActiveTabComponent ?
        <ActiveTabComponent viewName={model.data.viewName} instance={model.data.persistentInstance} /> :
        <FormGrid model={model}/>
      }
    </Tab>
  </div>);
};

ShowMain.propTypes = {
  model: PropTypes.object.isRequired
}

export default WithSpinner(ShowMain);
