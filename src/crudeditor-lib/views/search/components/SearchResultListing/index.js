// TODO: add operations (external, custom, ...) handlers.

import React, { PureComponent } from 'react';
import { Table, Glyphicon, Button, ButtonGroup, Checkbox } from 'react-bootstrap';

import connect from '../../../../connect';
import ConfirmDialog from '../ConfirmDialog';

import {
  getSortField,
  getSortOrder,
  getResultInstances,
  getSelectedInstances,
  getResultFields,
  getIdField
} from '../../selectors';

import {
  deleteInstances,
  searchInstances,
  toggleSelected,
  toggleSelectedAll
} from '../../actions';

import { actions as editActions } from '../../../edit';

const { editInstance } = editActions;

@connect({
  sortField: getSortField,
  sortOrder: getSortOrder,
  instances: getResultInstances,
  selectedInstances: getSelectedInstances,
  fields: getResultFields,
  idFieldName: getIdField
}, {
  editInstance,
  deleteInstances,
  toggleSelected,
  toggleSelectedAll,
  searchInstances
})
export default class extends PureComponent {
  getInstanceId = instance => instance[this.props.idFieldName]

  handleNewInstances = instances => {
    this.handleToggleSelected = new WeakMap(instances.map(instance => [
      instance,
      ({ target: { checked } }) => this.props.toggleSelected(checked, instance)
    ]));

    this.handleEdit = new WeakMap(instances.map(instance => [
      instance,
      _ => this.props.editInstance({ id: this.getInstanceId(instance) })
    ]));

    this.handleDelete = new WeakMap(instances.map(instance => [
      instance,
      _ => this.props.deleteInstances([instance])
    ]));
  }

  constructor(...args) {
    super(...args);

    this.handleNewInstances(this.props.instances);

    this.handleResort = this.props.fields.reduce((rez, { name }) => ({
      ...rez,
      [name]: _ => this.props.searchInstances({
        sort: name,
        // XXX: sortField and sortOrder must be accessed with this.props for up to date values!
        order: name === this.props.sortField && this.props.sortOrder === 'asc' ?
          'desc' :
          'asc'
      })
    }), {});
  }

  componentWillReceiveProps({ instances }) {
    if (
      instances.length !== this.props.instances.length ||
      this.props.instances.some(instance => !instances.includes(instance))
    ) {
      this.handleNewInstances(instances);
    }
  }

  handleToggleSelectedAll = ({ target: { checked } }) => this.props.toggleSelectedAll(checked)

  render() {
    const { selectedInstances, instances, fields, sortField, sortOrder } = this.props;

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

            {fields.map(({ name, sortable }) =>
              <th key={`th-${name}`}>
                {
                  sortable ?
                    <Button bsStyle='link' onClick={this.handleResort[name]}>
                      { name }
                      {
                        sortField === name ?
                          <Glyphicon glyph={`arrow-${sortOrder === 'asc' ? 'down' : 'up'}`} /> :
                          null
                      }
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
          <tr key={`tr-${this.getInstanceId(instance)}`}>
            <td>
              <Checkbox checked={selectedInstances.includes(instance)} onChange={this.handleToggleSelected.get(instance)} />
            </td>

            {fields.map(({ name, Component, textAlignment }) =>
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
