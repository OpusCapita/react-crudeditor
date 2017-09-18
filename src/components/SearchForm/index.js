import React from 'react';
import ReactDOM from 'react-dom';
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
    ReactDOM.findDOMNode(this.submitBtn).focus();  // since this.submitBtn.focus(); does not work

    // When pressing ENTER in form input,
    // allow input.onBlur() event to be handled before searchInstances() call:
    window.setTimeout(() => this.props.model.actions.searchInstances({
      filter: this.props.model.data.formFilter
    }));
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

    return (
      <Form horizontal={true} onSubmit={this.handleSubmit}>
        {searchableFields.map(({
          name,
          Component,
          valuePropName
        }) =>
          <FormGroup key={`form-group-${name}`} controlId={`fg-${name}`} validationState={errors[name] ? 'error' : null}>
            <Col componentClass={ControlLabel} sm={2}>
              {name}
            </Col>
            <Col sm={10}>
              <Component
                {...{ [valuePropName]: formatedFilter[name] }}
                onChange={this.handleFormFilterUpdate(name)}
                onBlur={this.handleFormFilterBlur(name)}
              />
              {errors[name] && <HelpBlock>{errors[name].message}</HelpBlock>}
            </Col>
          </FormGroup>
        )}
        <FormGroup>
          <Col smOffset={2} sm={10}>
            <Button bsStyle='link' onClick={resetFormFilter}>Reset</Button>
            {' '}
            <Button onClick={this.handleCreate}>Create</Button>
            {' '}
            <Button ref={btn => {this.submitBtn = btn;}} bsStyle='primary' type='submit'>Search</Button>
          </Col>
        </FormGroup>
      </Form>
    );
  }
}
