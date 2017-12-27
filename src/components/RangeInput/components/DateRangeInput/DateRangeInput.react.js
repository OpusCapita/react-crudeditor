import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateRangeInput as OCDateRangeInput } from '@opuscapita/react-dates';
import { noop } from '../../../lib';

const array2range = arr => ({ from: arr[0], to: arr[1] });
const range2array = range => [range.from, range.to];

export default class DateRangeInput extends PureComponent {
  static propTypes = {
    value: PropTypes.shape({
      from: PropTypes.instanceOf(Date),
      to: PropTypes.instanceOf(Date)
    }),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    readOnly: PropTypes.bool
  }

  static contextTypes = {
    i18n: PropTypes.object
  }

  static defaultProps = {
    value: { from: null, to: null },
    onChange: noop,
    onBlur: noop,
    onFocus: noop,
    readOnly: false
  }

  handleChange = value => this.props.onChange(array2range(value))

  render() {
    const {
      value,
      onFocus,
      onBlur,
      readOnly
    } = this.props;
    const { i18n } = this.context;

    return (
      <OCDateRangeInput
        dateFormat={i18n.dateFormat}
        value={range2array(value)}
        onChange={this.handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={readOnly}
        {...(readOnly && { tabIndex: -1 })}
      />
    )
  }
}
