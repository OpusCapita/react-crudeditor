import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RangeInput from '../RangeInput';
import { isDef } from '../lib';

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

  constructor(...args) {
    super(...args);

    this.state = {
      strings: this.formatPropValue(this.props.value),
      numbers: this.props.value
    }
  }


  componentWillReceiveProps(nextProps) {
    this.setState({
      strings: this.formatPropValue(nextProps.value),
      numbers: nextProps.value
    })
  }

  formatPropValue = ({ from, to }) => {
    const { i18n } = this.context;

    return {
      from: isDef(from) ? i18n.formatNumber(from) : null,
      to: isDef(to) ? i18n.formatNumber(to) : null
    }
  }

  // parse: string -> number
  // format: number -> string
  // value <{ from: <string>, to: <string> }>
  handleChange = ({ from, to }) => {
    const { i18n } = this.context;
    // convert value strings to numbers
    // if ok -> check if from/to numbers have changed
    // if yes -> setstate for the changed ones; in a callback onChange with state.numbers

    try {
      const fromNum = i18n.parseNumber(from);
      const toNum = i18n.parseNumber(to);

      const update = {};
      const { numbers } = this.state;

      if (fromNum !== numbers.from) {
        update.from = true
      }

      if (toNum !== numbers.to) {
        update.to = true
      }

      if (Object.keys(update).length) {
        this.setState(prevState => ({
          strings: {
            ...prevState.strings,
            ...(update.from ? { from } : null),
            ...(update.to ? { to } : null),
          },
          numbers: {
            ...prevState.numbers,
            ...(update.from ? { from: fromNum } : null),
            ...(update.to ? { to: toNum } : null),
          }
        }), _ => this.props.onChange(this.state.numbers))
      }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <RangeInput
        {...this.props}
        value={this.state.strings}
        onChange={this.handleChange}
      />
    )
  }
}
