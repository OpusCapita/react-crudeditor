import isEqual from 'lodash/isEqual';
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
        fieldErrors: PropTypes.object
      })
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  constructor(...args) {
    super(...args);

    this.state = {
      defaultShow: false, // Either true (show all field fields by default) or false (hide all field errors by default).
      exceptions: [] // An array of exceptions from default (empty when no exceptions).
    };

    this.state.errors = this.filterErrors({
      ...this.state,
      fieldErrors: this.props.model.data.fieldErrors
    });
  }

  componentWillReceiveProps = nextProps => nextProps !== this.props && this.setState(prevState => {
    const nextState = {};

    const fieldErrors = this.filterErrors({
      ...prevState,
      fieldErrors: nextProps.model.data.fieldErrors
    });

    if (!isEqual(fieldErrors, prevState.errors)) {
      nextState.errors = fieldErrors;
    }

    return nextState;
  })

  toggleFieldErrors = (
    show, // <boolean>
    fieldName // field name which "show" value must be applied to. If not specified, "show" value becomes "defaultShow".
  ) => this.setState(prevState => {
    const nextState = {};

    if (fieldName) {
      const fieldIndex = prevState.exceptions.indexOf(fieldName);

      if (show === prevState.defaultShow && fieldIndex !== -1) {
        // Default behaviour is requested but the field is among exceptions => removing it from exceptions.
        nextState.exceptions = prevState.exceptions.filter(exception => exception !== fieldName);
      } else if (show !== prevState.defaultShow && fieldIndex === -1) {
        // Exceptional behaviour is requested but the field is not among exceptions => adding it to exceptions.
        nextState.exceptions = [
          ...prevState.exceptions,
          fieldName
        ];
      }
    } else {
      if (show !== prevState.defaultShow) {
        nextState.defaultShow = show;
      }

      if (prevState.exceptions.length) {
        nextState.exceptions = [];
      }
    }

    if (Object.keys(nextState).length) { // Set of fields for show has changed => recalculate "errors".
      const fieldErrors = this.filterErrors({
        defaultShow: nextState.hasOwnProperty('defaultShow') ? nextState.defaultShow : prevState.defaultShow,
        exceptions: nextState.exceptions || prevState.exceptions,
        fieldErrors: this.props.model.data.fieldErrors
      });

      if (!isEqual(fieldErrors, prevState.errors)) {
        nextState.errors = fieldErrors;
      }
    }

    return nextState;
  })

  filterErrors = ({ defaultShow, exceptions, fieldErrors }) => Object.keys(fieldErrors).
    filter(fieldName => defaultShow ?
      exceptions.indexOf(fieldName) === -1 :
      exceptions.indexOf(fieldName) !== -1
    ).
    reduce(
      (rez, fieldName) => ({
        ...rez,
        [fieldName]: fieldErrors[fieldName]
      }),
      {}
    )

  render() {
    const { children, ...props } = this.props;

    return (
      <WrappedComponent {...props} toggledFieldErrors={this.state.errors} toggleFieldErrors={this.toggleFieldErrors}>
        {children}
      </WrappedComponent>
    );
  }
}
