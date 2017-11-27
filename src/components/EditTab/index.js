import React from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';
import { getModelMessage } from '../lib';
import ConfirmDialog from '../ConfirmDialog';

import {
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW
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
        formatedInstance: PropTypes.object,
        formInstance: PropTypes.object
      }),
      actions: PropTypes.objectOf(PropTypes.func)
    }).isRequired,
    fieldErrorsWrapper: PropTypes.objectOf(PropTypes.func)
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  handleDelete = _ => this.props.model.actions.deleteInstances(this.props.model.data.persistentInstance)

  handleSaveAndNext = _ => this.props.model.actions.saveAndNextInstance();

  showConfirmDialog = type => _ => {
    const {
      viewName,
      formInstance,
      persistentInstance
    } = this.props.model.data;

    const hasUnsavedChanges = (viewName === VIEW_EDIT && !isEqual(formInstance, persistentInstance)) ||
      (viewName === VIEW_CREATE && Object.keys(formInstance).some(key => formInstance[key] !== null));

    return type === 'custom' && hasUnsavedChanges;
  }

  render() {
    const {
      children: sectionsAndFields,
      model: {
        actions: {
          exitView,
          saveAndNextInstance
        },
        data: {
          viewName,
          persistentInstance,
          formInstance,
          formatedInstance,
          permissions: {
            crudOperations: permissions
          },
          operations
        }
      },
      fieldErrorsWrapper: {
        handleSaveAndNew,
        handleSubmit
      } = {}
    } = this.props;

    const { i18n } = this.context;

    const disableSave = (formInstance && isEqual(persistentInstance, formInstance));

    const buttons = [];

    if (permissions.view) {
      buttons.push(
        <Button bsStyle='link' onClick={exitView} key="Cancel">
          {i18n.getMessage('crudEditor.cancel.button')}
        </Button>
      )
    }

    buttons.push(
      ...operations(viewName === VIEW_CREATE ? formatedInstance : persistentInstance).
        map(({ name, icon, handler, type }, index) => (
          <ConfirmDialog
            trigger='click'
            onConfirm={handler}
            title="You have unsaved changes"
            message={i18n.getMessage('crudEditor.unsaved.confirmation')}
            textConfirm={i18n.getMessage('crudEditor.confirm.action')}
            textCancel={i18n.getMessage('crudEditor.cancel.button')}
            key={`operation-${index}`}
            showDialog={this.showConfirmDialog(type)}
          >
            <Button>
              {icon && <Glyphicon glyph={icon} />}
              {icon && ' '}
              {getModelMessage(i18n, `model.label.${name}`, name)}
            </Button>
          </ConfirmDialog>
        ))
    );

    if (viewName === VIEW_EDIT && permissions.delete) {
      buttons.push(
        <ConfirmDialog
          trigger='click'
          onConfirm={this.handleDelete}
          title='Delete confirmation'
          message={i18n.getMessage('crudEditor.delete.confirmation')}
          textConfirm={i18n.getMessage('crudEditor.delete.button')}
          textCancel={i18n.getMessage('crudEditor.cancel.button')}
          key="Delete"
        >
          <Button>{i18n.getMessage('crudEditor.delete.button')}</Button>
        </ConfirmDialog>
      )
    }

    if ([VIEW_EDIT, VIEW_SHOW].indexOf(viewName) > -1) {
      buttons.push(
        <Button disabled={true} key="Revisions">
          {i18n.getMessage('crudEditor.revisions.button')}
        </Button>)
    }

    if ([VIEW_CREATE, VIEW_EDIT].indexOf(viewName) > -1 && permissions.create) {
      buttons.push(
        <Button
          onClick={handleSaveAndNew}
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
      <Form horizontal={true} onSubmit={handleSubmit}>
        <Col sm={12}>
          { sectionsAndFields }
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

