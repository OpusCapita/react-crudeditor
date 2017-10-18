import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';

const StatusField = ({ value, onChange, onBlur, readOnly }) =>
  (<FormControl
    componentClass='select'
    value={value || value === 0 ? value : ''}
    onChange={({ target: { value } }) => onChange &&
      onChange(Number(value) === parseInt(value, 10) ? Number(value) : null)}
    onBlur={onBlur}
    disabled={readOnly}
  >
    <option value={''}></option>
    <option value={0}>0 (pending)</option>
    <option value={100}>100 (new)</option>
    <option value={105}>105 (changed)</option>
    <option value={400}>400 (confirmed)</option>
    <option value={800}>800 (deleted)</option>
  </FormControl>);

StatusField.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  readOnly: PropTypes.bool
}

export default StatusField;
