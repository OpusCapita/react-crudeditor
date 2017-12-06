import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import StringRangeInput from '../StringRangeInput';
import { isDef, noop } from '../../../lib';
import {
  setPatchedCaretPosition,
  handleKeydown,
  handlePaste
} from './lib';

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
    i18n: PropTypes.object.isRequired
  }

  static defaultProps = {
    value: { from: null, to: null },
    onChange: noop,
    type: 'integer'
  }

  constructor(...args) {
    super(...args);

    this.state = {
      strings: this.formatRange(this.props.value),
      numbers: this.props.value
    }
  }

  componentDidMount() {
    const elements = findDOMNode(this).children;
    this.inputFrom = elements[0];
    this.inputTo = elements[2];

    this.inputFrom.addEventListener('keydown', this.keydownListener)
    this.inputFrom.addEventListener('paste', this.pasteListener)

    this.inputTo.addEventListener('keydown', this.keydownListener)
    this.inputTo.addEventListener('paste', this.pasteListener)
  }

  componentWillReceiveProps(nextProps) {
    // check if sign has changed, and adjust caret position if true
    const { value: currentValue } = this.props;
    const { value: nextValue } = nextProps;
    const el = document.activeElement;
    const side = el === this.inputFrom ?
      'from' :
      el === this.inputTo ?
        'to' :
        null;

    if (side && currentValue[side] === -1 * nextValue[side]) {
      setPatchedCaretPosition(el, nextValue[side] <= 0 ? 1 : 0, this.format(nextValue[side]))
    }

    this.setState({
      strings: this.formatRange(nextValue),
      numbers: nextValue
    })
  }

  componentWillUnmount() {
    this.inputFrom.removeEventListener('keydown', this.keydownListener)
    this.inputFrom.removeEventListener('paste', this.pasteListener)
    this.inputTo.removeEventListener('keydown', this.keydownListener)
    this.inputTo.removeEventListener('paste', this.pasteListener)
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
    const initialNumber = this.state.numbers[side];
    const { type } = this.props;
    const decimalSeparator = this.context.i18n._findFormattingInfo().numberDecimalSeparator;

    const callback = ({ newNumber, newString, nextCaretPosition }) => this.setState(prevState => ({
      strings: {
        ...prevState.strings,
        [side]: newString
      },
      numbers: {
        ...prevState.numbers,
        [side]: newNumber
      }
    }), _ => {
      setPatchedCaretPosition(el, nextCaretPosition, el.value);
      this.props.onChange(this.state.numbers)
    })

    return handleKeydown({
      e,
      type,
      initialNumber,
      initialString,
      decimalSeparator,
      callback,
      parse: this.parse,
      format: this.format
    })
  }

  pasteListener = e => {
    e.preventDefault();
    const el = e.target;
    const side = el === this.inputFrom ? 'from' : 'to';
    const initialString = this.state.strings[side];

    const callback = ({ newNumber, newString, nextCaretPosition }) => this.setState(prevState => ({
      strings: {
        ...prevState.strings,
        [side]: newString
      },
      numbers: {
        ...prevState.numbers,
        [side]: newNumber
      }
    }), _ => {
      setPatchedCaretPosition(el, nextCaretPosition, el.value);
      this.props.onChange(this.state.numbers)
    })

    return handlePaste({
      e,
      initialString,
      callback,
      parse: this.parse,
      format: this.format
    })
  }

  formatRange = ({ from, to }) => ({
    from: isDef(from) ? this.format(from) : '',
    to: isDef(to) ? this.format(to) : ''
  })

  render() {
    return (
      <StringRangeInput
        {...this.props}
        value={this.state.strings}
      />
    )
  }
}
