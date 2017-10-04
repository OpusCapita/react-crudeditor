import React from 'react';

import { connect } from 'react-redux';
import ViewSwitcher from '../ViewSwitcher';
import { initializeView } from '../../common/actions';

@connect(
  undefined,
  { initializeView }
)
export default class extends React.PureComponent {
  constructor(...args) {
    super(...args);

    // Initial initialization (viewState structure is unknown and depends on viewName value):
    this.props.initializeView({
      viewName: this.props.viewName,
      viewState: this.props.viewState
    });
  }

  componentWillReceiveProps({ viewName, viewState }) {
    // Re-initialization (viewState structure is unknown and depends on viewName value):
    this.props.initializeView({ viewName, viewState });
  }

  render = _ => <ViewSwitcher modelDefinition={this.props.modelDefinition} />
}
