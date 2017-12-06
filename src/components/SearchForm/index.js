import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { Button, Form, FormGroup, ControlLabel } from 'react-bootstrap';
import { getModelMessage } from '../lib';
import FieldErrorLabel from '../FieldErrors/FieldErrorLabel';
import WithFieldErrors from '../FieldErrors/WithFieldErrorsHOC';
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
          formattedFilter,
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

    return (
      <Form horizontal={true} onSubmit={this.handleSubmit} className="clearfix crud--search-form">
        <div className="crud--search-form__controls">
          {
            searchableFields.map(({ name, Component, valuePropName }) => (
              <FormGroup
                key={`form-group-${name}`}
                controlId={`fg-${name}`}
                validationState={fieldErrors(name).length ? 'error' : null}
                className="crud--search-form__form-group"
              >
                <ControlLabel>{getModelMessage(i18n, `model.field.${name}`, name)}</ControlLabel>
                <Component
                  {...{ [valuePropName]: formattedFilter[name] }}
                  onChange={handleFormFilterUpdate(name)}
                  onBlur={handleFormFilterBlur(name)}
                />
                <FieldErrorLabel errors={fieldErrors(name)} />
              </FormGroup>
            ))
          }
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
            disabled={isEqual(formFilter, resultFilter) || fieldErrors()}
          >
            {i18n.getMessage('crudEditor.search.button')}
          </Button>
        </div>
      </Form>
    );
  }
}

export default WithFieldErrors(SearchForm);
