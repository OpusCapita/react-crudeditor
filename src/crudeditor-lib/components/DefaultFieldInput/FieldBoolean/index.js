import React, { PureComponent } from 'react';

export default class extends PureComponent {
  constructor(...args) {
    super(...args);

    if (!this.props.readOnly) {
      this.handleChange = ({
        target: { value }
      }) => this.props.onChange(value);
    }
  }

  handleBlur = _ => this.props.onBlur()

  render() {
    const { value, readOnly } = this.props;

    return (
      <Checkbox checked={!!value} readOnly={!!readOnly} onChange={this.handleChange} onBlur={this.handleBlur} />
    );
  }
}
