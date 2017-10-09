import React from 'react';
import { Checkbox } from 'react-bootstrap';

export default class extends React.PureComponent {
  constructor(...args) {
    super(...args);

    if (!this.props.readOnly) {
      this.handleChange = _ => this.props.onChange && this.props.onChange(!this.props.value);
      this.handleBlur = _ => this.props.onBlur && this.props.onBlur();
    }
  }

  render = _ =>
    (<Checkbox
      checked={!!this.props.value}
      readOnly={!!this.props.readOnly}
      onChange={this.handleChange}
      onBlur={this.handleBlur}
    />)
}
