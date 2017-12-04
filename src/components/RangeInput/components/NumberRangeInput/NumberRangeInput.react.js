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
    }),
    type: PropTypes.oneOf([
      'integer',
      'decimal'
    ])
  }

  static contextTypes = {
    i18n: PropTypes.object
  }

  static defaultProps = {
    value: { from: null, to: null },
    onChange: _ => { },
    type: 'integer'
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

  format = number => this.context.i18n[this.props.type === 'decimal' ?
    'formatDecimalNumber' :
    'formatNumber'
  ](number)

  parse = string => this.context.i18n[this.props.type === 'decimal' ?
    'parseDecimalNumber' :
    'parseNumber'
  ](string || null)

  keydownListener = e => {
    const el = e.target;
    const side = el === this.inputFrom ? 'from' : 'to';
    const initialString = this.state.strings[side];

    const currentCaretPosition = Math.max(el.selectionStart, el.selectionEnd);

    const key = event.key === 'Backspace' ? 8 :
      event.key === 'Delete' ? 46 :
        null || e.keyCode || e.charCode;

    let nextCaretPosition = currentCaretPosition,
      patchedString = initialString;

    if (key === 8) {
      e.preventDefault();

      nextCaretPosition = /\D/.test(el.value[currentCaretPosition - 1]) ?
        currentCaretPosition - 2 :
        currentCaretPosition - 1;

      patchedString = initialString.
        split('').
        filter((c, i) => i !== nextCaretPosition).
        join('');
    } else if (key === 46) {
      e.preventDefault();

      nextCaretPosition = /\D/.test(el.value[currentCaretPosition]) ?
        currentCaretPosition + 1 :
        currentCaretPosition;

      patchedString = initialString.
        split('').
        filter((c, i) => i !== nextCaretPosition).
        join('');
    } else if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
      // 0-9 only
      e.preventDefault();

      nextCaretPosition = currentCaretPosition + 1;

      patchedString = [
        ...initialString.split('').slice(0, currentCaretPosition),
        String.fromCharCode(key),
        ...initialString.split('').slice(currentCaretPosition)
      ].join('');
    }

    if (patchedString !== initialString) {
      const newNumber = this.parse(patchedString);
      const newString = this.format(newNumber) || '';

      if (newString.length > patchedString.length) {
        nextCaretPosition++
      }

      if (newString.length < patchedString.length) {
        nextCaretPosition--
      }

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

  formatPropValue = ({ from, to }) => ({
    from: isDef(from) ? this.format(from) : '',
    to: isDef(to) ? this.format(to) : ''
  })

  // parse: string -> number
  // format: number -> string
  // value <{ from: <string>, to: <string> }>
  handleChange = ({ from, to }) => {
    // convert value strings to numbers
    // if ok -> check if from/to numbers have changed
    // if yes -> setstate for the changed ones; in a callback onChange with state.numbers

    try {
      const fromNum = this.parse(from);
      const toNum = this.parse(to);

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
            ...(update.from ? { from } : ''),
            ...(update.to ? { to } : ''),
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
