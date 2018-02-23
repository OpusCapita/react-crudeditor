import React from 'react';
import Operation from './OperationButton';
import { Dropdown } from 'react-bootstrap';

export default function getOperationButtons({ operations, handleToggleDropdown }) {
  if (operations.length === 0) {
    return [];
  }

  const mainOperation = operations.shift();
  let element = <Operation {...mainOperation} dropdown={false} />;
  const dropdownOperations = [];

  while (operations.length && operations[0].dropdown) {
    dropdownOperations.push(operations.shift());
  }

  if (dropdownOperations.length) {
    element = (
      <Dropdown
        {...(handleToggleDropdown && {
          onToggle: handleToggleDropdown
        })}
        id={mainOperation.title}
      >
        {element}
        <Dropdown.Toggle />
        <Dropdown.Menu>
          {
            dropdownOperations.map(operation => <Operation {...operation} key={operation.title} />)
          }
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  return [
    React.cloneElement(element, { bsSize: 'sm', key: mainOperation.title }),
    ...getOperationButtons({ operations, handleToggleDropdown })
  ];
}
