import React, { Component } from 'react';
import { FormGroup, Col, ControlLabel, HelpBlock } from 'react-bootstrap';

import connect from '../../../../connect';
import { constants as commonConstants } from '../../../../common';

import {
  getErrors,
  getFieldsMeta,
  getFormInstance
} from '../../selectors';

import {
  validateInstanceField,
  changeInstanceField
} from '../../actions';

const { FORM_ENTRY_MODE_READONLY } = commonConstants;

@connect({
  fieldsErrors: getErrors,
  fieldsMeta: getFieldsMeta,
  instance: getFormInstance
}, {
  validateInstanceField,
  changeInstanceField
})
export default class extends Component {  // XXX: Component, not PureComponent must be used to catch instance's field value change.
  handleChange = value => this.props.changeInstanceField(this.props.entry.name, value)

  handleBlur = _ => this.props.validateInstanceField(this.props.entry.name);

  render() {
    const {
      instance,
      entry: {
        name: fieldName,
        mode,
        Component: FieldInput
      },
      key,
      fieldsMeta,
      fieldsErrors
    } = this.props;

    const required = fieldsMeta[fieldName].constraints && fieldsMeta[fieldName].constraints.required;
    const errors = fieldsErrors && fieldsErrors[fieldName];

    return (
      <FormGroup key={key} controlId={fieldName} validationState={errors ? 'error' : null}>
        <Col componentClass={ControlLabel} sm={2}>
          {
            fieldName.replace(/(^|\s)[a-z]/g, char => char.toUpperCase()) +
              (required && '*' || '')
          }
        </Col>
        <Col sm={1} className='text-right' />
        <Col sm={9}>
          <FieldInput
            id={fieldName}
            readOnly={mode === FORM_ENTRY_MODE_READONLY}
            value={instance[fieldName]}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
          />
          {errors && <HelpBlock>{errors}</HelpBlock>}
        </Col>
      </FormGroup>
    );
  }
}
