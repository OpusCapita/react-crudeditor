import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';
import { noop } from '../lib';

export default class FieldBoolean extends React.PureComponent {
  static propTypes = {
    readOnly: PropTypes.bool,
    value: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
  }

  static defaultProps = {
    readOnly: false,
    onChange: noop,
    onBlur: noop
  }

  constructor(...args) {
    super(...args);

    this.handleChange = this.props.readOnly ?
      noop :
      _ => this.props.onChange(!this.props.value);

    this.handleBlur = this.props.readOnly ?
      noop :
      this.props.onBlur;
  }

  render = _ =>
    (<Checkbox
      checked={!!this.props.value}
      readOnly={!!this.props.readOnly}
      onChange={this.handleChange}
      onBlur={this.handleBlur}
      {...(this.props.readOnly && { tabIndex: -1 })}
    />)
}
