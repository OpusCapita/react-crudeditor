import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  InputGroup,
  FormControl
} from 'react-bootstrap';
import './RangeInput.less';

const isDef = v => v !== null && v !== undefined && v !== '';
const applyType = (value, type) => type === 'number' ? Number(value) : value;

export default class RangeInput extends PureComponent {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.shape({
        from: PropTypes.string,
        to: PropTypes.string
      }),
      PropTypes.shape({
        from: PropTypes.number,
        to: PropTypes.number
      })
    ]),
    type: PropTypes.oneOf(['number', 'string', 'stringNumber']),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func
  }

  static contextTypes = {
    i18n: PropTypes.object
  }

  static defaultProps = {
    type: 'string',
    value: {
      from: null,
      to: null
    },
    onChange: _ => {},
    onBlur: _ => {},
    onFocus: _ => {}
  }

  state = {
    isFocused: false
  }

  componentDidMount() {
    this.selfDOMNode = ReactDOM.findDOMNode(this)
    this.selfDOMNode.addEventListener('focusin', this.handleFocusIn)
    this.selfDOMNode.addEventListener('focusout', this.handleFocusOut)
  }

  componentWillUnmount() {
    this.selfDOMNode.removeEventListener('focusin', this.handleFocusIn)
    this.selfDOMNode.removeEventListener('focusout', this.handleFocusOut)
  }

  handleFocusOut = event => {
    const data = { timeout: null };
    const abortFocusOut = _ => clearTimeout(data.timeout);

    data.timeout = setTimeout(_ => {
      this.selfDOMNode.removeEventListener('focusin', abortFocusOut);
      this.setState(
        { isFocused: false },
        _ => this.props.onBlur(event)
      )
    })

    this.selfDOMNode.addEventListener('focusin', abortFocusOut)
  }

  handleFocusIn = event => !this.state.isFocused &&
    this.setState(
      { isFocused: true },
      _ => this.props.onFocus(event)
    )

  handleChange = field => ({ target: { value } }) => this.props.onChange({
    ...this.props.value,
    [field]: applyType(value, this.props.type)
  })

  render() {
    const {
      value,
      // type
    } = this.props;

    const { i18n } = this.context;

    const inputType = 'text';

    return (
      <InputGroup className="crud--range-input">
        <FormControl
          id="range-input-from"
          name="range-input-from"
          type={inputType}
          placeholder={i18n.getMessage('crudEditor.range.from')}
          value={isDef(value.from) ? value.from : ''}
          onChange={this.handleChange('from')}
        />
        <InputGroup.Addon>{`\u2013`}</InputGroup.Addon>
        <FormControl
          id="range-input-to"
          name="range-input-to"
          type={inputType}
          placeholder={i18n.getMessage('crudEditor.range.to')}
          value={isDef(value.to) ? value.to : ''}
          onChange={this.handleChange('to')}
        />
      </InputGroup>
    )
  }
}
