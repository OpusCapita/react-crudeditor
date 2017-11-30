import React, { PureComponent } from 'react';
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

  fromRef = input => this.from = input; // eslint-disable-line no-return-assign
  toRef = input => this.to = input; // eslint-disable-line no-return-assign

  handleChange = field => ({ target: { value } }) => this.props.onChange({
    ...this.props.value,
    [field]: applyType(value, this.props.type)
  })

  render() {
    const {
      value,
      type
    } = this.props;

    const { i18n } = this.context;

    const inputType = type === 'number' ? 'number' : 'text';

    return (
      <InputGroup className="crud--range-input">
        <FormControl
          type={inputType}
          placeholder={i18n.getMessage('crudEditor.range.from')}
          value={isDef(value.from) ? value.from : ''}
          ref={this.fromRef}
          onChange={this.handleChange('from')}
        />
        <InputGroup.Addon>{`\u2013`}</InputGroup.Addon>
        <FormControl
          type={inputType}
          placeholder={i18n.getMessage('crudEditor.range.to')}
          value={isDef(value.to) ? value.to : ''}
          ref={this.toRef}
          onChange={this.handleChange('to')}
        />
      </InputGroup>
    )
  }
}
