import React from 'react';
import { FormControl } from 'react-bootstrap';

export default ({ value, onChange, onBlur }) =>
  <FormControl
    componentClass='select'
    value={value || value === 0 ? value : ''}
    onChange={({ target: { value }}) => onChange(value)}
    onBlur={onBlur}
  >
    <option value=""></option>
    <option value="100">100 (new)</option>
    <option value="105">105 (changed)</option>
    <option value="400">400 (confirmed)</option>
    <option value="800">800 (deleted)</option>
  </FormControl>;
