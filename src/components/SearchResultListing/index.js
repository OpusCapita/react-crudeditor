// TODO: add operations (external, custom, ...) handlers.

import React from 'react';
import PropTypes from 'prop-types';
import { Table, Glyphicon, Button, ButtonGroup, Checkbox } from 'react-bootstrap';

import ConfirmDialog from '../ConfirmDialog';
import SpinnerOverlay from '../Spinner/SpinnerOverlay';
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
      // TBD instances.length !== instances.length ?
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

    this.handleShow = instance => () => this.props.model.actions.showInstance({ instance });
    this.handleEdit = instance => () => this.props.model.actions.editInstance({ instance });
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
      },
      isLoading
    } = this.props.model.data;

    const spinnerElement = isLoading ? (<SpinnerOverlay />) : null;

    return (
      <div className={`crud--search-result-listing`}>
        {spinnerElement}
        <div
          className={`
            crud--search-result-listing__table-container
            ${isLoading ? 'crud--search-result-listing__table-container--with-spinner' : ''}
          `}
        >
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
                        <Button
                          className="crud--search-result-listing__sort-button"
                          bsStyle='link'
                          onClick={this.handleResort(name)}
                        >
                          {name}
                          {
                            sortField === name &&
                            <Glyphicon
                              className="crud--search-result-listing__sort-icon"
                              glyph={`arrow-${sortOrder === 'asc' ? 'down' : 'up'}`}
                            />
                          }
                        </Button> :
                        name
                    }
                  </th>)
                )}

                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>

              {instances.map(instance =>
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
                      <Button onClick={this.handleShow(instance)}>
                        <Glyphicon glyph='glyphicon-eye-open' />
                        {' '}
                        Show
                      </Button>

                      <Button onClick={this.handleEdit(instance)}>
                        <Glyphicon glyph='edit' />
                        {' '}
                        Edit
                      </Button>

                      <ConfirmDialog
                        trigger='click'
                        onConfirm={this.handleDelete(instance)}
                        title='Delete confirmation'
                        message='Do you want to delete this item?'
                      >
                        <Button>
                          <Glyphicon glyph='trash' />
                          {' '}
                          Delete
                        </Button>
                      </ConfirmDialog>
                    </ButtonGroup>
                  </td>
                </tr>)
              )}

            </tbody>
          </Table>
        </div>
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

export default SearchResultListing;
