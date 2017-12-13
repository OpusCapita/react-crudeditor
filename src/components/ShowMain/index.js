import React from 'react'
import PropTypes from 'prop-types'
import Heading from '../EditHeading';
import Tab from '../EditTab';
import WithSpinner from '../Spinner/SpinnerOverlayHOC';

const ShowMain = (props) => {
  const { model } = props;
  const ActiveTabComponent = model.data.activeTab && model.data.activeTab.component;

  return (<div>
    <Heading model={model} />
    {ActiveTabComponent ?
      <ActiveTabComponent viewName={model.data.viewName} instance={model.data.persistentInstance} /> :
      <Tab model={model}/>
    }
  </div>);
};

ShowMain.propTypes = {
  model: PropTypes.object.isRequired
}

export default WithSpinner(ShowMain);
