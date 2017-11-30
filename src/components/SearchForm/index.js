import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { Button, Form, FormGroup } from 'react-bootstrap';
import { getModelMessage } from '../lib';
import FieldErrorLabel from '../FieldErrors/FieldErrorLabel';
import WithFieldErrors from '../FieldErrors/WithFieldErrorsHOC';
import RangeInput from '../RangeInput';
import './SearchForm.less';

class SearchForm extends React.Component {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.shape({
        formFilter: PropTypes.object,
        fieldErrors: PropTypes.object
      }),
      actions: PropTypes.objectOf(PropTypes.func)
    }).isRequired,
    fieldErrorsWrapper: PropTypes.shape({
      toggleFieldErrors: PropTypes.func,
      shouldShowErrors: PropTypes.func,
      errorsExistAndVisible: PropTypes.bool
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.model.actions.searchInstances({
      filter: this.props.model.data.formFilter
    });
  }

  render() {
    const {
      model: {
        data: {
          formatedFilter,
          searchableFields,
          formFilter,
          resultFilter
        },
        actions: {
          resetFormFilter
        }
      },
      // fieldErrorsWrapper comes from WithFieldErrors HOC
      fieldErrorsWrapper: {
        handleFormFilterBlur,
        handleFormFilterUpdate,
        fieldErrors
      }
    } = this.props;

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
          validationState={fieldErrors([name, 'from']).length ? 'error' : null}
          className="crud--search-form__form-group"
        >
          <div>
            <label>{
              getModelMessage(i18n, `model.field.${name}`, name) +
              ' (' + i18n.getMessage('crudEditor.range.from') + ')'
            }</label>
            <Component
              {...{ [valuePropName]: formatedFilter[name].from }}
              onChange={handleFormFilterUpdate([name, 'from'])}
              onBlur={handleFormFilterBlur([name, 'from'])}
            />
            <FieldErrorLabel errors={fieldErrors([name, 'from'])}/>
          </div>
        </FormGroup>
        <FormGroup
          key={`form-group-${name}-to`}
          controlId={`fg-${name}-to`}
          validationState={fieldErrors([name, 'to']).length ? 'error' : null}
          className="crud--search-form__form-group"
        >
          <div>
            <label>{
              getModelMessage(i18n, `model.field.${name}`, name) +
              ' (' + i18n.getMessage('crudEditor.range.to') + ')'
            }</label>
            <Component
              {...{ [valuePropName]: formatedFilter[name].to }}
              onChange={handleFormFilterUpdate([name, 'to'])}
              onBlur={handleFormFilterBlur([name, 'to'])}
            />
            <FieldErrorLabel errors={fieldErrors([name, 'to'])}/>
          </div>
        </FormGroup>
      </div> :
      <FormGroup
        key={`form-group-${name}`}
        controlId={`fg-${name}`}
        validationState={fieldErrors(name).length ? 'error' : null}
        className="crud--search-form__form-group"
      >
        <div>
          <label>{getModelMessage(i18n, `model.field.${name}`, name)}</label>
          <Component
            {...{ [valuePropName]: formatedFilter[name] }}
            onChange={handleFormFilterUpdate(name)}
            onBlur={handleFormFilterBlur(name)}
          />
          <FieldErrorLabel errors={fieldErrors(name)}/>
        </div>
      </FormGroup>
    );

    return (
      <Form horizontal={true} onSubmit={this.handleSubmit} className="clearfix crud--search-form">
        <div className="crud--search-form__controls">
        <FormGroup className="crud--search-form__form-group">
          <div>
            <label>Range Input</label>
            <RangeInput />
          </div>
        </FormGroup>
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
            disabled={ isEqual(formFilter, resultFilter) || fieldErrors() }
          >
            {i18n.getMessage('crudEditor.search.button')}
          </Button>
        </div>
      </Form>
    );
  }
}

export default WithFieldErrors(SearchForm);
