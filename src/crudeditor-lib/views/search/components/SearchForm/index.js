import React, { PureComponent } from 'react';
import { Button, Form, FormGroup, FormControl, Col, ControlLabel } from 'react-bootstrap';
import isEqual from 'lodash/isEqual';

import connect from '../../../../connect';

import {
  searchInstances,
  resetFormFilter,
  updateFormFilter
} from '../../actions';

import {
  getResultFilter,
  getFormFilter,
  getSearchableFields
} from '../../selectors';

import { actions as createActions } from '../../../create';

const { createInstance } = createActions;

@connect({
  resultFilter: getResultFilter,
  formFilter: getFormFilter,
  fields: getSearchableFields
}, {
  searchInstances,
  resetFormFilter,
  updateFormFilter,
  createInstance
})
export default class extends PureComponent {
  constructor(...args) {
    super(...args);

    this.handleFormFilterUpdate = this.props.fields.reduce(
      (rez, { name }) => ({
        ...rez,
        [name]: value => this.props.updateFormFilter({ name, value })
      }),
      {}
    );
  }

  handleCreate = _ => this.props.createInstance();

  handleSubmit = e => {
    e.preventDefault();

    this.props.searchInstances({
      filter: this.props.formFilter
    });
  }

  render() {
    const { fields, formFilter, resultFilter, resetFormFilter } = this.props;

    return (
      <Form horizontal={true} onSubmit={this.handleSubmit}>
        {fields.map(({ name, Component, type }) =>
          <FormGroup key={`form-group-${name}`} controlId='fg-${name}'>
            <Col componentClass={ControlLabel} sm={2}>
              {name}
            </Col>
            <Col sm={10}>
              {
                Component          && <Component value={formFilter[name]} onChange={this.handleFormFilterUpdate[name]} /> ||
                type === 'string'  && <FormControl type='text' value={formFilter[name]} onChange={this.handleFormFilterUpdate[name]} />
                type === 'number'  && <FormControl type='text' value={formFilter[name]} onChange={this.handleFormFilterUpdate[name]} />
                type === 'date'    && <FormControl type='text' value={formFilter[name]} onChange={this.handleFormFilterUpdate[name]} />
                type === 'boolean' && <FormControl type='text' value={formFilter[name]} onChange={this.handleFormFilterUpdate[name]} />
              }
            </Col>
          </FormGroup>
        )}
        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Button bsStyle='link' onClick={resetFormFilter} disabled={isEqual(formFilter, defaultFilter)}>Reset</Button>
            {' '}
            <Button onClick={this.handleCreate}>Create</Button>
            {' '}
            <Button bsStyle='primary' type='submit' disabled={isEqual(formFilter, resultFilter)}>Search</Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
