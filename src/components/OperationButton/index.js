import React from 'react';
import Operation from './OperationButton';
import { Dropdown } from 'react-bootstrap';

export default function getOperationButtons({
  operations: [mainOperation, ...restOperations],
  handleToggleDropdown
}) {
  if (!mainOperation) {
    return [];
  }

  let element = <Operation {...mainOperation} dropdown={false} />;
  const dropdownOperations = [];

  while (restOperations.length && restOperations[0].dropdown) {
    dropdownOperations.push(restOperations.shift());
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
    ...getOperationButtons({
      operations: restOperations,
      handleToggleDropdown
    })
  ];
}
