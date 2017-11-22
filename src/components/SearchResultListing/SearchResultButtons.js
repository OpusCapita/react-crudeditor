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
    const {
      instance,
      index,
      onShow,
      onEdit,
      onDelete
    } = this.props;
    const { i18n } = this.context;

    const showButton = permissions.view && !permissions.edit ?
      (<Button onClick={onShow(instance, index)}>
        <Glyphicon glyph='glyphicon-eye-open' />
        {' '}
        {i18n.getMessage('crudEditor.show.button')}
      </Button>) :
      null;

    const editButton = permissions.edit ?
      (<Button onClick={onEdit(instance, index)}>
        <Glyphicon glyph='edit' />
        {' '}
        {i18n.getMessage('crudEditor.edit.button')}
      </Button>) :
      null;

    const deleteButton = permissions.delete ?
      (<ConfirmDialog
        trigger='click'
        onConfirm={onDelete(instance)}
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
      </ConfirmDialog>) :
      null;

    return showButton || editButton || deleteButton ? (
      <ButtonGroup bsSize="sm" className="crud--search-result-listing__action-buttons">
        {showButton}
        {editButton}
        {deleteButton}
      </ButtonGroup>
    ) :
      null;
  }
}
