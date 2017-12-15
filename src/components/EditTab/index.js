import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { getModelMessage } from '../lib';
import ConfirmDialog from '../ConfirmDialog';
import ConfirmUnsavedChanges from '../ConfirmDialog/ConfirmUnsavedChanges';
import FormGrid from '../FormGrid';

import {
  VIEW_CREATE,
  VIEW_EDIT
} from '../../crudeditor-lib/common/constants';

import {
  Button,
  Form,
  FormGroup,
  Col,
  ButtonToolbar,
  Glyphicon
} from 'react-bootstrap';

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
    toggledFieldErrors: PropTypes.object
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  handleDelete = _ => this.props.model.actions.deleteInstances(this.props.model.data.persistentInstance)

  handleSaveAndNext = _ => {
    this.props.toggleFieldErrors(true);
    this.props.model.actions.saveAndNextInstance();
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

  handleSubmit = e => {
    e.preventDefault();
    this.props.toggleFieldErrors(true);
    this.props.model.actions.saveInstance();
  }

  handleSaveAndNew = _ => {
    this.props.toggleFieldErrors(true);
    this.props.model.actions.saveAndNewInstance()
  }

  render() {
    const {
      model: {
        actions: {
          exitView,
          saveAndNextInstance
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
          internal: internalOperations,
          external: externalOperations
        }
      },
      toggledFieldErrors,
      toggleFieldErrors
    } = this.props;

    const { i18n } = this.context;

    const disableSave = (formInstance && isEqual(persistentInstance, formInstance));

    const buttons = [];

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
      ...internalOperations(persistentInstance).map(({ name, icon, handler, type }, index) => (
        <ConfirmUnsavedChanges
          key={`internal-operation-${index}`}
          showDialog={this.showConfirmDialog}
        >
          <Button onClick={handler}>
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

    if (viewName === VIEW_EDIT && permissions.delete) {
      buttons.push(
        <ConfirmDialog
          message={i18n.getMessage('crudEditor.delete.confirmation')}
          textConfirm={i18n.getMessage('crudEditor.delete.button')}
          textCancel={i18n.getMessage('crudEditor.cancel.button')}
          key="Delete"
        >
          <Button onClick={this.handleDelete}>
            {i18n.getMessage('crudEditor.delete.button')}
          </Button>
        </ConfirmDialog>
      )
    }

    if ([VIEW_CREATE, VIEW_EDIT].indexOf(viewName) > -1 && permissions.create) {
      buttons.push(
        <Button
          onClick={this.handleSaveAndNew}
          disabled={disableSave}
          key="Save and New"
        >
          {i18n.getMessage('crudEditor.saveAndNew.button')}
        </Button>)
    }

    if (viewName === VIEW_EDIT && saveAndNextInstance) {
      buttons.push(
        <Button
          onClick={this.handleSaveAndNext}
          disabled={disableSave}
          key="Save and Next"
        >
          {i18n.getMessage('crudEditor.saveAndNext.button')}
        </Button>)
    }

    if ([VIEW_CREATE, VIEW_EDIT].indexOf(viewName) > -1) {
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
      <Form horizontal={true} onSubmit={this.handleSubmit}>
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
