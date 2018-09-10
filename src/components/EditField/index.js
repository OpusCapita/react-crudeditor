import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';
import { getModelMessage, getFieldLabel } from '../lib'
import FieldErrorLabel from '../FieldErrors/FieldErrorLabel';
import './styles.less';

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

    const { i18n } = this.context;

    const required = fieldsMeta[fieldName].constraints && fieldsMeta[fieldName].constraints.required;

    const fieldInputProps = {
      id: fieldName,
      readOnly,
      [valuePropName]: instance[fieldName],
      onBlur: this.handleBlur(fieldName),
      onChange: this.handleChange(fieldName)
    }

    const labelColumns = columns <= 4 ? 2 * columns : 6;

    const fieldLabel = getFieldLabel({ i18n, name: fieldName });

    const fieldHint = getModelMessage({
      i18n,
      key: `model.field.${fieldName}.hint`,
      defaultMessage: null
    });

    const fieldTooltip = getModelMessage({
      i18n,
      key: `model.field.${fieldName}.tooltip`,
      defaultMessage: null
    });

    return (
      <FormGroup controlId={fieldName} validationState={!readOnly && toggledFieldErrors[fieldName] ? 'error' : null}>
        <label
          htmlFor={fieldName}
          className={`col-sm-${labelColumns} control-label`}
        >
          {
            fieldLabel + (required ? '*' : '')
          }
        </label>
        <div className={`col-sm-${12 - labelColumns}`}>
          {
            fieldTooltip && (
              <span className="field-tooltip">
                <OverlayTrigger
                  trigger="click"
                  rootClose={true}
                  placement="top"
                  overlay={
                    <Popover
                      id={`${fieldName}-tooltip`}
                      title={<label>{fieldLabel}</label>}
                    >
                      <small className="text-muted">
                        {fieldTooltip}
                      </small>
                    </Popover>
                  }
                >
                  <span className="glyphicon glyphicon-info-sign text-muted"></span>
                </OverlayTrigger>
              </span>
            )
          }
          <FieldInput {...fieldInputProps} />
          {
            !readOnly && toggledFieldErrors[fieldName] ?
              (
                <FieldErrorLabel errors={toggledFieldErrors[fieldName]} fieldName={fieldName}/>
              ) :
              (
                <span className="hint label label-default">
                  <small className="text-muted">{fieldHint || '\u00A0'}</small>
                </span>
              )
          }
        </div>
      </FormGroup>
    );
  }
}

