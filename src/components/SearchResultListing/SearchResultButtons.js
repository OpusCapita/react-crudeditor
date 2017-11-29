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
    internalOperations: PropTypes.arrayOf(PropTypes.object).isRequired,
    externalOperations: PropTypes.arrayOf(PropTypes.object),
    onShow: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    index: PropTypes.number
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  }

  operationsButton = operations => {
    if (operations.length === 0) {
      return null;
    }

    const { icon, handler, title, uid } = operations[0];

    if (operations.length === 1) {
      return (
        <Button onClick={handler} key={uid}>
          {icon && <Glyphicon glyph={icon} />}
          {icon && ' '}
          {title}
        </Button>
      );
    }

    return (
      <SplitButton
        title={
          <span>
            {icon && <Glyphicon glyph={icon}/>}
            {icon && '\u00A0'}
            {title}
          </span>
        }
        id={uid}
        key={uid}
        onClick={handler}
        bsSize="sm"
      >
        {
          operations.slice(1).map(({ icon, handler, title, uid }, index) => (
            <MenuItem
              key={index}
              eventKey={index}
              onClick={handler}
            >
              <span className="btn-sm text-left">
                {icon && <Glyphicon glyph={icon}/>}
                {icon && '\u00A0\u00A0'}
                {title}
              </span>
            </MenuItem>
          ))
        }
      </SplitButton>
    );
  }

  render() {
    const {
      onShow,
      onEdit,
      onDelete,
      permissions,
      index: uid
    } = this.props;

    const { i18n } = this.context;
    const buttons = [];

    buttons.push(
      this.operationsButton([
        ...(
          permissions.edit ?
            [{
              icon: 'edit',
              title: i18n.getMessage('crudEditor.edit.button'),
              handler: onEdit,
              uid: `internal-operation-${uid}`
            }] : (
              permissions.view ?
                [{
                  icon: 'eye-open',
                  title: i18n.getMessage('crudEditor.show.button'),
                  handler: onShow,
                  uid: `internal-operation-${uid}`
                }] :
                []
            )
        ),
        ...this.props.internalOperations.
          map(({ name, handler, ...rest }) => ({
            ...rest,
            handler: handler() || (_ => null),
            title: getModelMessage(i18n, `model.label.${name}`, name),
            uid: `custom-operation-${uid}`
          }))
      ])
    );

    buttons.push(
      this.operationsButton(
        (this.props.externalOperations || []).
          map(({ title, ...rest }) => ({
            ...rest,
            title,
            uid: `external-operation-${uid}`
          }))
      )
    );

    if (permissions.delete) {
      buttons.push(
        <ConfirmDialog
          trigger='click'
          title='Delete confirmation'
          message={i18n.getMessage('crudEditor.delete.confirmation')}
          textConfirm={i18n.getMessage('crudEditor.delete.button')}
          textCancel={i18n.getMessage('crudEditor.cancel.button')}
          key="delete"
        >
          <Button
            onClick={onDelete}
            bsSize="sm"
            data-show-confirm={_ => true}
          >
            <Glyphicon glyph='trash' />
            {' '}
            {i18n.getMessage('crudEditor.delete.button')}
          </Button>
        </ConfirmDialog>
      )
    }

    return buttons.filter(button => button).length && (
      <ButtonGroup bsSize="sm" className="crud--search-result-listing__action-buttons">
        {buttons}
      </ButtonGroup>
    );
  }
}
