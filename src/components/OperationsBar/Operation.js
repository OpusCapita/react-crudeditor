import React from 'react';
import PropTypes from 'prop-types';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import ConfirmDialog from '../ConfirmDialog';

const getIconElement = icon => {
  if (typeof icon !== 'string') {
    return icon
  }
  if (icon === 'edit') {
    return <i className='fa fa-pencil' key='edit'></i>
  }
  return <Glyphicon glyph={icon} key={icon} />
}

const Operation = ({ icon, handler, title, disabled, dropdown, style, size, confirm, onSelect }) => {
  const isPrimary = style === 'primary';

  if (isPrimary && dropdown) {
    throw TypeError(`"${title}" primary operation must not be a dropdown menu item`);
  }

  const label = icon ? [
    getIconElement(icon),
    '\u00A0\u00A0',
    title
  ] :
    title;

  const handleClick = disabled ?
    null :
    () => {
      if (onSelect) {
        onSelect();
      }
      handler();
    };

  let element = dropdown ? (
    <MenuItem onClick={handleClick} disabled={disabled}>
      <span className="btn-sm text-left">
        {label}
      </span>
    </MenuItem>
  ) : (
    <Button
      disabled={disabled}
      onClick={handleClick}
      {...(size !== 'medium' && { bsSize: size })}
      {...(style !== 'default' && { bsStyle: style })}
      {...(isPrimary && { type: 'submit' })}
    >
      {label}
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
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  handler: PropTypes.func,
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  dropdown: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),
  style: PropTypes.oneOf(['primary', 'default', 'link']),
  confirm: PropTypes.shape({
    message: PropTypes.string.isRequired,
    textConfirm: PropTypes.string.isRequired,
    textCancel: PropTypes.string.isRequired
  })
};

Operation.defaultProps = {
  disabled: false,
  dropdown: false,
  size: 'medium',
  style: 'default'
}

export default Operation;
