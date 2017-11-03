import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { getFieldText } from '../lib'
import FieldErrorLabel from '../FieldErrors/FieldErrorLabel';

// XXX: Component, not PureComponent must be used to catch instance's field value change.
class EditField extends Component {
  handleChange = value => {
    this.props.fieldErrorsWrapper.toggleFieldErrors(this.props.entry.name, false);

    return this.props.model.actions.changeInstanceField ?
      this.props.model.actions.changeInstanceField({
        name: this.props.entry.name,
        value
      }) :
      null;
  }

  render() {
    const {
      entry: {
        name: fieldName,
        readOnly,
        Component: FieldInput,
        valuePropName
      },
      model: {
        data: {
          fieldsMeta,
          fieldErrors,
          formatedInstance: instance
        }
      },
      fieldErrorsWrapper: {
        shouldShowErrors,
        toggleFieldErrors
      }
    } = this.props;

    const required = fieldsMeta[fieldName].constraints && fieldsMeta[fieldName].constraints.required;

    const fieldInputProps = {
      id: fieldName,
      readOnly,
      [valuePropName]: instance[fieldName],
      onBlur: _ => toggleFieldErrors(fieldName, true),
      onChange: this.handleChange
    }

    return (
      <FormGroup controlId={fieldName} validationState={shouldShowErrors(fieldName) ? 'error' : null}>
        <Col componentClass={ControlLabel} sm={2}>
          {
            getFieldText(this.context.i18n, fieldName) + (required && '*' || '')
          }
        </Col>
        <Col sm={1} className='text-right' />
        <Col sm={9}>
          <FieldInput {...fieldInputProps} />
          <FieldErrorLabel
            errors={shouldShowErrors(fieldName) ? fieldErrors[fieldName] : []}
            show={shouldShowErrors(fieldName)}
          />
        </Col>
      </FormGroup>
    );
  }
}

EditField.propTypes = {
  model: PropTypes.shape({
    actions: PropTypes.objectOf(PropTypes.func)
  }).isRequired,
  entry: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  fieldErrorsWrapper: PropTypes.shape({
    toggleFieldErrors: PropTypes.func
  })
}

EditField.contextTypes = {
  i18n: PropTypes.object
};

export default EditField;
