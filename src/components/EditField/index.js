import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Col, ControlLabel, HelpBlock } from 'react-bootstrap';
import { getFieldText } from '../lib'

// XXX: Component, not PureComponent must be used to catch instance's field value change.
class EditField extends Component {
  handleValidation = _ => this.props.model.actions.validateInstanceField ?
    this.props.model.actions.validateInstanceField(this.props.entry.name) :
    null;

  handleChange = value => this.props.model.actions.changeInstanceField ?
    this.props.model.actions.changeInstanceField({
      name: this.props.entry.name,
      value
    }) :
    null;

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
      [valuePropName]: instance[fieldName],
      onBlur: this.handleValidation,
      onChange: this.handleChange
    }

    return (
      <FormGroup controlId={fieldName} validationState={errors && 'error'}>
        <Col componentClass={ControlLabel} sm={2}>
          {
            getFieldText(this.context.i18n, fieldName) + (required && '*' || '')
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

EditField.propTypes = {
  model: PropTypes.shape({
    actions: PropTypes.objectOf(PropTypes.func)
  }).isRequired,
  entry: PropTypes.shape({
    name: PropTypes.string.isRequired
  })
}

EditField.contextTypes = {
  i18n: PropTypes.object
};

export default EditField;
