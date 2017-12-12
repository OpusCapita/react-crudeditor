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

  state = {
    defaultShow: false, // Either true (show all field fields by default) or false (hide all field errors by default).
    exceptions: [] // An array of exceptions from default (empty when no exceptions).
  }

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
    } else if (show !== prevState.defaultShow) {
      nextState.defaultShow = show;
    }

    return nextState;
  })

  render() {
    const { children, ...props } = this.props;
    const { defaultShow, exceptions } = this.state;
    const allErrors = props.model.data.fieldErrors;

    const filteredErrors = Object.keys(allErrors).
      filter(fieldName => defaultShow ?
        exceptions.indexOf(fieldName) === -1 :
        exceptions.indexOf(fieldName) !== -1
      ).
      reduce(
        (rez, fieldName) => ({
          ...rez,
          [fieldName]: allErrors[fieldName]
        }),
        {}
      );

    return (
      <WrappedComponent {...props} fieldErrors={filteredErrors} toggleFieldErrors={this.toggleFieldErrors}>
        {children}
      </WrappedComponent>
    );
  }
}
