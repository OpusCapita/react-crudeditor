import React from 'react';
import { Button, Form, FormGroup, HelpBlock } from 'react-bootstrap';

import './SearchForm.less';

export default class extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.handleFormFilterUpdate = path => newFieldValue => this.props.model.actions.updateFormFilter({
      path,
      value: newFieldValue
    });
  }

  handleFormFilterBlur = path => _ => this.props.model.actions.parseFormFilter(path);

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
        searchableFields
      },
      actions: {
        resetFormFilter
      }
    } = this.props.model;

    const searchableFieldsElement = searchableFields.map(({
      name,
      isRange,
      Component,
      valuePropName
    }) => isRange ?
      <div key={`div-form-group-${name}`}>
        <FormGroup
          key={`form-group-${name}-from`}
          controlId={`fg-${name}-from`}
          validationState={errors[name] && errors[name].from ? 'error' : null}
          className="crud--search-form__form-group"
        >
          <div>
            <label>{name + ' (from)'}</label>
            <Component
              {...{ [valuePropName]: formatedFilter[name].from }}
              onChange={this.handleFormFilterUpdate([name, 'from'])}
              onBlur={this.handleFormFilterBlur([name, 'from'])}
            />
            {errors[name] && errors[name].from && <HelpBlock>{errors[name].from.message}</HelpBlock>}
          </div>
        </FormGroup>
        <FormGroup
          key={`form-group-${name}-to`}
          controlId={`fg-${name}-to`}
          validationState={errors[name] && errors[name].to ? 'error' : null}
          className="crud--search-form__form-group"
        >
          <div>
            <label>{name + ' (to)'}</label>
            <Component
              {...{ [valuePropName]: formatedFilter[name].to }}
              onChange={this.handleFormFilterUpdate([name, 'to'])}
              onBlur={this.handleFormFilterBlur([name, 'to'])}
            />
            {errors[name] && errors[name].to && <HelpBlock>{errors[name].to.message}</HelpBlock>}
          </div>
        </FormGroup>
      </div> :
      <FormGroup
        key={`form-group-${name}`}
        controlId={`fg-${name}`}
        validationState={errors[name] ? 'error' : null}
        className="crud--search-form__form-group"
      >
        <div>
          <label>{name}</label>
          <Component
            {...{ [valuePropName]: formatedFilter[name] }}
            onChange={this.handleFormFilterUpdate(name)}
            onBlur={this.handleFormFilterBlur(name)}
          />
          {errors[name] && <HelpBlock>{errors[name].message}</HelpBlock>}
        </div>
      </FormGroup>
    );

    return (
      <Form horizontal={true} onSubmit={this.handleSubmit} className="clearfix crud--search-form">
        <div className="crud--search-form__header">
          <h4 className="crud--search-form__title">Search</h4>
        </div>
        <div className="crud--search-form__controls">
          {searchableFieldsElement}
        </div>
        <div className="crud--search-form__submit-group">
          <Button
            bsStyle='link'
            onClick={resetFormFilter}
          >
            Reset
          </Button>
          <Button
            bsStyle="primary"
            type="submit"
            ref={ref => (this.submitBtn = ref)}
          >
            Search
          </Button>
        </div>
      </Form>
    );
  }
}
