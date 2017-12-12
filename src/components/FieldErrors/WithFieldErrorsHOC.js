import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  VIEW_CREATE,
  VIEW_EDIT
} from '../../crudeditor-lib/common/constants';

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
        viewName: PropTypes.string
      }),
      actions: PropTypes.objectOf(PropTypes.func)
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  state = {
    showFieldErrors: {}
  }

  // fieldName <string> or <[string, string{'to', 'from'}]>
  // show <boolean>
  toggleFieldErrors = (fieldName, show) => this.setState(
    prevState => ({
      showFieldErrors: typeof fieldName === 'boolean' ?
        Object.keys(this.props.model.data.fieldErrors).reduce( // if fieldName is boolean - set value for all fields
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
