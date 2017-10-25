import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { OCAlertsProvider } from '@opuscapita/react-alerts';
import ViewSwitcher from '../ViewSwitcher';
import { hardRedirectView } from '../../common/actions';

class CrudMain extends React.Component {
  constructor(...args) {
    super(...args);

    // Initial initialization (viewState structure is unknown and depends on viewName value):
    this.props.hardRedirectView({
      viewName: this.props.viewName,
      viewState: this.props.viewState
    });
  }

  componentWillReceiveProps({ viewName, viewState }) {
    // Re-initialization (viewState structure is unknown and depends on viewName value):
    this.props.hardRedirectView({ viewName, viewState });
  }

  render = _ => (<div>
    <ViewSwitcher modelDefinition={this.props.modelDefinition} />
    <OCAlertsProvider />
  </div>)
}

CrudMain.propTypes = {
  viewName: PropTypes.string,
  viewState: PropTypes.object,
  modelDefinition: PropTypes.object,
  hardRedirectView: PropTypes.func
}

export default connect(
  undefined,
  { hardRedirectView },
  undefined,
  { areOwnPropsEqual: _ => false }
)(CrudMain);
