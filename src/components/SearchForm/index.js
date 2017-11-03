import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup } from 'react-bootstrap';
import { getFieldText } from '../lib';
import FieldErrorLabel from '../FieldErrors/FieldErrorLabel';
import WithFieldErrors from '../FieldErrors/WithFieldErrorsHOC';
import './SearchForm.less';

class SearchForm extends React.Component {
  handleFormFilterUpdate = path => newFieldValue => {
    this.props.fieldErrorsWrapper.toggleFieldErrors(path, false);

    this.props.model.actions.updateFormFilter({
      path,
      value: newFieldValue
    });
  }

  handleFormFilterBlur = path => _ => this.props.fieldErrorsWrapper.toggleFieldErrors(path, true);

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
          fieldErrors: errors,
          formatedFilter,
          searchableFields,
          searchFormChanged
        },
        actions: {
          resetFormFilter
        }
      },
      // fieldErrorsWrapper comes from WithFieldErrors HOC
      fieldErrorsWrapper: {
        shouldShowErrors,
        errorsExistAndVisible
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
          validationState={shouldShowErrors([name, 'from']) ? 'error' : null} // TBD maybe show only onBlur?
          className="crud--search-form__form-group"
        >
          <div>
            <label>{getFieldText(i18n, name) + ' (' + i18n.getMessage('crudEditor.dateRange.from') + ')'}</label>
            <Component
              {...{ [valuePropName]: formatedFilter[name].from }}
              onChange={this.handleFormFilterUpdate([name, 'from'])}
              onBlur={this.handleFormFilterBlur([name, 'from'])}
            />
            <FieldErrorLabel
              errors={shouldShowErrors([name, 'from']) ? errors[name].from : []}
              show={shouldShowErrors([name, 'from'])}
            />
          </div>
        </FormGroup>
        <FormGroup
          key={`form-group-${name}-to`}
          controlId={`fg-${name}-to`}
          validationState={shouldShowErrors([name, 'to']) ? 'error' : null}
          className="crud--search-form__form-group"
        >
          <div>
            <label>{getFieldText(i18n, name) + ' (' + i18n.getMessage('crudEditor.dateRange.to') + ')'}</label>
            <Component
              {...{ [valuePropName]: formatedFilter[name].to }}
              onChange={this.handleFormFilterUpdate([name, 'to'])}
              onBlur={this.handleFormFilterBlur([name, 'to'])}
            />
            <FieldErrorLabel
              errors={shouldShowErrors([name, 'to']) ? errors[name].to : []}
              show={shouldShowErrors([name, 'to'])}
            />
          </div>
        </FormGroup>
      </div> :
      <FormGroup
        key={`form-group-${name}`}
        controlId={`fg-${name}`}
        validationState={shouldShowErrors(name) ? 'error' : null}
        className="crud--search-form__form-group"
      >
        <div>
          <label>{getFieldText(i18n, name)}</label>
          <Component
            {...{ [valuePropName]: formatedFilter[name] }}
            onChange={this.handleFormFilterUpdate(name)}
            onBlur={this.handleFormFilterBlur(name)}
          />
          <FieldErrorLabel
            errors={shouldShowErrors(name) ? errors[name] : []}
            show={shouldShowErrors(name)}
          />
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
            disabled={ !searchFormChanged || errorsExistAndVisible }
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
  }).isRequired,
  fieldErrorsWrapper: PropTypes.shape({
    toggleFieldErrors: PropTypes.func,
    shouldShowErrors: PropTypes.func,
    errorsExistAndVisible: PropTypes.bool
  }).isRequired
}

SearchForm.contextTypes = {
  i18n: PropTypes.object
};

export default WithFieldErrors(SearchForm);
