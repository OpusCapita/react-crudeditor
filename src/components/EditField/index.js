import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Col, ControlLabel } from 'react-bootstrap';
import { getModelMessage } from '../lib'
import FieldErrorLabel from '../FieldErrors/FieldErrorLabel';

// XXX: Component, not PureComponent must be used to catch instance's field value change.
export default class EditField extends Component {
  static propTypes = {
    model: PropTypes.shape({
      actions: PropTypes.objectOf(PropTypes.func),
      data: PropTypes.shape({
        fieldsMeta: PropTypes.objectOf(PropTypes.shape({
          type: PropTypes.string.isRequired,
          constraints: PropTypes.object
        })),
        formattedInstance: PropTypes.object.isRequired
      })
    }).isRequired,
    entry: PropTypes.shape({
      name: PropTypes.string.isRequired,
      readOnly: PropTypes.bool,
      component: PropTypes.func.isRequired,
      valuePropName: PropTypes.string.isRequired
    }),
    toggledFieldErrors: PropTypes.object,
    toggleFieldErrors: PropTypes.func,
    columns: PropTypes.number.isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  }

  handleChange = name => value => {
    if (this.props.toggleFieldErrors) {
      this.props.toggleFieldErrors(false, name);
    }

    if (this.props.model.actions.changeInstanceField) {
      this.props.model.actions.changeInstanceField({
        name,
        value
      });
    }
  }

  handleBlur = name => _ => this.props.toggleFieldErrors && this.props.toggleFieldErrors(true, name)

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
      columns,
      toggledFieldErrors
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
      <FormGroup controlId={fieldName} validationState={!readOnly && toggledFieldErrors[fieldName] ? 'error' : null}>
        <Col componentClass={ControlLabel} sm={labelColumns}>
          {
            getModelMessage(this.context.i18n, `model.field.${fieldName}`, fieldName) + (required ? '*' : '')
          }
        </Col>
        <Col sm={12 - labelColumns}>
          <FieldInput {...fieldInputProps} />
          <FieldErrorLabel errors={!readOnly && toggledFieldErrors[fieldName] || []} fieldName={fieldName}/>
        </Col>
      </FormGroup>
    );
  }
}

