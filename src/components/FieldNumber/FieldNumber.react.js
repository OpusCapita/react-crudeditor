import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { FormControl } from 'react-bootstrap';
import { noop, isDef } from '../lib';
import {
  setPatchedCaretPosition,
  handleKeydown,
  handlePaste
} from '../RangeInput/components/NumberRangeInput/lib';

export default class FieldNumber extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf([
      'decimal',
      'integer'
    ]),
    readOnly: PropTypes.bool,
    value: PropTypes.number,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  }

  static defaultProps = {
    type: 'integer',
    readOnly: false,
    value: null,
    onChange: noop,
    onBlur: noop,
    onFocus: noop
  }

  constructor(...args) {
    super(...args);

    const { value } = this.props;

    this.state = {
      string: isDef(value) ? this.format(value) : '',
      number: value
    }
  }

  componentDidMount() {
    this.input = findDOMNode(this);
    this.input.addEventListener('keydown', this.keydownListener);
    this.input.addEventListener('paste', this.pasteListener);
  }

  componentWillReceiveProps(nextProps) {
    // check if sign has changed, and adjust caret position if true
    const { value: currentValue } = this.props;
    const { value: nextValue } = nextProps;
    const el = document.activeElement;

    if (el === this.input && currentValue === -1 * nextValue) {
      setPatchedCaretPosition(el, nextValue <= 0 ? 1 : 0, this.format(nextValue))
    }

    this.setState({
      string: isDef(nextValue) ? this.format(nextValue) : '',
      number: nextValue
    })
  }

  componentWillUnmount() {
    this.input.removeEventListener('keydown', this.keydownListener)
    this.input.removeEventListener('paste', this.pasteListener)
  }

  keydownListener = /* istanbul ignore next */ e => {
    const el = e.target;
    const initialString = this.state.string;
    const initialNumber = this.state.number;
    const { type } = this.props;
    const decimalSeparator = this.context.i18n._findFormattingInfo().numberDecimalSeparator;

    const callback = ({ newNumber, newString, nextCaretPosition }) => this.setState(prevState => ({
      string: newString,
      number: newNumber
    }), _ => {
      setPatchedCaretPosition(el, nextCaretPosition, el.value);
      this.props.onChange(this.state.number)
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

  pasteListener = /* istanbul ignore next */ e => {
    e.preventDefault();
    const el = e.target;
    const initialString = this.state.string;

    const callback = ({ newNumber, newString, nextCaretPosition }) => this.setState(prevState => ({
      string: newString,
      number: newNumber
    }), _ => {
      setPatchedCaretPosition(el, nextCaretPosition, el.value);
      this.props.onChange(this.state.number)
    })

    return handlePaste({
      e,
      initialString,
      callback,
      parse: this.parse,
      format: this.format
    })
  }

  format = /* istanbul ignore next */ number => this.context.i18n[this.props.type === 'decimal' ?
    'formatDecimalNumber' :
    'formatNumber'
  ](number)


  parse = /* istanbul ignore next */ string => this.context.i18n[this.props.type === 'decimal' ?
    'parseDecimalNumber' :
    'parseNumber'
  ](string || null)

  render = _ => {
    const {
      readOnly,
      onBlur,
      onFocus
    } = this.props;

    const props = {
      value: this.state.string || '',
      type: 'text',
      readOnly,
      ...(
        readOnly ?
          {
            disabled: readOnly
          } :
          {
            onFocus,
            onBlur
          }
      )
    }

    return (<FormControl {...props}/>)
  }
}
