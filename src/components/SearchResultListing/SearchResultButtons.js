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

  makeCustomOpsButtons = ({
    glyph,
    titleKey,
    onClick
  }) => {
    const { operations: allOps, index } = this.props;
    const uid = `ops-custom-${index}`;
    const { i18n } = this.context;

    const operations = allOps.filter(({ type }) => type === 'custom');

    return (operations.length > 0) ?
      (
        <SplitButton
          title={
            <span>
              {glyph && <Glyphicon glyph={glyph}/>}
              {glyph && '\u00A0'}
              {i18n.getMessage(titleKey)}
            </span>
          }
          id={uid}
          key={uid}
          onClick={onClick}
          bsSize="sm"
        >
          {
            operations.map(({ name, icon, handler }, index) => (
              <MenuItem
                key={index}
                eventKey={index}
                onClick={handler}
              >
                <span className="btn-sm text-left">
                  {icon && <Glyphicon glyph={icon}/>}
                  {icon && '\u00A0\u00A0'}
                  {getModelMessage(i18n, `model.label.${name}`, name)}
                </span>
              </MenuItem>
            ))
          }
        </SplitButton>
      ) :
      (
        <Button onClick={onClick} key={uid}>
          {glyph && <Glyphicon glyph={glyph} />}
          {glyph && ' '}
          {i18n.getMessage(titleKey)}
        </Button>
      )
  }

  makeExternalOpsButtons = _ => {
    const { operations: allOps, index } = this.props;
    const uid = `ops-external-${index}`;
    const { i18n } = this.context;

    const operations = allOps.filter(({ type }) => type === 'external');

    if (operations.length > 1) {
      const { icon, name, handler } = operations[0];

      return (
        <SplitButton
          title={
            <span>
              {icon && <Glyphicon glyph={icon}/>}
              {icon && '\u00A0'}
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
                  {icon && '\u00A0\u00A0'}
                  {getModelMessage(i18n, `model.label.${name}`, name)}
                </span>
              </MenuItem>
            ))
          }
        </SplitButton>
      )
    } else if (operations.length === 1) {
      const { icon, name, handler } = operations[0];

      return (
        <Button onClick={handler} key={uid}>
          {icon && <Glyphicon glyph={icon} />}
          {icon && ' '}
          {getModelMessage(i18n, `model.label.${name}`, name)}
        </Button>
      )
    }

    return null;
  }

  render() {
    const {
      onShow,
      onEdit,
      onDelete,
      permissions
    } = this.props;

    const { i18n } = this.context;

    const buttons = [];

    if (permissions.edit) {
      buttons.push(
        this.makeCustomOpsButtons({
          glyph: 'edit',
          titleKey: 'crudEditor.edit.button',
          onClick: onEdit
        })
      )
    } else if (permissions.view) {
      buttons.push(
        this.makeCustomOpsButtons({
          glyph: 'eye-open',
          titleKey: 'crudEditor.show.button',
          onClick: onShow
        })
      )
    }

    buttons.push(this.makeExternalOpsButtons());

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
