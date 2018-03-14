import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon, Button, MenuItem } from 'react-bootstrap';

import ConfirmDialog from '../ConfirmDialog';

const Operation = ({ icon, handler, title, disabled, dropdown, style, bsSize, confirm }) => {
  // XXX: a primary button does not have onClick handler
  // because it is delegated to onSubmit handler of surrounding Form element.
  // See also ./index.js
  const isPrimary = style === 'primary';

  if (isPrimary && dropdown) {
    throw TypeError(`"${title}" primary operation must not be a dropdown menu item`);
  }

  let element = dropdown ? (
    <MenuItem onClick={handler} disabled={disabled}>
      <span className="btn-sm text-left">
        {icon && <Glyphicon glyph={icon}/>}
        {icon && '\u00A0\u00A0'}
        {title}
      </span>
    </MenuItem>
  ) : (
    <Button
      disabled={disabled}
      onClick={handler}
      {...(bsSize && { bsSize })}
      {...(style && { bsStyle: style })}
      {...(isPrimary && { type: 'submit' })}
    >
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
  disabled: PropTypes.bool.isRequired,
  dropdown: PropTypes.bool.isRequired,
  bsSize: PropTypes.oneOf(['lg', 'large', 'sm', 'small', 'xs', 'xsmall']),
  style: PropTypes.oneOf(['primary', 'success', 'info', 'warning', 'danger', 'link']),
  confirm: PropTypes.exact({
    message: PropTypes.string.isRequired,
    textConfirm: PropTypes.string.isRequired,
    textCancel: PropTypes.string.isRequired
  })
};

export default Operation;
