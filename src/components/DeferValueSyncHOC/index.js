import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
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

  componentDidMount() {
    this.me = findDOMNode(this);
    this.me.addEventListener('keydown', this.handleEnterKey)
  }

  componentWillUnmount() {
    this.me.removeEventListener('keydown', this.handleEnterKey)
  }

  syncPropsAndState = callback => this.setState({ value: this.props.value }, callback);

  handleEnterKey = e => {
    const key = e.key === 'Enter' ? 13 : e.keyCode || e.charCode;

    if (key === 13) {
      this.syncPropsAndState()
    }
  }

  handleChange = value => this.setState({ value }, _ => this.props.onChange && this.props.onChange(value));

  handleBlur = _ => this.syncPropsAndState(_ => this.props.onBlur && this.props.onBlur());

  render() {
    const { children, onChange, onBlur, ...props } = this.props;

    const newProps = {
      ...props,
      value: this.me && (
        this.me === document.activeElement ||
          this.me.hasChildNodes() &&
          Array.prototype.some.call(this.me.children, el => el === document.activeElement)
      ) ?
        this.state.value :
        this.props.value,
      ...(onChange && { onChange: this.handleChange }),
      ...(onBlur && { onBlur: this.handleBlur })
    }

    return (
      <WrappedComponent {...newProps}>
        {children}
      </WrappedComponent>
    )
  }
}
