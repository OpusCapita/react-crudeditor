import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Col,
  ControlLabel,
  Glyphicon,
  FormControl,
  OverlayTrigger,
  Popover
} from 'react-bootstrap';
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

    const fieldLabelMessage = getModelMessage(this.context.i18n, `model.field.${fieldName}.label`, fieldName);

    // TODO decide between top/bottom popover position according to screen boundaries

    return (
      <FormGroup controlId={fieldName} validationState={!readOnly && toggledFieldErrors[fieldName] ? 'error' : null}>
        <Col componentClass={ControlLabel} sm={labelColumns}>
          {
            fieldLabelMessage + (required ? '*' : '')
          }
        </Col>
        <Col sm={12 - labelColumns}>
          <Col sm={1}>
            <FormControl.Static className='text-right' style={{ cursor: 'pointer', verticalAlign: 'middle' }}>
              <OverlayTrigger
                trigger="click"
                rootClose
                placement="top"
                overlay={
                  <Popover
                    id={`${fieldName}-tooltip`}
                    title={<label>{fieldLabelMessage}</label>}
                  >
                    <small class="text-muted">
                      Internal human readable name for this Supplier. E.g. 'Bosch Frankfurt HQ'.
                      ID could be composed of some cryptic alphanumeric characters. e.g. <i>BO13456</i>.
                    </small>
                  </Popover>
                }
              >
                <Glyphicon glyph="info-sign" className='text-muted'/>
              </OverlayTrigger>
            </FormControl.Static>
          </Col>
          <Col sm={11}>
            <FieldInput {...fieldInputProps} />
            <FieldErrorLabel errors={!readOnly && toggledFieldErrors[fieldName] || []} fieldName={fieldName}/>
          </Col>
        </Col>
      </FormGroup>
    );
  }
}

