import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import StringRangeInput from '../StringRangeInput';
import { isDef } from '../../../lib';
import { setCaretPosition } from './lib';

const setPatchedCaretPosition = (el, caretPos, currentValue) => {
  /* setting caret position within timeout of 0ms is required for mobile chrome,
  otherwise browser resets the caret position after we set it
  We are also setting it without timeout so that in normal browser we don't see the flickering */
  setCaretPosition(el, caretPos);
  setTimeout(_ => {
    if (el.value === currentValue) {
      setCaretPosition(el, caretPos)
    }
  });
}

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

  componentDidMount() {
    const elements = findDOMNode(this).children;
    this.inputFrom = elements[0];
    this.inputTo = elements[2];

    this.inputFrom.addEventListener('keydown', this.keydownListener)
    this.inputTo.addEventListener('keydown', this.keydownListener)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      strings: this.formatPropValue(nextProps.value),
      numbers: nextProps.value
    })
  }

  componentWillUnmount() {
    this.inputFrom.removeEventListener('keydown', this.keydownListener)
    this.inputTo.removeEventListener('keydown', this.keydownListener)
  }

  keydownListener = e => {
    const { i18n } = this.context;
    const el = e.target;
    const side = el === this.inputFrom ? 'from' : 'to';

    const currentCaretPosition = Math.max(el.selectionStart, el.selectionEnd);

    if (el.value === this.state.strings[side] && currentCaretPosition !== 0) {
      const key = event.key === 'Backspace' ? 8 :
        event.key === 'Delete' ? 46 :
          null || e.keyCode || e.charCode;

      if (key === 8) {
        e.preventDefault();

        const nextCaretPosition = /\D/.test(el.value[currentCaretPosition - 1]) ?
          currentCaretPosition - 2 :
          currentCaretPosition - 1;

        const patchedString = this.state.strings[side].
          split('').
          filter((c, i) => i !== nextCaretPosition).
          join('');
        const newNumber = i18n.parseNumber(patchedString || null);
        const newString = i18n.formatNumber(newNumber);

        this.setState(prevState => ({
          strings: {
            ...prevState.strings,
            [side]: newString
          },
          numbers: {
            ...prevState.numbers,
            [side]: newNumber
          }
        }), _ => setPatchedCaretPosition(el, nextCaretPosition, el.value))
      } else if (key === 46) {
        e.preventDefault();

        const nextCaretPosition = /\D/.test(el.value[currentCaretPosition]) ?
          currentCaretPosition + 1 :
          currentCaretPosition;

        const patchedString = this.state.strings[side].
          split('').
          filter((c, i) => i !== nextCaretPosition).
          join('');
        const newNumber = i18n.parseNumber(patchedString || null);
        const newString = i18n.formatNumber(newNumber);

        this.setState(prevState => ({
          strings: {
            ...prevState.strings,
            [side]: newString
          },
          numbers: {
            ...prevState.numbers,
            [side]: newNumber
          }
        }), _ => setPatchedCaretPosition(el, nextCaretPosition, el.value))
      }
    }
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
      // swallow
    }
  }

  render() {
    return (
      <StringRangeInput
        {...this.props}
        value={this.state.strings}
        onChange={this.handleChange}
      />
    )
  }
}
