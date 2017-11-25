import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  FormGroup,
  Col,
  ButtonToolbar,
  Glyphicon
} from 'react-bootstrap';
import isEqual from 'lodash/isEqual';
import { getModelMessage } from '../lib';
import ConfirmDialog from '../ConfirmDialog';

import {
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW
} from '../../crudeditor-lib/common/constants';

export default class EditTab extends React.PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.shape({
        viewName: PropTypes.string,
        persistentInstance: PropTypes.object,
        formatedInstance: PropTypes.object
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
            crudOperations
          },
          operations: instanceOperations
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

    if (crudOperations.view) {
      buttons.push(
        <Button bsStyle='link' onClick={exitView} key="Cancel">
          {i18n.getMessage('crudEditor.cancel.button')}
        </Button>
      )
    }

    // FIXME: check whether there are unsaved changes before calling operation handler.

    // SHOW & EDIT expose 'persistentInstance'; CREATE exposes 'formatedInstance'
    const operations = instanceOperations(persistentInstance || formatedInstance);

    buttons.push(...operations.map((operation, index) => (
      <Button
        onClick={operation.handler}
        key={`operation-${index}`}
      >
        {operation.icon && <Glyphicon glyph={operation.icon}/>}
        {operation.icon && ' '}
        {getModelMessage(i18n, `model.label.${operation.name}`, operation.name)}
      </Button>
    )));

    if (viewName === VIEW_EDIT && crudOperations.delete) {
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

    if ([VIEW_CREATE, VIEW_EDIT].indexOf(viewName) > -1 && crudOperations.create) {
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

