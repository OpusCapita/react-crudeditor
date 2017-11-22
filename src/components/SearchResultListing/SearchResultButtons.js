import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Glyphicon, Button, ButtonGroup } from 'react-bootstrap';
import ConfirmDialog from '../ConfirmDialog';

export default class SearchResultButtons extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.shape({
        permissions: PropTypes.shape({
          crudOperations: PropTypes.object.isRequired
        })
      })
    }),
    instance: PropTypes.object,
    index: PropTypes.number,
    onShow: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  }

  render() {
    const permissions = this.props.model.data.permissions.crudOperations;
    const { onShow, onEdit, onDelete } = this.props;
    const { i18n } = this.context;

    const buttons = [];

    if (permissions.view && !permissions.edit) {
      buttons.push(
        <Button onClick={onShow} key="show">
          <Glyphicon glyph='glyphicon-eye-open' />
          {' '}
          {i18n.getMessage('crudEditor.show.button')}
        </Button>
      )
    }

    if (permissions.edit) {
      buttons.push(
        <Button onClick={onEdit} key="edit">
          <Glyphicon glyph='edit' />
          {' '}
          {i18n.getMessage('crudEditor.edit.button')}
        </Button>
      )
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
