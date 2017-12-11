import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import { noop } from '../lib';

export default WrappedComponent => class DeferValueSync extends PureComponent {
  static propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
  }

  static defaultProps = {
    value: null,
    onChange: noop,
    onBlur: noop
  }

  constructor(...args) {
    super(...args);

    this.state = {
      value: this.props.value
    }
  }

  handleChange = value => {
    console.log('hoc onChange', {value})

    this.setState({
      value
    }, _ => this.props.onChange(value))
  }

  handleBlur = _ => {
    console.log('hoc onBlur', {stateValue: this.state.value})

    this.setState({
      value: this.props.value
    }, _ => this.props.onBlur())
  }

  render() {
    const { children, ...props } = this.props;
    const { value } = this.state;

    const newProps = {
      ...props,
      value,
      onChange: this.handleChange,
      onBlur: this.handleBlur
    }


    return (
      <WrappedComponent {...newProps}>
        {children}
      </WrappedComponent>
    )
  }
}