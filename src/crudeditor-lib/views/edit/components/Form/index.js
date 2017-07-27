import React, { PureComponent } from 'react';
import { Button, Form, FormGroup, Col } from 'react-bootstrap';
import isEqual from 'lodash/isEqual';

import ConfirmDialog from '../../../../components/ConfirmDialog';
import connect from '../../../../connect';
import Section from '../Section';
import Field from '../Field';
import { constants as commonConstants } from '../../../../common';
//import { actions as searchActions } from '../../../search';

import {
  getActiveEntries,
  getPersistentInstance,
  getFormInstance
} from '../../selectors';

import {
  saveInstance,
  exitEdit
} from '../../actions';

import {
  AFTER_ACTION_NEW,
  AFTER_ACTION_NEXT,
  VIEW_NAME
} from '../../constants';

const {
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW
} = commonConstants;

//const { deleteInstances } = searchActions;

@connect({
  activeEntries: getActiveEntries,
  formInstance: getFormInstance,
  persistentInstance: getPersistentInstance
}, {
  exitEdit,
  saveInstance,
//  deleteInstances
})
export default class extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();

    if ([VIEW_CREATE, VIEW_EDIT].includes(VIEW_NAME)) {
      this.props.saveInstance();
    }
  }

//  handleDelete = _ => this.props.deleteInstances(this.props.formInstance)

  handleSaveAndNew = _ => this.props.saveInstance(AFTER_ACTION_NEW)

  handleSaveAndNext = _ => this.props.saveInstance(AFTER_ACTION_NEXT)

  render() {
    const {
      activeEntries,
      exitEdit,
      formInstance,
      persistentInstance
    } = this.props;

    const isChangedInstance = isEqual(formInstance, persistentInstance);

    return (
      <Form horizontal={true} onSubmit={this.handleSubmit}>
        <Col md={10}>
          {
            activeEntries.map(({ section, field, mode, entries, Component }, index) =>
              section && <Section key={index} title={section.replace(/(^|\s)[a-z]/g, char => char.toUpperCase())}>
                {
                  entries.map(({ field, mode, Component }, fieldIndex) =>
                    <Field
                      entry={{ name: field, mode, Component }}
                      key={`${index}_${fieldIndex}`}
                    />
                  )
                }
              </Section> ||
              field && <Field
                entry={{ name: field, mode, Component }}
                key={index}
              />
            )
          }
        </Col>

        <FormGroup>
          <Col smOffset={2} sm={10} className='text-right'>
            <Button bsStyle='link' onClick={exitEdit}>Cancel</Button>
            {
              VIEW_NAME === VIEW_EDIT && <ConfirmDialog
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
              [VIEW_CREATE, VIEW_EDIT].includes(VIEW_NAME) && <Button
                onClick={this.handleSaveAndNew}
                disabled={isChangedInstance}
              >
                Save and New
              </Button>
            }
            {' '}
            {
              VIEW_NAME === VIEW_EDIT && <Button
                onClick={this.handleSaveAndNext}
                disabled={isChangedInstance}
              >
                Save and Next
              </Button>
            }
            {' '}
            {
              [VIEW_CREATE, VIEW_EDIT].includes(VIEW_NAME) && <Button
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
