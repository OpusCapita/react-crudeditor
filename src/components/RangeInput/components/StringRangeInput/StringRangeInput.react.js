import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import {
  InputGroup,
  FormControl
} from 'react-bootstrap';
import './StringRangeInput.less';
import { exists, noop } from '../../../lib';

export default class StringRangeInput extends PureComponent {
  static propTypes = {
    value: PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string
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
    value: {
      from: null,
      to: null
    },
    onChange: noop,
    onBlur: noop,
    onFocus: noop,
    readOnly: false
  }

  state = {
    isFocused: false
  }

  componentDidMount() {
    this.selfDOMNode = findDOMNode(this)
    this.selfDOMNode.addEventListener('focusin', this.handleFocusIn)
    this.selfDOMNode.addEventListener('focusout', this.handleFocusOut)

    // remove id on the second input so that form-group label id is auto-set only for the first input
    this.selfDOMNode.children[2].removeAttribute('id');
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
    [field]: value || null
  })

  render() {
    const { value, readOnly } = this.props;

    const { i18n } = this.context;

    return (
      <InputGroup className="crud--range-input">
        <FormControl
          type='text'
          placeholder={i18n.getMessage('crudEditor.range.from')}
          value={exists(value.from) ? value.from : ''}
          onChange={this.handleChange('from')}
          disabled={readOnly}
          {...(readOnly && { tabIndex: -1 })}
        />
        <InputGroup.Addon className="unselectable">{`\u2013`}</InputGroup.Addon>
        <FormControl
          type='text'
          placeholder={i18n.getMessage('crudEditor.range.to')}
          value={exists(value.to) ? value.to : ''}
          onChange={this.handleChange('to')}
          disabled={readOnly}
          {...(readOnly && { tabIndex: -1 })}
        />
      </InputGroup>
    )
  }
}
