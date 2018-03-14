import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';

import Operation from './Operation';

export default class OperationsBar extends PureComponent {
  static propTypes = {
    operations: PropTypes.arrayOf(PropTypes.shape({
      style: PropTypes.oneOf(['primary', 'success', 'info', 'warning', 'danger', 'link']),
      title: PropTypes.string.isRequired,
      dropdown: PropTypes.bool.isRequired
    })).isRequired,
    onToggleDropdown: PropTypes.func,
    bsSize: PropTypes.oneOf(['lg', 'large', 'sm', 'small', 'xs', 'xsmall']),
    children: PropTypes.func.isRequired
  }

  getOperationButtons = ([mainOperation, ...restOperations]) => {
    if (!mainOperation) {
      return [];
    }

    const {
      bsSize,
      onToggleDropdown: onToggle
    } = this.props;

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
        >
          {element}
          <Dropdown.Toggle />
          <Dropdown.Menu>
            {
              dropdownOperations.map(operation =>
                <Operation {...operation} key={operation.title} />
              )
            }
          </Dropdown.Menu>
        </Dropdown>
      );
    }

    return [
      React.cloneElement(element, {
        key: mainOperation.title,
        ...(!!bsSize && { bsSize })
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
