import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default WrappedComponent => class DeferValueSyncHOC extends PureComponent {
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
  }

  static defaultProps = {
    value: null
  }

  constructor(...args) {
    super(...args);

    this.state = {
      value: this.props.value
    }
  }

  handleChange = value => this.setState({ value }, _ => this.props.onChange && this.props.onChange(value));

  handleBlur = _ => this.setState({
    value: this.props.value
  }, _ => this.props.onBlur && this.props.onBlur());

  render() {
    const { children, onChange, onBlur, ...props } = this.props;
    const { value } = this.state;

    const newProps = {
      ...props,
      value,
      ...(onChange ? { onChange: this.handleChange } : null),
      ...(onBlur ? { onBlur: this.handleBlur } : null)
    }

    return (
      <WrappedComponent {...newProps}>
        {children}
      </WrappedComponent>
    )
  }
}
