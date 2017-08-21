import React from 'react';
import { Button, Form, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import isEqual from 'lodash/isEqual';

export default class extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.handleFormFilterUpdate = this.props.model.data.searchableFields.reduce(
      (rez, { name }) => ({
        ...rez,
        [name]: value => this.props.model.actions.updateFormFilter({ name, value })
      }),
      {}
    );
  }

  handleCreate = _ => this.props.model.actions.createInstance();

  handleSubmit = e => {
    e.preventDefault();

    this.props.model.actions.searchInstances({
      filter: this.props.model.data.formFilter
    });
  }

  render() {
    const {
      data: {
        searchableFields,
        formFilter,
        resultFilter,
      },
      actions: {
        resetFormFilter
      }
    } = this.props.model;

    return (
      <Form horizontal={true} onSubmit={this.handleSubmit}>
        {searchableFields.map(({ name, Component }) =>
          <FormGroup key={`form-group-${name}`} controlId={`fg-${name}`}>
            <Col componentClass={ControlLabel} sm={2}>
              {name}
            </Col>
            <Col sm={10}>
              <Component value={formFilter[name]} onChange={this.handleFormFilterUpdate[name]} />
            </Col>
          </FormGroup>
        )}
        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Button
              bsStyle='link'
              onClick={resetFormFilter}
              disabled={!Object.keys(formFilter).some(
                field => formFilter[field] || formFilter[field] === false || formFilter[field] === 0
              )}
            >
              Reset
            </Button>
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
