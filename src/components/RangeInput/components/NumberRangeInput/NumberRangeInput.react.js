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
    i18n: PropTypes.object.isRequired
  }

  static defaultProps = {
    value: { from: null, to: null },
    onChange: _ => {},
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
    this.inputTo.addEventListener('keydown', this.keydownListener)
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
      strings: this.formatRange(nextProps.value),
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
    const initialNumber = this.state.numbers[side];
    const decimalSeparator = this.context.i18n._findFormattingInfo().numberDecimalSeparator;

    const currentCaretPosition = Math.max(el.selectionStart, el.selectionEnd);

    const key = event.key === 'Backspace' ? 8 :
      event.key === 'Delete' ? 46 :
        null || e.keyCode || e.charCode;

    let nextCaretPosition = currentCaretPosition,
      patchedString = initialString;

    let signChanged = false;

    if (key === 8) { // Backspace
      e.preventDefault();

      if (!initialNumber) {
        patchedString = ''
      } else if (currentCaretPosition === 1 && initialString.indexOf('-') === 0) {
        signChanged = true
      } else {
        nextCaretPosition = /\D/.test(el.value[currentCaretPosition - 1]) ?
          currentCaretPosition - 2 :
          currentCaretPosition - 1;

        if (this.props.type === 'decimal' && initialString.indexOf(decimalSeparator) < currentCaretPosition) {
          patchedString = [
            ...initialString.split('').slice(0, nextCaretPosition),
            0,
            ...initialString.split('').slice(nextCaretPosition + 1)
          ].join('')
        } else {
          patchedString = initialString.split('').filter((c, i) => i !== nextCaretPosition).join('');
        }
      }
    } else if (key === 46) { // Del
      e.preventDefault();

      if (!initialNumber) {
        patchedString = ''
      } else if (currentCaretPosition === 0 && initialString.indexOf('-') === 0) {
        signChanged = true
      } else {
        nextCaretPosition = /\D/.test(el.value[currentCaretPosition]) ?
          currentCaretPosition + 1 :
          currentCaretPosition;

        // patchedString = initialString.split('').filter((c, i) => i !== nextCaretPosition).join('');
        if (this.props.type === 'decimal' && initialString.indexOf(decimalSeparator) < currentCaretPosition) {
          patchedString = [
            ...initialString.split('').slice(0, nextCaretPosition),
            0,
            ...initialString.split('').slice(nextCaretPosition + 1)
          ].join('');
          nextCaretPosition++;
        } else {
          patchedString = initialString.split('').filter((c, i) => i !== nextCaretPosition).join('');
        }
      }
    } else if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) { // 0-9 only
      e.preventDefault();

      nextCaretPosition = currentCaretPosition + 1;

      patchedString = [
        ...initialString.split('').slice(0, currentCaretPosition === initialString.length ?
          currentCaretPosition - 1 :
          currentCaretPosition),
        String.fromCharCode(key),
        ...initialString.split('').slice(
          currentCaretPosition +
          (
            this.props.type === 'decimal' && initialString.indexOf(decimalSeparator) < currentCaretPosition ?
              1 : 0 // either patch one char or splice a new one into the string
          )
        )
      ].join('');
    // block non-numeric non-control keys
    } else if (/[a-zA-Z_ ]/.test(String.fromCharCode(key)) || [192, 187].indexOf(key) > -1) {
      e.preventDefault();
    } else if (key === 189) { // minus
      e.preventDefault();

      if (currentCaretPosition === 0) {
        signChanged = true
      }
    } else {
      return; // pass all not intercepted keydowns to standard handlers
    }

    if (patchedString !== initialString || signChanged) {
      if (patchedString.indexOf(decimalSeparator) === 0) {
        patchedString = '0' + patchedString;
      }

      if (/^-/.test(patchedString) && patchedString.indexOf(decimalSeparator) === 1) {
        patchedString = '-0' + patchedString.slice(1);
      }

      const newNumber = this.parse(patchedString);
      const newString = this.format(newNumber) || '';

      if (newString.length > patchedString.length) {
        nextCaretPosition++
      }

      if (newString.length < patchedString.length) {
        nextCaretPosition--
      }

      if (
        this.props.type === 'decimal' &&
        newString.slice(newString.indexOf(decimalSeparator) + 1).length <
        patchedString.slice(patchedString.indexOf(decimalSeparator) + 1).length
      ) {
        nextCaretPosition = newString.length - 1
      }

      if (nextCaretPosition === 0 && newString.indexOf('0' + decimalSeparator) === 0) {
        nextCaretPosition = 1;
      }

      if (newString.indexOf(decimalSeparator) > -1 && nextCaretPosition > newString.indexOf(decimalSeparator) + 2) {
        nextCaretPosition = newString.indexOf(decimalSeparator) + 2;
      }

      if (this.props.type === 'decimal' && initialString.indexOf(decimalSeparator) === -1) {
        nextCaretPosition = 1
      }

      this.setState(prevState => ({
        strings: {
          ...prevState.strings,
          [side]: newString
        },
        numbers: {
          ...prevState.numbers,
          [side]: isDef(newNumber) ?
            (signChanged ? -1 : 1) * newNumber :
            newNumber
        }
      }), _ => {
        setPatchedCaretPosition(el, nextCaretPosition, el.value);
        this.props.onChange(this.state.numbers)
      })
    } else {
      setPatchedCaretPosition(el, nextCaretPosition, el.value)
    }
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
