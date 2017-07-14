import React, { PureComponent } from 'react';

import connect from '../../connect';
import ViewSwitcher from '../ViewSwitcher';
import { actions as commonActions } from '../../common';

const { initializeView } = commonActions;

@connect(
  undefined,
  { initializeView }
)
export default class extends PureComponent {
  constructor(...args) {
    super(...args);

    let {
      viewName,
      viewState,  // its structure is unknown and depends on viewName value.
      initializeView
    } = this.props;

    // Initial initialization:
    initializeView({ viewName, viewState });
  }

  componentWillReceiveProps({
    viewName,
    viewState  // its structure is unknown and depends on viewName value.
  }) {
    // Re-initialization:
    this.props.initializeView({ viewName, viewState });
  }

  render() {
    return <ViewSwitcher />;
  }
}
