import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon, Button, MenuItem } from 'react-bootstrap';

import ConfirmDialog from '../ConfirmDialog';

const Operation = ({ icon, handler, title, disabled, dropdown, bsSize, confirm }) => {
  let element = dropdown ? (
    <MenuItem onClick={handler} disabled={disabled}>
      <span className="btn-sm text-left">
        {icon && <Glyphicon glyph={icon}/>}
        {icon && '\u00A0\u00A0'}
        {title}
      </span>
    </MenuItem>
  ) : (
    <Button onClick={handler} disabled={disabled} {...(bsSize && { bsSize })}>
      {icon && <Glyphicon glyph={icon} />}
      {icon && ' '}
      {title}
    </Button>
  );

  if (!disabled && confirm) {
    element = (
      <ConfirmDialog
        message={confirm.message}
        textConfirm={confirm.textConfirm}
        textCancel={confirm.textCancel}
      >
        {element}
      </ConfirmDialog>
    );
  }

  return element;
}

Operation.propTypes = {
  icon: PropTypes.string,
  handler: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  dropdown: PropTypes.bool,
  bsSize: PropTypes.string,
  confirm: PropTypes.shape({
    message: PropTypes.string.isRequired,
    textConfirm: PropTypes.string.isRequired,
    textCancel: PropTypes.string.isRequired
  })
};

export default Operation;
