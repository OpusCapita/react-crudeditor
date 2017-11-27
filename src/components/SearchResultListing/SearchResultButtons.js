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
    onDelete: PropTypes.func,
    index: PropTypes.number
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
      operations,
      index
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
      const { name, icon, handler } = operations[0];
      const uid = `ops-split-${name}-${index}`;
      buttons.push(
        <SplitButton
          title={
            <span>
              {icon && <Glyphicon glyph={icon}/>}
              {icon && ' '}
              {getModelMessage(i18n, `model.label.${name}`, name)}
            </span>
          }
          id={uid}
          key={uid}
          onClick={handler}
          bsSize="sm"
        >
          {
            operations.slice(1).map(({ name, icon, handler }, index) => (
              <MenuItem
                key={index}
                eventKey={index}
                onClick={handler}
              >
                <span className="btn-sm text-left">
                  {icon && <Glyphicon glyph={icon}/>}
                  {icon && ' '}
                  {getModelMessage(i18n, `model.label.${name}`, name)}
                </span>
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
