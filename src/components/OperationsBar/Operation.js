import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import ConfirmDialog from '../ConfirmDialog';

const Operation = ({ icon, handler, title, disabled, dropdown, style, size, confirm }) => {
  const isPrimary = style === 'primary';

  if (isPrimary && dropdown) {
    throw TypeError(`"${title}" primary operation must not be a dropdown menu item`);
  }

  const label = icon ? [
    typeof icon === 'string' ?
      <span className={`glyphicon glyphicon-${icon}`} key="icon"></span> :
      icon,
    '\u00A0\u00A0',
    title
  ] :
    title;

  let element = dropdown ? (
    <MenuItem onClick={handler} disabled={disabled}>
      <span className="btn-sm text-left">
        {label}
      </span>
    </MenuItem>
  ) : (
    <button
      type={isPrimary ? 'submit' : 'button'}
      className={`btn btn-${style || 'default'}${size !== 'medium' ? ` btn-${size}` : ''}`}
      disabled={disabled}
      onClick={handler}
    >
      {label}
    </button>
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
