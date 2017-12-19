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
  OPERATION_SAVE,
  OPERATION_SAVEANDNEW,
  OPERATION_SAVEANDNEXT,
  OPERATION_CANCEL
} from '../../crudeditor-lib/common/constants';

import {
  Button,
  Form,
  FormGroup,
  Col,
  ButtonToolbar
} from 'react-bootstrap';

export default class EditTab extends React.PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.shape({
        viewName: PropTypes.string,
        persistentInstance: PropTypes.object,
        formInstance: PropTypes.object
      }),
      operations: PropTypes.shape({
        custom: PropTypes.func.isRequired,
        external: PropTypes.arrayOf(PropTypes.shape({
          title: PropTypes.string,
          icon: PropTypes.string,
          handler: PropTypes.func
        })).isRequired
      })
    }).isRequired,
    toggleFieldErrors: PropTypes.func,
    toggledFieldErrors: PropTypes.object
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  handleSaveAndNext = handler => _ => {
    this.props.toggleFieldErrors(true);
    handler();
  }

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
    this.props.toggleFieldErrors(true);
    handler();
  }

  handleSaveAndNew = handler => _ => {
    this.props.toggleFieldErrors(true);
    handler()
  }

  render() {
    const {
      model: {
        data: {
          viewName,
          persistentInstance,
          formInstance,
          permissions: {
            crudOperations: permissions
          }
        },
        operations: {
          custom,
          external: externalOperations,
          standard
        }
      },
      toggledFieldErrors,
      toggleFieldErrors
    } = this.props;

    const { i18n } = this.context;

    const disableSave = formInstance && isEqual(persistentInstance, formInstance);

    const buttons = [];

    const customOperations = custom({ instance: persistentInstance });
    const standardOperations = standard({ instance: persistentInstance });

    const cancelOperation = standardOperations.find(({ name }) => name === OPERATION_CANCEL);

    if (permissions.view && cancelOperation) {
      const { handler } = cancelOperation;

      buttons.push(
        <ConfirmUnsavedChanges key='Cancel' showDialog={this.hasUnsavedChanges}>
          <Button
            bsStyle='link'
            onClick={handler}
          >
            {i18n.getMessage('crudEditor.cancel.button')}
          </Button>
        </ConfirmUnsavedChanges>
      )
    }

    buttons.push(
      ...customOperations.
        map(({ name, handler, disabled }, index) => (
          <ConfirmUnsavedChanges
            key={`internal-operation-${index}`}
            showDialog={this.showConfirmDialog}
          >
            <Button
              onClick={handler}
              disabled={!!disabled}
            >
              {getModelMessage(i18n, `model.label.${name}`, name)}
            </Button>
          </ConfirmUnsavedChanges>
        ))
    );

    buttons.push(
      ...externalOperations.map(({ title, handler }, index) => (
        <Button
          onClick={_ => handler(persistentInstance)}
          key={`external-operation-${index}`}
        >
          {title}
        </Button>
      ))
    )

    const deleteOperation = standardOperations.find(({ name }) => name === OPERATION_DELETE);

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
            disabled={!!disabled}
          >
            {i18n.getMessage('crudEditor.delete.button')}
          </Button>
        </ConfirmDialog>
      )
    }

    const saveAndNewOperation = standardOperations.find(({ name }) => name === OPERATION_SAVEANDNEW);

    if ([VIEW_CREATE, VIEW_EDIT].indexOf(viewName) > -1 && permissions.create && saveAndNewOperation) {
      const { handler } = saveAndNewOperation;

      buttons.push(
        <Button
          onClick={this.handleSaveAndNew(handler)}
          disabled={disableSave}
          key="Save and New"
        >
          {i18n.getMessage('crudEditor.saveAndNew.button')}
        </Button>)
    }

    const saveAndNextOperation = standardOperations.find(({ name }) => name === OPERATION_SAVEANDNEXT);

    if (viewName === VIEW_EDIT && saveAndNextOperation) {
      const { handler } = saveAndNextOperation;

      buttons.push(
        <Button
          onClick={this.handleSaveAndNext(handler)}
          disabled={disableSave}
          key="Save and Next"
        >
          {i18n.getMessage('crudEditor.saveAndNext.button')}
        </Button>)
    }

    const saveOperation = standardOperations.find(({ name }) => name === OPERATION_SAVE);

    if ([VIEW_CREATE, VIEW_EDIT].indexOf(viewName) > -1 && saveOperation) {
      buttons.push(
        <Button
          disabled={disableSave}
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
          <FormGrid
            model={this.props.model}
            toggledFieldErrors={toggledFieldErrors}
            toggleFieldErrors={toggleFieldErrors}
          />
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
