import React from 'react';
import PropTypes from 'prop-types';
import { DateInput } from '@opuscapita/react-dates';

class FieldDate extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.handleChange = (!this.props.readOnly) ?
      value => {
        // see description in render() function
        if (this.props.onChange) {
          this.props.onChange(value);
          if (this.props.onBlur) {
            this.props.onBlur()
          }
        }
      } :
      _ => null // prevents a propTypes warning about missing onChange handler for DateInput component
  }

  render = _ =>
    // in DateInput component onBlur fires defore onChange
    // it break fields parsing logic
    // we won't listen to onBlur on the component
    // instead we'll manually call props.onBlur in onChange listener
    // right after we call props.onChange
    // Filed issue: https://github.com/OpusCapita/react-dates/issues/32
    (<DateInput
      value={this.props.value || null}
      dateFormat="dd/MM/yyyy"
      onChange={this.handleChange}
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
