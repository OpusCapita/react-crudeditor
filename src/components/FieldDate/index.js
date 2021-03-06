import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateInput } from '@opuscapita/react-dates';
import { noop } from '../lib';

export default class FieldDate extends PureComponent {
  static propTypes = {
    readOnly: PropTypes.bool,
    value: PropTypes.instanceOf(Date),
    onChange: PropTypes.func,
    onBlur: PropTypes.func
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  }

  static defaultProps = {
    readOnly: false,
    value: null
  }

  constructor(...args) {
    super(...args);
    this.handleChange = !this.props.readOnly ?
      value => {
        // see description in render() function
        if (this.props.onChange) {
          this.props.onChange(value);
          if (this.props.onBlur) {
            this.props.onBlur()
          }
        }
      } :
      noop // prevents a propTypes warning about missing onChange handler for DateInput component
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
      dateFormat={this.context.i18n.dateFormat}
      locale={this.context.i18n.locale}
      onChange={this.handleChange}
      disabled={!!this.props.readOnly}
      showToLeft={false}
      showToTop={true}
      {...(this.props.readOnly && { tabIndex: -1 })}
    />)
}
