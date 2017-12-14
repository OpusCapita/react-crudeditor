import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { getModelMessage } from '../lib';
import ConfirmDialog from '../ConfirmDialog';
import ConfirmUnsavedChanges from '../ConfirmDialog/ConfirmUnsavedChanges';
import FormGrid from '../FormGrid';

import {
  VIEW_CREATE,
  VIEW_EDIT,

  OPERATION_DELETE,
  OPERATION_EDIT,
  OPERATION_SAVE,
  OPERATION_SAVEANDNEW,
  OPERATION_SAVEANDNEXT,
  OPERATION_SHOW
} from '../../crudeditor-lib/common/constants';

import {
  Button,
  Form,
  FormGroup,
  Col,
  ButtonToolbar,
  Glyphicon
} from 'react-bootstrap';

const standardOperations = [
  OPERATION_DELETE,
  OPERATION_EDIT,
  OPERATION_SAVE,
  OPERATION_SAVEANDNEW,
  OPERATION_SAVEANDNEXT,
  OPERATION_SHOW
]

export default class EditTab extends React.PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.shape({
        viewName: PropTypes.string,
        persistentInstance: PropTypes.object,
        formInstance: PropTypes.object
      }),
      actions: PropTypes.objectOf(PropTypes.func),
      operations: PropTypes.shape({
        internal: PropTypes.func.isRequired,
        external: PropTypes.arrayOf(PropTypes.shape({
          title: PropTypes.string,
          icon: PropTypes.string,
          handler: PropTypes.func
        })).isRequired
      })
    }).isRequired,
    toggleFieldErrors: PropTypes.func,
    fieldErrors: PropTypes.object
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  handleDelete = _ => this.props.model.actions.deleteInstances(this.props.model.data.persistentInstance)

  handleSaveAndNext = _ => this.props.model.actions.saveAndNextInstance();

  hasUnsavedChanges = _ => {
    const {
      viewName,
      formInstance,
      persistentInstance
    } = this.props.model.data;

    return (viewName === VIEW_EDIT && !isEqual(formInstance, persistentInstance)) ||
      (viewName === VIEW_CREATE && Object.keys(formInstance).some(key => formInstance[key] !== null));
  }

  showConfirmDialog = _ => this.hasUnsavedChanges()

  handleSubmit = handler => e => {
    e.preventDefault();
    if ([VIEW_CREATE, VIEW_EDIT].indexOf(this.props.model.data.viewName) > -1) {
      this.props.toggleFieldErrors(true);
      handler();
    }
  }

  handleSaveAndNew = _ => {
    if (this.props.model.data.viewName === VIEW_CREATE) {
      this.props.toggleFieldErrors(true);
    }
    this.props.model.actions.saveAndNewInstance()
  }

  render() {
    const {
      model: {
        actions: {
          exitView
        },
        data: {
          viewName,
          persistentInstance,
          formInstance,
          permissions: {
            crudOperations: permissions
          }
        },
        operations: {
          internal,
          external: externalOperations
        }
      },
      fieldErrors,
      toggleFieldErrors
    } = this.props;

    const { i18n } = this.context;

    const disableSave = (formInstance && isEqual(persistentInstance, formInstance));

    const buttons = [];

    const internalOperations = internal({ instance: persistentInstance });

    if (permissions.view) {
      buttons.push(
        <ConfirmUnsavedChanges key='Cancel' showDialog={this.hasUnsavedChanges}>
          <Button bsStyle='link' onClick={exitView}>
            {i18n.getMessage('crudEditor.cancel.button')}
          </Button>
        </ConfirmUnsavedChanges>
      )
    }

    buttons.push(
      ...internalOperations.
      filter(({ name }) => standardOperations.indexOf(name) === -1).
      map(({ name, icon, handler, disabled }, index) => (
        <ConfirmUnsavedChanges
          key={`internal-operation-${index}`}
          showDialog={this.showConfirmDialog}
        >
          <Button
            onClick={handler}
            {...(disabled ? { disabled } : null)}
          >
            {icon && <Glyphicon glyph={icon} />}
            {icon && ' '}
            {getModelMessage(i18n, `model.label.${name}`, name)}
          </Button>
        </ConfirmUnsavedChanges>
      ))
    );

    buttons.push(
      externalOperations.map(({ title, icon, handler }, index) => (
        <Button
          onClick={_ => handler(persistentInstance)}
          key={`external-operation-${index}`}
        >
          {icon && <Glyphicon glyph={icon} />}
          {icon && ' '}
          {title}
        </Button>
      ))
    )

    const deleteOperation = internalOperations.find(({ name }) => name === OPERATION_DELETE);

    if (viewName === VIEW_EDIT && permissions.delete && deleteOperation) {
      const { handler, disabled } = deleteOperation;

      buttons.push(
        <ConfirmDialog
          message={i18n.getMessage('crudEditor.delete.confirmation')}
          textConfirm={i18n.getMessage('crudEditor.delete.button')}
          textCancel={i18n.getMessage('crudEditor.cancel.button')}
          key="Delete"
        >
          <Button
            onClick={handler}
            {...(disabled ? 'disabled' : null)}
          >
            {i18n.getMessage('crudEditor.delete.button')}
          </Button>
        </ConfirmDialog>
      )
    }

    const saveAndNewOperation = internalOperations.find(({ name }) => name === OPERATION_SAVEANDNEW);

    if ([VIEW_CREATE, VIEW_EDIT].indexOf(viewName) > -1 && permissions.create && saveAndNewOperation) {
      const { handler, disabled } = saveAndNewOperation;

      buttons.push(
        <Button
          onClick={handler}
          disabled={disableSave || disabled}
          key="Save and New"
        >
          {i18n.getMessage('crudEditor.saveAndNew.button')}
        </Button>)
    }

    const saveAndNextOperation = internalOperations.find(({ name }) => name === OPERATION_SAVEANDNEXT);

    if (viewName === VIEW_EDIT && saveAndNextOperation) {
      const { handler, disabled } = saveAndNextOperation;

      buttons.push(
        <Button
          onClick={handler}
          disabled={disableSave || disabled}
          key="Save and Next"
        >
          {i18n.getMessage('crudEditor.saveAndNext.button')}
        </Button>)
    }

    const saveOperation = internalOperations.find(({ name }) => name === OPERATION_SAVE);

    if ([VIEW_CREATE, VIEW_EDIT].indexOf(viewName) > -1 && saveOperation) {
      const { disabled } = saveOperation;

      buttons.push(
        <Button
          disabled={disableSave || disabled}
          bsStyle='primary'
          type='submit'
          key="Save"
        >
          {i18n.getMessage('crudEditor.save.button')}
        </Button>)
    }

    return (
      <Form horizontal={true} onSubmit={this.handleSubmit((saveOperation || {}).handler)}>
        <Col sm={12}>
          <FormGrid model={this.props.model} fieldErrors={fieldErrors} toggleFieldErrors={toggleFieldErrors}/>
        </Col>
        <FormGroup>
          <Col sm={12}>
            <div className="form-submit text-right">
              <ButtonToolbar>{ buttons }</ButtonToolbar>
            </div>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
