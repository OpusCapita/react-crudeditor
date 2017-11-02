import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Col, ButtonToolbar } from 'react-bootstrap';
import isEqual from 'lodash/isEqual';

import ConfirmDialog from '../ConfirmDialog';

import {
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW
} from '../../crudeditor-lib/common/constants';

class EditTab extends React.PureComponent {
  handleSubmit = e => {
    e.preventDefault();

    if (~[VIEW_CREATE, VIEW_EDIT].indexOf(this.props.model.data.viewName)) {
      this.props.model.actions.saveInstance();
    }
  }

  handleDelete = _ => this.props.model.actions.deleteInstances(this.props.model.data.persistentInstance)

  handleSaveAndNew = _ => this.props.model.actions.saveAndNewInstance()

  handleSaveAndNext = _ => this.props.model.actions.saveAndNextInstance()

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
          formInstance
        }
      }
    } = this.props;

    const { i18n } = this.context;

    // FIXME: consistency with hasUnsavedChanges variable in EditHeading component.
    const disableSave = isEqual(persistentInstance, formInstance);

    const buttons = [
      <Button bsStyle='link' onClick={exitView} key="Cancel">
        {this.context.i18n.getMessage('crudEditor.cancel.button')}
      </Button>
    ];

    if (viewName === VIEW_EDIT) {
      buttons.push(
        <ConfirmDialog
          trigger='click'
          onConfirm={this.handleDelete}
          title='Delete confirmation'
          message={i18n.getMessage('crudEditor.delete.confirmation')}
          buttonTextConfirm={i18n.getMessage('crudEditor.delete.button')}
          key="Delete"
        >
          <Button>{i18n.getMessage('crudEditor.delete.button')}</Button>
        </ConfirmDialog>
      )
    }

    if (~[VIEW_EDIT, VIEW_SHOW].indexOf(viewName)) {
      buttons.push(
        <Button disabled={true} key="Revisions">
          {i18n.getMessage('crudEditor.revisions.button')}
        </Button>)
    }

    if (~[VIEW_CREATE, VIEW_EDIT].indexOf(viewName)) {
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

    if (~[VIEW_CREATE, VIEW_EDIT].indexOf(viewName)) {
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
          { sectionsAndFields }
        </Col>
        <FormGroup>
          <Col sm={12}>
            <ButtonToolbar style={{ float: 'right' }}>{ buttons }</ButtonToolbar>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

EditTab.propTypes = {
  model: PropTypes.shape({
    data: PropTypes.shape({
      viewName: PropTypes.string,
      persistentInstance: PropTypes.object
    }),
    actions: PropTypes.objectOf(PropTypes.func)
  }).isRequired
}

EditTab.contextTypes = {
  i18n: PropTypes.object
};

export default EditTab;
