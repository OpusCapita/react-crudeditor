import React from 'react';
import PropTypes from 'prop-types';
import { DateInput } from '@opuscapita/react-dates';

class FieldDate extends React.PureComponent {
  constructor(...args) {
    super(...args);

    if (!this.props.readOnly) {
      this.handleChange = value => {
        // see description in render() function
        return (this.props.onChange && this.props.onChange(value)) &&
          (this.props.onBlur && this.props.onBlur());
      }
    }
  }

  render = _ =>
    // in DateInput component onBlur fires defore onChange
    // it break fields parsing logic
    // we won't listen to onBlur on the component
    // instead we'll manually call props.onBlur in onChange listener
    // right after we call props.onChange
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
