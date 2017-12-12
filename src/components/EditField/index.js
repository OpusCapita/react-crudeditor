import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { getModelMessage } from '../lib'
import FieldErrorLabel from '../FieldErrors/FieldErrorLabel';

// XXX: Component, not PureComponent must be used to catch instance's field value change.
export default class EditField extends Component {
  static propTypes = {
    model: PropTypes.shape({
      actions: PropTypes.objectOf(PropTypes.func)
    }).isRequired,
    entry: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    fieldErrors: PropTypes.shape({
      errors: PropTypes.objectOf(PropTypes.array),
      toggleFieldErrors: PropTypes.func
    }),
    columns: PropTypes.number
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  }

  handleChange = name => value => {
    this.props.fieldErrors.toggleFieldErrors(name, false)

    return this.props.model.actions.changeInstanceField ?
      this.props.model.actions.changeInstanceField({
        name,
        value
      }) :
      null;
  }

  handleBlur = name => _ => this.props.fieldErrors.toggleFieldErrors(name, true)

  errors = _ => {
    const {
      entry: {
        name
      },
      fieldErrors: {
        errors
      } = {}
    } = this.props;

    return errors && errors[name] ? errors[name] : []
  }

  render() {
    const {
      entry: {
        name: fieldName,
        readOnly,
        component: FieldInput,
        valuePropName
      },
      model: {
        data: {
          fieldsMeta,
          formattedInstance: instance
        }
      },
      columns
    } = this.props;

    const required = fieldsMeta[fieldName].constraints && fieldsMeta[fieldName].constraints.required;

    const fieldInputProps = {
      id: fieldName,
      readOnly,
      [valuePropName]: instance[fieldName],
      onBlur: this.handleBlur(fieldName),
      onChange: this.handleChange(fieldName)
    }

    const labelColumns = columns <= 4 ? 2 * columns : 6;

    return (
      <FormGroup controlId={fieldName} validationState={this.errors().length ? 'error' : null}>
        <Col componentClass={ControlLabel} sm={labelColumns}>
          {
            getModelMessage(this.context.i18n, `model.field.${fieldName}`, fieldName) + (required ? '*' : '')
          }
        </Col>
        <Col sm={12 - labelColumns}>
          <FieldInput {...fieldInputProps} />
          <FieldErrorLabel errors={this.errors()}/>
        </Col>
      </FormGroup>
    );
  }
}

