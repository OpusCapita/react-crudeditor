// TODO: add operations (external, custom, ...) handlers.

import React from 'react';
import { Table, Glyphicon, Button, ButtonGroup, Checkbox } from 'react-bootstrap';

import ConfirmDialog from '../ConfirmDialog';

export default class extends React.PureComponent {
  handleNewInstances = instances => {
    this.handleToggleSelected = new WeakMap(instances.map(instance => [
      instance,
      ({ target: { checked } }) => this.props.model.actions.toggleSelected(checked, instance)
    ]));

    this.handleEdit = new WeakMap(instances.map(instance => [
      instance,
      _ => this.props.model.actions.editInstance({ instance: this.props.model.data.logicalIdBuilder(instance) })
    ]));

    this.handleDelete = new WeakMap(instances.map(instance => [
      instance,
      _ => this.props.model.actions.deleteInstances([instance])
    ]));
  }

  constructor(...args) {
    super(...args);

    this.handleNewInstances(this.props.model.data.resultInstances);

    this.handleResort = this.props.model.data.resultFields.reduce((rez, { name }) => ({
      ...rez,
      [name]: _ => this.props.model.actions.searchInstances({
        sort: name,
        // XXX: sortField and sortOrder must be accessed with this.props.model.data for up to date values!
        order: name === this.props.model.data.sortParams.field && this.props.model.data.sortParams.order === 'asc' ?
          'desc' :
          'asc'
      })
    }), {});
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
      },
      logicalIdBuilder
    } = this.props.model.data;

    return (
      <Table responsive={true} condensed={true}>
        <thead>
          <tr>
            <th>
              <Checkbox
                checked={selectedInstances.length === instances.length && instances.length !== 0}
                onChange={this.handleToggleSelectedAll}
              />
            </th>

            {resultFields.map(({ name, sortable }) =>
              <th key={`th-${name}`}>
                {
                  sortable ?
                    <Button bsStyle='link' onClick={this.handleResort[name]}>
                      { name }
                      { sortField === name && <Glyphicon glyph={`arrow-${sortOrder === 'asc' ? 'down' : 'up'}`} /> }
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
          <tr key={`tr-${JSON.stringify(logicalIdBuilder(instance))}`}>
            <td>
              <Checkbox checked={selectedInstances.includes(instance)} onChange={this.handleToggleSelected.get(instance)} />
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

            <td className='text-right'>
              <ButtonGroup bsSize='sm'>
                <Button onClick={this.handleEdit.get(instance)}>
                  <Glyphicon glyph='edit' />
                  {' '}
                  Edit
                </Button>

                <ConfirmDialog
                  trigger='click'
                  onConfirm={this.handleDelete.get(instance)}
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
    );
  }
}
