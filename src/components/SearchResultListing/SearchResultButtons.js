import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Glyphicon,
  Button,
  ButtonGroup,
  SplitButton,
  MenuItem
} from 'react-bootstrap';
import ConfirmDialog from '../ConfirmDialog';
import { getModelMessage } from '../lib';

export default class SearchResultButtons extends PureComponent {
  static propTypes = {
    permissions: PropTypes.object.isRequired,
    operations: PropTypes.array.isRequired,
    onShow: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  }

  render() {
    const {
      onShow,
      onEdit,
      onDelete,
      permissions,
      operations
    } = this.props;

    const { i18n } = this.context;

    const buttons = [];

    if (permissions.edit) {
      buttons.push(
        <Button onClick={onEdit} key="edit">
          <Glyphicon glyph='edit' />
          {' '}
          {i18n.getMessage('crudEditor.edit.button')}
        </Button>
      )
    } else if (permissions.view) {
      buttons.push(
        <Button onClick={onShow} key="show">
          <Glyphicon glyph='glyphicon-eye-open' />
          {' '}
          {i18n.getMessage('crudEditor.show.button')}
        </Button>
      )
    }

    // FIXME: check whether there are unsaved changes before calling operation handler.

    // FIXME: remove Glyphicon if no operation.icon and correct getMessage() argument
    if (operations.length === 1) {
      const { name, icon, handler } = operations[0];

      buttons.push(
        <Button onClick={handler} key="operation">
          {icon && <Glyphicon glyph={icon}/>}
          {icon && ' '}
          {getModelMessage(i18n, `model.label.${name}`, name)}
        </Button>
      );
    } else if (operations.length > 1) {
      // FIXME: set correct unique id.
      // FIXME: figure out whether onClick/onSelect for SplitButton/MenuItem must be used.
      // FIXME: figure out whether eventKey should be used.
      // FIXME: add Glyphicon if operation.icon and correct getMessage() argument.

      buttons.push(
        <SplitButton
          title={getModelMessage(i18n, `model.label.${operations[0].name}`, operations[0].name)}
          pullRight={true}
          id={`operations-split-${operations[0].name}`}
          key={`operations-split-${operations[0].name}`}
          onClick={operations[0].handler}
          bsSize="sm"
        >
          {
            operations.slice(1).map((operation, index) => (
              <MenuItem
                key={index}
                onClick={operation.handler}
              >
                {operation.icon && <Glyphicon glyph={operation.icon}/>}
                {operation.icon && ' '}
                {getModelMessage(i18n, `model.label.${operation.name}`, operation.name)}
              </MenuItem>
            ))
          }
        </SplitButton>
      );
    }

    if (permissions.delete) {
      buttons.push(
        <ConfirmDialog
          trigger='click'
          onConfirm={onDelete}
          title='Delete confirmation'
          message={i18n.getMessage('crudEditor.delete.confirmation')}
          textConfirm={i18n.getMessage('crudEditor.delete.button')}
          textCancel={i18n.getMessage('crudEditor.cancel.button')}
          key="delete"
        >
          <Button>
            <Glyphicon glyph='trash' />
            {' '}
            {i18n.getMessage('crudEditor.delete.button')}
          </Button>
        </ConfirmDialog>
      )
    }

    return buttons.length > 0 && (
      <ButtonGroup bsSize="sm" className="crud--search-result-listing__action-buttons">
        {buttons}
      </ButtonGroup>
    );
  }
}
