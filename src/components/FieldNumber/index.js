import React from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';

class FieldNumber extends React.PureComponent {
  constructor(...args) {
    super(...args);

    if (!this.props.readOnly) {
      this.handleChange = ({
        target: { value }
      }) => this.props.onChange && this.props.onChange(this.parse(value));

      this.handleBlur = _ => this.props.onBlur && this.props.onBlur();
    }
  }

  format = number => String(number);

  parse = string => Number(string);

  render = _ =>
    (<FormControl
      value={this.format(this.props.value) || ''}
      readOnly={!!this.props.readOnly}
      onChange={this.handleChange}
      onBlur={this.handleBlur}
      type='number'
    />)
}

FieldNumber.propTypes = {
  readOnly: PropTypes.bool,
  // value: PropTypes.string,
  value: PropTypes.number,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
}

export default FieldNumber;
