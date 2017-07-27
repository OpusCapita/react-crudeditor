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

  render() {
    const { value, readOnly } = this.props;

    return (
      <Checkbox checked={!!value} readOnly={!!readOnly} onChange={this.handleChange} onBlur={this.handleBlur} />
    );
  }
}
