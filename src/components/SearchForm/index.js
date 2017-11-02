import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Label } from 'react-bootstrap';
import { getFieldText } from '../lib';
import './SearchForm.less';

const errMsgs = errs => errs.
  map(({ message }) => message).
  map(err => <Label bsStyle="danger" key={err}>{err}</Label>);

class SearchForm extends React.Component {
  state = {
    showFieldErrors: {}
  }

  showFieldErrors = (path, show) => this.setState(prevState => ({
    showFieldErrors: {
      ...prevState.showFieldErrors,
      ...(Array.isArray(path) ? { [`${path[0]}_${path[1]}`]: show } : { [path]: show })
    }
  }));

  shouldShowErrors = path => Array.isArray(path) ? (
    this.state.showFieldErrors[`${path[0]}_${path[1]}`] &&
    this.props.model.data.fieldErrors[path[0]] && this.props.model.data.fieldErrors[path[0]][path[1]]
  ) :
    this.state.showFieldErrors[path] && this.props.model.data.fieldErrors[path]


  handleFormFilterUpdate = path => newFieldValue => {
    this.showFieldErrors(path, false);

    this.props.model.actions.updateFormFilter({
      path,
      value: newFieldValue
    });
  }

  handleFormFilterBlur = path => _ => this.showFieldErrors(path, true);

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
        searchableFields,
        searchFormChanged
      },
      actions: {
        resetFormFilter
      }
    } = this.props.model;

    const { i18n } = this.context;

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
          validationState={errors[name] && errors[name].from ? 'error' : null} // TBD maybe show only onBlur?
          className="crud--search-form__form-group"
        >
          <div>
            <label>{getFieldText(i18n, name) + ' (' + i18n.getMessage('crudEditor.dateRange.from') + ')'}</label>
            <Component
              {...{ [valuePropName]: formatedFilter[name].from }}
              onChange={this.handleFormFilterUpdate([name, 'from'])}
              onBlur={this.handleFormFilterBlur([name, 'from'])}
            />
            {this.shouldShowErrors([name, 'from']) && errMsgs(errors[name].from)}
          </div>
        </FormGroup>
        <FormGroup
          key={`form-group-${name}-to`}
          controlId={`fg-${name}-to`}
          validationState={errors[name] && errors[name].to ? 'error' : null}
          className="crud--search-form__form-group"
        >
          <div>
            <label>{getFieldText(i18n, name) + ' (' + i18n.getMessage('crudEditor.dateRange.to') + ')'}</label>
            <Component
              {...{ [valuePropName]: formatedFilter[name].to }}
              onChange={this.handleFormFilterUpdate([name, 'to'])}
              onBlur={this.handleFormFilterBlur([name, 'to'])}
            />
            {this.shouldShowErrors([name, 'to']) && errMsgs(errors[name].to)}
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
          <label>{getFieldText(i18n, name)}</label>
          <Component
            {...{ [valuePropName]: formatedFilter[name] }}
            onChange={this.handleFormFilterUpdate(name)}
            onBlur={this.handleFormFilterBlur(name)}
          />
          {this.shouldShowErrors(name) && <Label bsStyle="danger">{errors[name].message}</Label>}
        </div>
      </FormGroup>
    );

    return (
      <Form horizontal={true} onSubmit={this.handleSubmit} className="clearfix crud--search-form">
        <div className="crud--search-form__controls">
          {searchableFieldsElement}
        </div>
        <div className="crud--search-form__submit-group">
          <Button
            bsStyle='link'
            onClick={resetFormFilter}
          >
            {i18n.getMessage('crudEditor.reset.button')}
          </Button>
          <Button
            bsStyle="primary"
            type="submit"
            ref={ref => (this.submitBtn = ref)}
            disabled={
              !searchFormChanged ||
              !!Object.keys(this.state.showFieldErrors).
                filter(key => this.state.showFieldErrors[key]).length
            }
          >
            {i18n.getMessage('crudEditor.search.button')}
          </Button>
        </div>
      </Form>
    );
  }
}

SearchForm.propTypes = {
  model: PropTypes.shape({
    data: PropTypes.shape({
      formFilter: PropTypes.object,
      fieldErrors: PropTypes.object
    }),
    actions: PropTypes.objectOf(PropTypes.func)
  }).isRequired
}

SearchForm.contextTypes = {
  i18n: PropTypes.object
};

export default SearchForm;
