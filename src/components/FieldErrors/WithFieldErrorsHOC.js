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

    // path <string> or <[string, string{'to', 'from'}]>
    // show <boolean>
    toggleFieldErrors = (path, show) => this.setState(
      prevState => typeof path !== 'boolean' ? {
        showFieldErrors: {
          ...prevState.showFieldErrors,
          ...(
            Array.isArray(path) ? {
              [path[0]]: {
                ...(prevState.showFieldErrors[path[0]] || {}),
                [path[1]]: show
              }
            } : {
              [path]: show
            }
          )
        }
      } : { // if path is boolean - set value for all fields
        showFieldErrors: Object.keys(this.props.model.data.fieldErrors).
          reduce((obj, key) => ({ ...obj, [key]: path }), {})
      }
    );

    shouldShowErrors = path => Array.isArray(path) ? !!( // for 'path' type see 'toggleFieldErrors' description
      this.state.showFieldErrors[path[0]] &&
      this.state.showFieldErrors[path[0]][path[1]] &&
      this.props.model.data.fieldErrors[path[0]] &&
      this.props.model.data.fieldErrors[path[0]][path[1]] &&
      this.props.model.data.fieldErrors[path[0]][path[1]].length > 0
    ) :
      !!(
        this.state.showFieldErrors[path] &&
        this.props.model.data.fieldErrors[path] &&
        this.props.model.data.fieldErrors[path].length > 0
      )

    // public API function for getting field errors
    fieldErrors = path => {
      const { fieldErrors: errors } = this.props.model.data;
      const { showFieldErrors: showErrors } = this.state;

      // called without arguments should return a boolean (are there any errors to display on view or not)
      if (!path) {
        return !!Object.keys(showErrors).
          filter(
            f => typeof showErrors[f] === 'object' ?
              Object.keys(showErrors[f]).some(k => showErrors[f][k]) :
              showErrors[f]
          ).
        // here we have fields which are set to be true in showErrors
        // now we need to check if there are actual errors for these fields
          some(f => errors[f] && (
            Array.isArray(errors[f]) ?
              errors[f].length > 0 : // non-Range fields have error values of type Array which can be empty
              ['to', 'from'].some( // Range fields can have 'to' and/or 'from' fields with values of type Array
                k => Object.keys(errors[f]).indexOf(k) > -1 &&
                  Array.isArray(errors[f][k]) &&
                  errors[f][k].length > 0
              )
          ));
      }

      return this.shouldShowErrors(path) ?
        Array.isArray(path) ?
          errors[path[0]][path[1]] :
          errors[path] :
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

    handleFormFilterUpdate = path => newFieldValue => {
      this.toggleFieldErrors(path, false);

      this.props.model.actions.updateFormFilter({
        path,
        value: newFieldValue
      });
    }

    handleFormFilterBlur = path => _ => this.toggleFieldErrors(path, true);

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
