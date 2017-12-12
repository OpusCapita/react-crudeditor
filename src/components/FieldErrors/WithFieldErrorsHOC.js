import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

//
// WithFieldErrors is a Higher-Order Component used to wrap components containing editable forms
// it provides a source of truth for displaying errors and disabling/enabling action buttons
// it passes down the component tree 'fieldErrorsWrapper' object with HOC-specific props along with parent props
//
export default WrappedComponent => class WithFieldErrors extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.shape({
        fieldErrors: PropTypes.object,
        fieldsMeta: PropTypes.object,
        formFilter: PropTypes.object
      }),
      actions: PropTypes.objectOf(PropTypes.func)
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  constructor(...args) {
    super(...args);

    const {
      fieldsMeta, // EDIT and CREATE views
      formFilter // SEARCH view
    } = this.props.model.data

    // create an object with all possible fields for current view
    // object doesn't shrink in the future; we only toggle boolean value
    this.state = {
      showFieldErrors: Object.keys(fieldsMeta || formFilter).
        reduce((obj, key) => ({ ...obj, [key]: false }), {})
    }
  }

  // fieldName <string> or <[string, string{'to', 'from'}]>
  // show <boolean>
  toggleFieldErrors = (fieldName, show) => this.setState(
    prevState => ({
      // if fieldName is boolean - set value for all fields
      showFieldErrors: typeof fieldName === 'boolean' ?
        Object.keys(prevState.showFieldErrors).reduce(
          (obj, key) => ({
            ...obj,
            [key]: fieldName
          }),
          {}
        ) : {
          ...prevState.showFieldErrors,
          [fieldName]: show
        }
    }));

  render() {
    const { children, ...props } = this.props;
    const { fieldErrors } = this.props.model.data;
    const { showFieldErrors } = this.state;

    const errors = Object.keys(fieldErrors).
      filter(key => showFieldErrors[key]).
      reduce((obj, key) => ({ ...obj, [key]: fieldErrors[key] }), {});

    const newProps = {
      ...props,
      fieldErrors: {
        errors,
        toggleFieldErrors: this.toggleFieldErrors
      }
    }

    return (
      <WrappedComponent {...newProps}>
        {children}
      </WrappedComponent>
    );
  }
}
