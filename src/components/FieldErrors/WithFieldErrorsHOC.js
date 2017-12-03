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
const withFieldErrors = WrappedComponent => {
  return class WithFieldErrors extends PureComponent {
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
      prevState => typeof fieldName !== 'boolean' ? {
        showFieldErrors: {
          ...prevState.showFieldErrors,
          [fieldName]: show
        }
      } : { // if fieldName is boolean - set value for all fields
        showFieldErrors: Object.keys(this.props.model.data.fieldErrors).
          reduce((obj, key) => ({ ...obj, [key]: fieldName }), {})
      }
    );

    shouldShowErrors = fieldName => !!(
      this.state.showFieldErrors[fieldName] &&
      this.props.model.data.fieldErrors[fieldName] &&
      this.props.model.data.fieldErrors[fieldName].length > 0
    )

    // public API function for getting field errors
    fieldErrors = fieldName => {
      const { fieldErrors: errors } = this.props.model.data;
      const { showFieldErrors: showErrors } = this.state;

      // called without arguments should return a boolean (are there any errors to display on view or not)
      if (!fieldName) {
        return !!Object.keys(showErrors).
          filter(
            f => typeof showErrors[f] === 'object' ?
              Object.keys(showErrors[f]).some(k => showErrors[f][k]) :
              showErrors[f]
          ).
        // here we have fields which are set to be true in showErrors
        // now we need to check if there are actual errors for these fields
          some(f => errors[f] && errors[f].length > 0);
      }

      return this.shouldShowErrors(fieldName) ?
        errors[fieldName] :
        [];
    }

    // DOM events handlers passed to UI components

    // CONSUMER: EditField

    // name: field name, value: onChange value
    handleChange = name => value => {
      this.toggleFieldErrors(name, false)

      return this.props.model.actions.changeInstanceField ?
        this.props.model.actions.changeInstanceField({
          name,
          value
        }) :
        null;
    }

    handleBlur = name => _ => this.toggleFieldErrors(name, true)

    // CONSUMER: EditTab

    handleSubmit = e => {
      e.preventDefault();
      if ([VIEW_CREATE, VIEW_EDIT].indexOf(this.props.model.data.viewName) > -1) {
        this.toggleFieldErrors(true);
        this.props.model.actions.saveInstance();
      }
    }

    handleSaveAndNew = _ => {
      if (this.props.model.data.viewName === VIEW_CREATE) {
        this.toggleFieldErrors(true);
      }
      this.props.model.actions.saveAndNewInstance()
    }

    // CONSUMER: SearchForm

    handleFormFilterUpdate = fieldName => newFieldValue => {
      this.toggleFieldErrors(fieldName, false);

      this.props.model.actions.updateFormFilter({
        name: fieldName,
        value: newFieldValue
      });
    }

    handleFormFilterBlur = fieldName => _ => this.toggleFieldErrors(fieldName, true);

    render() {
      const { children, ...props } = this.props;

      const newProps = {
        ...props,
        fieldErrorsWrapper: {
          handleChange: this.handleChange,
          handleBlur: this.handleBlur,
          handleSubmit: this.handleSubmit,
          handleSaveAndNew: this.handleSaveAndNew,
          fieldErrors: this.fieldErrors,
          handleFormFilterBlur: this.handleFormFilterBlur,
          handleFormFilterUpdate: this.handleFormFilterUpdate
        }
      }

      return (
        <WrappedComponent {...newProps}>
          {children}
        </WrappedComponent>
      );
    }
  }
}

export default withFieldErrors;
