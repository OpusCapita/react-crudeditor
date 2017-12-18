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
  model: PropTypes.shape({
    data: PropTypes.shape({
      activeTab: PropTypes.array.isRequired,
      viewName: PropTypes.string.isRequired,
      persistentInstance: PropTypes.object.isRequired
    }).isRequired
  })
}

export default WithSpinner(ShowMain);
