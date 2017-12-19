import React from 'react'
import PropTypes from 'prop-types'
import Heading from '../EditHeading';
import Tab from '../EditTab';
import WithSpinner from '../Spinner/SpinnerOverlayHOC';
import { VIEW_NAME } from '../../crudeditor-lib/views/show/constants';

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
      activeTab: PropTypes.array,
      viewName: PropTypes.oneOf([VIEW_NAME]).isRequired,
      persistentInstance: PropTypes.object.isRequired
    }).isRequired
  })
}

export default WithSpinner(ShowMain);
