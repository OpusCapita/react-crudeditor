import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FormControl from 'react-bootstrap/lib/FormControl';
import { noop } from '../lib';

export default class FieldString extends PureComponent {
  static propTypes = {
    readOnly: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
  }

  static defaultProps = {
    readOnly: false,
    value: '',
    onChange: noop,
    onBlur: noop
  }

  handleChange = ({ target: { value } }) => this.props.onChange(value);

  render = _ =>
    (<FormControl
      value={this.props.value || ''}
      readOnly={!!this.props.readOnly}
      onChange={this.handleChange}
      onBlur={this.props.onBlur}
      type='text'
      {...(this.props.readOnly && { tabIndex: -1 })}
    />)
}

