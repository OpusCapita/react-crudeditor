import React from 'react';
import { FormControl } from 'react-bootstrap';

export default class extends React.PureComponent {
  constructor(...args) {
    super(...args);

    if (!this.props.readOnly) {
      this.handleChange = ({
        target: { value }
      }) => this.props.onChange && this.props.onChange(value);

      this.handleBlur = _ => this.props.onBlur && this.props.onBlur();
    }
  }

  render = _ =>
    <FormControl
      value={this.props.value || ''}
      readOnly={!!this.props.readOnly}
      onChange={this.handleChange}
      onBlur={this.handleBlur}
      type='text'
    />
}
