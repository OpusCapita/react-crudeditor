import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/lib/Dropdown';

import Operation from './Operation';

export default class OperationsBar extends Component {
  static propTypes = {
    operations: PropTypes.arrayOf(PropTypes.shape({
      style: PropTypes.oneOf(['primary', 'default', 'link']),
      title: PropTypes.string.isRequired,
      dropdown: PropTypes.bool // false by default
    })).isRequired,
    onToggleDropdown: PropTypes.func,
    size: PropTypes.oneOf(['small', 'medium']),
    children: PropTypes.func.isRequired
  }

  state = {};

  getOperationButtons = ([mainOperation, ...restOperations]) => {
    if (!mainOperation) {
      return [];
    }

    const {
      size,
      onToggleDropdown: onToggle
    } = this.props;

    const isOpenStateKey = mainOperation.title + '_isOpen';
    const isOpen = this.state[isOpenStateKey];

    let element = <Operation {...mainOperation} />;
    const dropdownOperations = [];

    while (restOperations.length && restOperations[0].dropdown) {
      dropdownOperations.push(restOperations.shift());
    }

    if (dropdownOperations.length) {
      element = (
        <Dropdown
          {...(onToggle && { onToggle })}
          id={mainOperation.title}
          open={isOpen}
          onToggle={() => this.setState({ [isOpenStateKey]: !isOpen })}
        >
          {element}
          <Dropdown.Toggle />
          <Dropdown.Menu>
            {
              dropdownOperations.map(operation =>
                <Operation {...operation} key={operation.title} onSelect={() => this.setState({ [isOpenStateKey]: false })} />
              )
            }
          </Dropdown.Menu>
        </Dropdown>
      );
    }

    return [
      React.cloneElement(element, {
        key: mainOperation.title,
        ...(!!size && size !== 'medium' && { bsSize: size })
      }),
      ...this.getOperationButtons(restOperations)
    ];
  }

  render() {
    const { operations, children } = this.props;

    if (operations.length && operations[0].dropdown) {
      throw new TypeError(`First operation "${operations[0].title}" must not be a dropdown menu item`);
    }

    const primaryOperationsCount = operations.filter(({ style }) => style === 'primary').length;

    if (primaryOperationsCount > 1) {
      throw new TypeError('There can be max one primary operation, not', primaryOperationsCount);
    }

    return children(this.getOperationButtons(operations));
  }
}
