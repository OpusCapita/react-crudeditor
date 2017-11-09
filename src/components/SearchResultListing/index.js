// TODO: add operations (external, custom, ...) handlers.

import React from 'react';
import PropTypes from 'prop-types';
import { Table, Glyphicon, Button, ButtonGroup, Checkbox } from 'react-bootstrap';
import { getFieldText } from '../lib';
import ConfirmDialog from '../ConfirmDialog';
import WithSpinner from '../Spinner/SpinnerOverlayHOC';
import './SearchResultListing.less';

class SearchResultListing extends React.PureComponent {
  constructor(...args) {
    super(...args);

    this.handleNewInstances(this.props.model.data.resultInstances);

    this.handleResort = fieldName => _ => this.props.model.actions.searchInstances({
      sort: fieldName,
      // XXX: sortField and sortOrder must be accessed with this.props.model.data for up to date values!
      order: fieldName === this.props.model.data.sortParams.field && this.props.model.data.sortParams.order === 'asc' ?
        'desc' :
        'asc'
    });
  }

  componentWillReceiveProps({
    model: {
      data: {
        resultInstances: instances
      }
    }
  }) {
    if (
      instances.length !== this.props.model.data.resultInstances.length ||
      this.props.model.data.resultInstances.some(instance => instances.indexOf(instance) === -1)
    ) {
      this.handleNewInstances(instances);
    }
  }

  handleNewInstances = instances => {
    this.handleToggleSelected = instance => ({
      target: {
        checked: selected
      }
    }) => this.props.model.actions.toggleSelected({ selected, instance });

    this.handleShow = (instance, index) => () => this.props.model.actions.showInstance({ instance, index });
    this.handleEdit = (instance, index) => () => this.props.model.actions.editInstance({ instance, index });
    this.handleDelete = instance => () => this.props.model.actions.deleteInstances([instance]);
  }

  handleToggleSelectedAll = ({ target: { checked } }) => this.props.model.actions.toggleSelectedAll(checked)

  render() {
    const {
      selectedInstances,
      resultInstances: instances,
      resultFields,
      sortParams: {
        field: sortField,
        order: sortOrder
      }
    } = this.props.model.data;

    const { i18n } = this.context;

    return (
      <div className="crud--search-result-listing__table-container">
        <Table condensed={true} className="crud--search-result-listing__table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedInstances.length === instances.length && instances.length !== 0}
                  onChange={this.handleToggleSelectedAll}
                />
              </th>

              {resultFields.map(({ name, sortable }) =>
                (<th key={`th-${name}`}>
                  {
                    sortable ?
                      <a
                        className="crud--search-result-listing__sort-button"
                        style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                        onClick={this.handleResort(name)}
                      >
                        {getFieldText(i18n, name)}
                        {
                          sortField === name &&
                          <Glyphicon
                            className="crud--search-result-listing__sort-icon"
                            glyph={`arrow-${sortOrder === 'asc' ? 'down' : 'up'}`}
                          />
                        }
                      </a> :
                      getFieldText(i18n, name)
                  }
                </th>)
              )}

              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>

            {instances.map((instance, index) =>
              (<tr key={`tr-${JSON.stringify(instance)}`}>
                <td>
                  <Checkbox
                    checked={!!~selectedInstances.indexOf(instance)}
                    onChange={this.handleToggleSelected(instance)}
                  />
                </td>
                {resultFields.map(({ name, Component, textAlignment }) =>
                  (<td
                    key={`td-${name}`}
                    className={
                      textAlignment === 'right' && 'text-right' ||
                      textAlignment === 'center' && 'text-center' ||
                      'text-left'
                    }
                  >
                    {
                      Component ?
                        <Component name={name} instance={instance} /> :
                        instance[name]
                    }
                  </td>)
                )}

                <td className="text-right">
                  <ButtonGroup bsSize="sm" className="crud--search-result-listing__action-buttons">
                    <Button onClick={this.handleShow(instance, index)}>
                      <Glyphicon glyph='glyphicon-eye-open' />
                      {' '}
                      {i18n.getMessage('crudEditor.show.button')}
                    </Button>

                    <Button onClick={this.handleEdit(instance, index)}>
                      <Glyphicon glyph='edit' />
                      {' '}
                      {i18n.getMessage('crudEditor.edit.button')}
                    </Button>

                    <ConfirmDialog
                      trigger='click'
                      onConfirm={this.handleDelete(instance)}
                      title='Delete confirmation'
                      message={i18n.getMessage('crudEditor.delete.confirmation')}
                      textConfirm={i18n.getMessage('crudEditor.delete.button')}
                      textCancel={i18n.getMessage('crudEditor.cancel.button')}
                    >
                      <Button>
                        <Glyphicon glyph='trash' />
                        {' '}
                        {i18n.getMessage('crudEditor.delete.button')}
                      </Button>
                    </ConfirmDialog>
                  </ButtonGroup>
                </td>
              </tr>)
            )}

          </tbody>
        </Table>
      </div>
    );
  }
}

SearchResultListing.propTypes = {
  model: PropTypes.shape({
    data: PropTypes.shape({
      resultInstances: PropTypes.array,
      selectedInstances: PropTypes.array,
      resultFields: PropTypes.array,
      sortParams: PropTypes.object,
      isLoading: PropTypes.bool
    }),
    actions: PropTypes.objectOf(PropTypes.func)
  }).isRequired
}

SearchResultListing.contextTypes = {
  i18n: PropTypes.object
};

export default WithSpinner(SearchResultListing);
