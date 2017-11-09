import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { Button, Form, FormGroup } from 'react-bootstrap';
import { getFieldText } from '../lib';
import FieldErrorLabel from '../FieldErrors/FieldErrorLabel';
import WithFieldErrors from '../FieldErrors/WithFieldErrorsHOC';
import './SearchForm.less';

class SearchForm extends React.Component {
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
            <label>{getFieldText(i18n, name) + ' (' + i18n.getMessage('crudEditor.dateRange.from') + ')'}</label>
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
            <label>{getFieldText(i18n, name) + ' (' + i18n.getMessage('crudEditor.dateRange.to') + ')'}</label>
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
          <label>{getFieldText(i18n, name)}</label>
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

SearchForm.propTypes = {
  model: PropTypes.shape({
    data: PropTypes.shape({
      formFilter: PropTypes.object
    }),
    actions: PropTypes.objectOf(PropTypes.func)
  }).isRequired,
  fieldErrorsWrapper: PropTypes.shape({
    handleFormFilterBlur: PropTypes.func,
    handleFormFilterUpdate: PropTypes.func,
    fieldErrors: PropTypes.func
  }).isRequired
}

SearchForm.contextTypes = {
  i18n: PropTypes.object
};

export default WithFieldErrors(SearchForm);
