import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Col, ButtonToolbar } from 'react-bootstrap';

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
          exitView
        },
        data: {
          viewName
        }
      }
    } = this.props;

    const buttons = [<Button bsStyle='link' onClick={exitView} key="Cancel">Cancel</Button>];

    if (viewName === VIEW_EDIT) {
      buttons.push(
        <ConfirmDialog
          trigger='click'
          onConfirm={this.handleDelete}
          title='Delete confirmation'
          message='Do you want to delete this item?'
          key="Delete"
        >
          <Button>Delete</Button>
        </ConfirmDialog>
      )
    }

    if (~[VIEW_CREATE, VIEW_EDIT, VIEW_SHOW].indexOf(viewName)) {
      buttons.push(<Button disabled={true} key="Revisions">Revisions</Button>)
    }

    if (~[VIEW_CREATE, VIEW_EDIT].indexOf(viewName)) {
      buttons.push(<Button onClick={this.handleSaveAndNew} key="Save and New">Save and New</Button>)
    }

    if (viewName === VIEW_EDIT) {
      buttons.push(<Button onClick={this.handleSaveAndNext} key="Save and Next">Save and Next</Button>)
    }

    if (~[VIEW_CREATE, VIEW_EDIT].indexOf(viewName)) {
      buttons.push(<Button bsStyle='primary' type='submit' key="Save">Save</Button>)
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

export default EditTab;
