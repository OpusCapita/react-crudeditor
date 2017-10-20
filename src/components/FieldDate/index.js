import React from 'react';
import PropTypes from 'prop-types';
import { DateInput } from '@opuscapita/react-dates';

class FieldDate extends React.PureComponent {
  constructor(...args) {
    super(...args);

    if (!this.props.readOnly) {
      this.handleChange = value => this.props.onChange && this.props.onChange(value);

      this.handleBlur = _ => this.props.onBlur && this.props.onBlur();
    }
  }

  render = _ =>
    (<DateInput
      value={this.props.value || null}
      dateFormat="dd/MM/yyyy"
      onChange={this.handleChange}
      onBlur={this.handleBlur}
      disabled={!!this.props.readOnly}
      showToLeft={false}
      showToTop={true}
    />)
}

FieldDate.propTypes = {
  readOnly: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  onBlur: PropTypes.func
}

export default FieldDate;
