import React, { PureComponent } from 'react';
import { Button, Form, FormGroup, Col } from 'react-bootstrap';
import isEqual from 'lodash/isEqual';

import Section from '../Section';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import connect from '../../../connect';
import { constants as commonConstants } from '../../../../common';

import CreateField from '../../../views/create/components/Field';
import EditField from '../../../views/edit/components/Field';
import ShowField from '../../../views/show/components/Field';

const {
  AFTER_ACTION_NEW,
  AFTER_ACTION_NEXT,

  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW
} = commonConstants;

export default class extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();

    if ([VIEW_CREATE, VIEW_EDIT].includes(this.props.viewName)) {
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
      persistentInstance,
      deleteInstances,
      viewName
    } = this.props;

    const isChangedInstance = isEqual(formInstance, persistentInstance);

    const Field = viewName === VIEW_CREATE && CreateField ||
      viewName === VIEW_EDIT && EditField ||
      viewName === VIEW_SHOW && ShowField;

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
              deleteInstances && <ConfirmDialog
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
