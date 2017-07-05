import React, { PureComponent } from 'react';
import connect from 'react-redux';
import ViewSwitcher from '../ViewSwitcher';
import { actions } from '../../index';

class Main extends PureComponent {
  constructor(...args) {
    super(...args);

    let {
      viewName,
      viewState  // its structure is unknown and depends on viewName value.
    } = this.props;

    // Initial initialization:
    initializeView({ viewName, viewState });
  }

  componentWillReceiveProps({
    viewName,
    viewState  // its structure is unknown and depends on viewName value.
  }) {
    // Re-initialization:
    initializeView({ viewName, viewState });
  }

  render() {
    return <ViewSwitcher />;
  }
}

export default connect(
  undefined,
  { initializeView: actions.initializeView }
)(Main);
