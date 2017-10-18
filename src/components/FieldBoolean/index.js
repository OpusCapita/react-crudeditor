import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';

class FieldBoolean extends React.PureComponent {
  constructor(...args) {
    super(...args);

    if (!this.props.readOnly) {
      this.handleChange = _ => this.props.onChange && this.props.onChange(!this.props.value);
      this.handleBlur = _ => this.props.onBlur && this.props.onBlur();
    }
  }

  render = _ =>
    (<Checkbox
      checked={this.props.value}
      readOnly={this.props.readOnly}
      onChange={this.handleChange}
      onBlur={this.handleBlur}
    />)
}

FieldBoolean.propTypes = {
  readOnly: PropTypes.bool,
  value: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
}

export default FieldBoolean;
