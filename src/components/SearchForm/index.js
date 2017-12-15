import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { Button, Form, FormGroup, ControlLabel } from 'react-bootstrap';
import { getModelMessage } from '../lib';
import FieldErrorLabel from '../FieldErrors/FieldErrorLabel';
import WithFieldErrors from '../FieldErrors/WithFieldErrorsHOC';
import {
  OPERATION_RESET,
  OPERATION_SEARCH
} from '../../crudeditor-lib/common/constants';
import './SearchForm.less';

class SearchForm extends React.Component {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.shape({
        formFilter: PropTypes.object,
        formattedFilter: PropTypes.object,
        searchableFields: PropTypes.array,
        resultFilter: PropTypes.object
      }),
      actions: PropTypes.objectOf(PropTypes.func),
      operations: PropTypes.shape({
        standard: PropTypes.func.isRequired
      })
    }).isRequired,
    toggledFieldErrors: PropTypes.object.isRequired,
    toggleFieldErrors: PropTypes.func.isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  handleSubmit = e => {
    e.preventDefault();

    const { standard } = this.props.model.operations;

    const searchOperation = standard({ filter: this.props.model.data.formFilter }).
      find(({ name }) => name === OPERATION_SEARCH);

    if (searchOperation) {
      searchOperation.handler()
    }
  }

  handleFormFilterUpdate = fieldName => newFieldValue => {
    this.props.toggleFieldErrors(false, fieldName);

    this.props.model.actions.updateFormFilter({
      name: fieldName,
      value: newFieldValue
    });
  }

  handleFormFilterBlur = fieldName => _ => this.props.toggleFieldErrors(true, fieldName);

  fieldErrors = name => name ?
    (this.props.toggledFieldErrors[name] || []) :
    !!Object.keys(this.props.toggledFieldErrors).length

  render() {
    const {
      model: {
        data: {
          formattedFilter,
          searchableFields,
          formFilter,
          resultFilter
        },
        operations: {
          standard
        }
      }
    } = this.props;

    const { i18n } = this.context;

    const buttons = [];

    const standardOperations = standard({});

    const resetOperation = standardOperations.find(({ name }) => name === OPERATION_RESET);

    if (resetOperation) {
      const { handler, disabled } = resetOperation;

      buttons.push(
        <Button
          bsStyle='link'
          key='reset'
          onClick={handler}
          disabled={!!disabled}
        >
          {i18n.getMessage('crudEditor.reset.button')}
        </Button>
      )
    }

    const searchOperation = standardOperations.find(({ name }) => name === OPERATION_SEARCH);

    if (searchOperation) {
      const { disabled } = searchOperation;

      buttons.push(
        <Button
          bsStyle='primary'
          type='submit'
          key='search'
          ref={ref => (this.submitBtn = ref)}
          disabled={isEqual(formFilter, resultFilter) || this.fieldErrors() || disabled}
        >
          {i18n.getMessage('crudEditor.search.button')}
        </Button>
      )
    }

    return (
      <Form horizontal={true} onSubmit={this.handleSubmit} className="clearfix crud--search-form">
        <div className="crud--search-form__controls">
          {
            searchableFields.map(({ name, component: Component, valuePropName }) => (
              <FormGroup
                key={`form-group-${name}`}
                controlId={`fg-${name}`}
                validationState={this.fieldErrors(name).length ? 'error' : null}
                className="crud--search-form__form-group"
              >
                <ControlLabel>{getModelMessage(i18n, `model.field.${name}`, name)}</ControlLabel>
                <Component
                  {...{ [valuePropName]: formattedFilter[name] }}
                  onChange={this.handleFormFilterUpdate(name)}
                  onBlur={this.handleFormFilterBlur(name)}
                />
                <FieldErrorLabel errors={this.fieldErrors(name)} fieldName={name}/>
              </FormGroup>
            ))
          }
        </div>
        <div className="crud--search-form__submit-group">
          {buttons}
        </div>
      </Form>
    );
  }
}

export default WithFieldErrors(SearchForm);
