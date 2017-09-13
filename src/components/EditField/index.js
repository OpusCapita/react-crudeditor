import React from 'react';
import { FormGroup, Col, ControlLabel, HelpBlock } from 'react-bootstrap';

export default class extends React.Component {  // XXX: Component, not PureComponent must be used to catch instance's field value change.
  handleChange = value => this.props.model.actions.changeInstanceField({
    name: this.props.entry.name,
    value
  })

  handleBlur = _ => this.props.model.actions.validateInstanceField(this.props.entry.name);

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
      fieldsErrors[fieldName].map(({ description }) => description).join('; ') :
      null;

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
          <FieldInput
            id={fieldName}
            readOnly={readOnly}
            {...{ [valuePropName]: instance[fieldName] }}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
          />
          {errors && <HelpBlock>{errors}</HelpBlock>}
        </Col>
      </FormGroup>
    );
  }
}
