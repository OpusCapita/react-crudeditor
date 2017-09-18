import React from 'react';
import { Button, Form, FormGroup, Col, ControlLabel, HelpBlock } from 'react-bootstrap';
import isEqual from 'lodash/isEqual';

import { EMPTY_FIELD_VALUE } from '../../crudeditor-lib/common/constants';

export default class extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.handleFormFilterUpdate = fieldName => newFieldValue => this.props.model.actions.updateFormFilter({
      name: fieldName,
      value: newFieldValue
    });
  }

  handleCreate = _ => this.props.model.actions.createInstance();

  handleFormFilterBlur = fieldName => _ => this.props.model.actions.parseFormFilter(fieldName);

  handleSubmit = e => {
    e.preventDefault();

    this.props.model.actions.searchInstances({
      filter: this.props.model.data.formFilter
    });
  }

  render() {
    const {
      data: {
        fieldErrors: errors,
        formatedFilter,
        resultFilter,
        searchableFields
      },
      actions: {
        resetFormFilter
      }
    } = this.props.model;

    const searchableFieldsElement = searchableFields.map(({
      name,
      Component,
      valuePropName
    }) => (
      <FormGroup
        key={`form-group-${name}`}
        controlId={`fg-${name}`}
        validationState={errors[name] ? 'error' : null}
        >
        <Col xs={12}>
          <label>{name}</label>
          <Component
            {...{ [valuePropName]: formatedFilter[name] }}
            onChange={this.handleFormFilterUpdate(name)}
            onBlur={this.handleFormFilterBlur(name)}
            />
          {errors[name] && <HelpBlock>{errors[name].message}</HelpBlock>}
        </Col>
      </FormGroup>
    ));

    return (
      <Form horizontal={true} onSubmit={this.handleSubmit} className="clearfix">
        {searchableFieldsElement}
        <Col xs={12} className="text-right form-submit">
          <Button bsStyle='link' onClick={resetFormFilter}>Reset</Button>
          {' '}
          <Button onClick={this.handleCreate}>Create</Button>
          {' '}
          <Button bsStyle='primary' type='submit'>Search</Button>
        </Col>
      </Form>
    );
  }
}
