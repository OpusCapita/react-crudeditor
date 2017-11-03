import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

//
// TODO maybe refactor the following function somehow
// it works but looks like a spell to summon satan
//
// inputs:
// errors: errors.fields from reducer
// showErrors: mirrored structure to errors, but end values are true/false
//
const errorsExistAndVisible = (errors, showErrors) =>
  !!Object.keys(showErrors).
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
          k => ~Object.keys(errors[f]).indexOf(k) &&
            Array.isArray(errors[f][k]) &&
            errors[f][k].length > 0
        )
    ));

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
          fieldErrors: PropTypes.object
        })
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
    toggleFieldErrors = (path, show) => this.setState(prevState => ({
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
    }));

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

    render() {
      const props = {
        ...this.props,
        fieldErrorsWrapper: {
          toggleFieldErrors: this.toggleFieldErrors,
          shouldShowErrors: this.shouldShowErrors,
          errorsExistAndVisible: errorsExistAndVisible(this.props.model.data.fieldErrors, this.state.showFieldErrors)
        }
      }

      return <WrappedComponent {...props}/>
    }
  }
}

export default withFieldErrors;
