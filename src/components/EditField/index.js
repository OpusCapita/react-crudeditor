import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { getFieldText } from '../lib'
import FieldErrorLabel from '../FieldErrors/FieldErrorLabel';

// XXX: Component, not PureComponent must be used to catch instance's field value change.
class EditField extends Component {
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
          formatedInstance: instance
        }
      },
      fieldErrorsWrapper: {
        handleChange,
        handleBlur,
        fieldErrors
      } = {
        handleChange: _ => {},
        handleBlur: _ => {},
        fieldErrors: _ => []
      },
      columns
    } = this.props;

    const required = fieldsMeta[fieldName].constraints && fieldsMeta[fieldName].constraints.required;

    const fieldInputProps = {
      id: fieldName,
      readOnly,
      [valuePropName]: instance[fieldName],
      onBlur: handleBlur(fieldName),
      onChange: handleChange(fieldName)
    }

    const labelColumns = columns <= 4 ? 2 * columns : 6;

    return (
      <FormGroup controlId={fieldName} validationState={fieldErrors(fieldName).length ? 'error' : null}>
        <Col componentClass={ControlLabel} sm={labelColumns}>
          {
            getFieldText(this.context.i18n, fieldName) + (required && '*' || '')
          }
        </Col>
        <Col sm={12 - labelColumns}>
          <FieldInput {...fieldInputProps} />
          <FieldErrorLabel errors={fieldErrors(fieldName)}/>
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
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
    fieldErrors: PropTypes.func
  }),
  columns: PropTypes.number
}

EditField.contextTypes = {
  i18n: PropTypes.object
};

export default EditField;
