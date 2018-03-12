import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup } from 'react-bootstrap';

import getOperationButtons from '../OperationButton';

export default class SearchResultButtons extends PureComponent {
  static propTypes = {
    parentRef: PropTypes.object,
    operations: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  state = {
    previousSource: null
  }

  // handleToggleDropdown is a workaround for weird CSS overflow behavior
  // details: https://stackoverflow.com/a/6433475
  handleToggleDropdown = (dropdownOpened, event, { source }) => {
    const { parentRef } = this.props;
    const parentWidth = parentRef.clientWidth;
    const tableWidth = parentRef.firstChild.scrollWidth

    // table is wider than visible div -> show scroll
    if (parentWidth < tableWidth) {
      parentRef.style.overflow = 'auto';
      return;
    }

    // handle multiple dropdowns closing each other
    // don't rewrite styles if one DD is closed by opening another DD
    if (this.state.previousSource === 'click' && source === 'rootClose') {
      return;
    }

    parentRef.style.overflow = dropdownOpened ? 'visible' : 'auto';
    this.setState({ previousSource: source });
  }

  render() {
    const { operations } = this.props;

    const buttons = getOperationButtons({
      operations,
      handleToggleDropdown: this.handleToggleDropdown
    });

    return buttons.length ? (
      <ButtonGroup bsSize="sm" className="crud--search-result-listing__action-buttons">
        {buttons}
      </ButtonGroup>
    ) :
      null;
  }
}
