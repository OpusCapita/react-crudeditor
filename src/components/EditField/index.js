import React, { Component } from 'react';
import { FormGroup, Col, ControlLabel, HelpBlock } from 'react-bootstrap';

// XXX: Component, not PureComponent must be used to catch instance's field value change.
export default class extends Component {
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
          fieldsErrors,
          formatedInstance: instance
        },
        actions: {
          changeInstanceField,
          validateInstanceField
        }
      }
    } = this.props;

    const required = fieldsMeta[fieldName].constraints && fieldsMeta[fieldName].constraints.required;

    const errors = fieldsErrors && fieldsErrors[fieldName] && fieldsErrors[fieldName].length ?
      fieldsErrors[fieldName].map(({ message }) => message).join('; ') :
      null;

    const fieldInputProps = {
      id: fieldName,
      readOnly,
      [valuePropName]: instance[fieldName]
    }

    if (validateInstanceField) {
      fieldInputProps.onBlur = _ => validateInstanceField(fieldName);
    }

    if (changeInstanceField) {
      fieldInputProps.onChange = value => changeInstanceField({
        name: fieldName,
        value
      })
    }

    return (
      <FormGroup controlId={fieldName} validationState={errors && 'error'}>
        <Col componentClass={ControlLabel} sm={2}>
          {
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/[^A-Z](?=[A-Z])/g, '$&\u00A0') +
              (required && '*' || '')
          }
        </Col>
        <Col sm={1} className='text-right' />
        <Col sm={9}>
          <FieldInput {...fieldInputProps} />
          {errors && <HelpBlock>{errors}</HelpBlock>}
        </Col>
      </FormGroup>
    );
  }
}
