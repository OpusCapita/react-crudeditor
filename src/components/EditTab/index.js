import React from 'react';
import { Button, Form, FormGroup, Col } from 'react-bootstrap';
import isEqual from 'lodash/isEqual';

import ConfirmDialog from '../ConfirmDialog';

import {
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW
} from '../../crudeditor-lib/common/constants';

export default class extends React.PureComponent {
  handleSubmit = e => {
    e.preventDefault();

    if ([VIEW_CREATE, VIEW_EDIT].includes(this.props.model.data.viewName)) {
      this.props.model.actions.saveInstance();
    }
  }

  handleDelete = _ => this.props.model.actions.deleteInstances(this.props.model.data.formInstance)

  handleSaveAndNew = _ => this.props.model.actions.saveAndNewInstance()

  handleSaveAndNext = _ => this.props.model.actions.saveAndNextInstance()

  render() {
    const {
      children: sectionsAndFields,
      model: {
        actions: {
          exitEdit
        },
        data: {
          formInstance,
          persistentInstance,
          viewName
        }
      }
    } = this.props;

    const isChangedInstance = isEqual(formInstance, persistentInstance);

    return (
      <Form horizontal={true} onSubmit={this.handleSubmit}>
        <Col md={10}>
          {sectionsAndFields}
        </Col>

        <FormGroup>
          <Col smOffset={2} sm={10} className='text-right'>
            <Button bsStyle='link' onClick={exitEdit}>Cancel</Button>
            {
              viewName === VIEW_EDIT && <ConfirmDialog
                trigger='click'
                onConfirm={this.handleDelete}
                title='Delete confirmation'
                message='Do you want to delete this item?'
              >
                <Button>Delete</Button>
              </ConfirmDialog>
            }
            {' '}
            {
              [VIEW_CREATE, VIEW_EDIT].includes(viewName) && <Button
                onClick={this.handleSaveAndNew}
                disabled={isChangedInstance}
              >
                Save and New
              </Button>
            }
            {' '}
            {
              viewName === VIEW_EDIT && <Button
                onClick={this.handleSaveAndNext}
                disabled={isChangedInstance}
              >
                Save and Next
              </Button>
            }
            {' '}
            {
              [VIEW_CREATE, VIEW_EDIT].includes(viewName) && <Button
                bsStyle='primary'
                type='submit'
                disabled={isChangedInstance}
              >
                Save
              </Button>
            }
          </Col>
        </FormGroup>
      </Form>
    )
  }
}
