import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RangeInput from '../RangeInput';

export default class NumberRangeInput extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.shape({
      from: PropTypes.number,
      to: PropTypes.number
    })
  }

  static contextTypes = {
    i18n: PropTypes.object
  }

  static defaultProps = {
    value: { from: null, to: null },
    onChange: _ => {}
  }

  numberRangeToStringRange = numberRange => {
    const { i18n } = this.context;

    return Object.keys(numberRange).reduce((obj, key) => ({
      ...obj,
      [key]: i18n.formatNumber(numberRange[key])
    }), {})
  }

  stringRangeToNumberRange = stringRange => {
    const { i18n } = this.context;

    return Object.keys(stringRange).reduce((obj, key) => ({
      ...obj,
      [key]: stringRange[key] ?
        i18n.parseNumber(stringRange[key]) :
        null
    }), {})
  }

  handleChange = value => {
    try {
      const parsedValue = this.stringRangeToNumberRange(value);
      this.props.onChange(parsedValue)
    } catch (err) {
      // swallow parsing errors
    }
  }

  render() {
    const { value, ...rest } = this.props;

    return (
      <RangeInput
        {...rest}
        value={this.numberRangeToStringRange(value)}
        onChange={this.handleChange}
      />
    )
  }
}
