// TODO: add operations (external, custom, ...) handlers.

import React from 'react';
import { Table, Glyphicon, Button, ButtonGroup, Checkbox } from 'react-bootstrap';

import ConfirmDialog from '../ConfirmDialog';
import './SearchResultListing.less';

export default class extends React.PureComponent {
  handleNewInstances = instances => {
    this.handleToggleSelected = instance => ({
      target: {
        checked: selected
      }
    }) => this.props.model.actions.toggleSelected({ selected, instance });

    this.handleEdit = instance => () => this.props.model.actions.editInstance({ instance });
    this.handleDelete = instance => () => this.props.model.actions.deleteInstances([instance]);
  }

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
      this.props.model.data.resultInstances.some(instance => !instances.includes(instance))
    ) {
      this.handleNewInstances(instances);
    }
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

    console.log('model:', this.props.model);

    return (
      <div className="crud--search-result-listing">
        <Table responsive={true} condensed={true} className="crud--search-result-listing__table">
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
                 <th key={`th-${name}`}>
                  {
                    sortable ?
                      <Button className="crud--search-result-listing__sort-button" bsStyle='link' onClick={this.handleResort(name)}>
                        { name }
                        { sortField === name && <Glyphicon className="crud--search-result-listing__sort-icon" glyph={`arrow-${sortOrder === 'asc' ? 'down' : 'up'}`} /> }
                      </Button> :
                      name
                  }
                </th>
              )}

              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>

          {instances.map(instance =>
            <tr key={`tr-${JSON.stringify(instance)}`}>
              <td>
                <Checkbox checked={selectedInstances.includes(instance)} onChange={this.handleToggleSelected(instance)} />
              </td>
                {resultFields.map(({ name, Component, textAlignment }) =>
                <td
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
                </td>
              )}

              <td className="text-right">
                <ButtonGroup bsSize="sm" className="crud--search-result-listing__action-buttons">
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
            </tr>
          )}

          </tbody>
        </Table>
      </div>
    );
  }
}
