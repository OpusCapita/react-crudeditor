import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateRangeInput } from '@opuscapita/react-dates';

const array2range = arr => ({ from: arr[0], to: arr[1] });
const range2array = range => [range.from, range.to];

export default class AdoptedDateRangeInput extends PureComponent {
  static propTypes = {
    value: PropTypes.shape({
      from: PropTypes.instanceOf(Date),
      to: PropTypes.instanceOf(Date)
    }),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
  }

  static contextTypes = {
    i18n: PropTypes.object
  }

  static defaultProps = {
    value: { from: null, to: null },
    onChange: _ => {},
    onBlur: _ => {},
    onFocus: _ => {}
  }

  handleChange = value => this.props.onChange(array2range(value))

  render() {
    const { value } = this.props;
    const { i18n } = this.context;

    return (
      <DateRangeInput
        {...this.props}
        dateFormat={i18n.dateFormat}
        value={range2array(value)}
        onChange={this.handleChange}
      />
    )
  }
}
