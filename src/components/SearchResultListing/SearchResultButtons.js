import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Glyphicon,
  Button,
  ButtonGroup,
  Dropdown,
  MenuItem
} from 'react-bootstrap';
import ConfirmDialog from '../ConfirmDialog';
import { getModelMessage } from '../lib';
import {
  OPERATION_SHOW,
  OPERATION_EDIT,
  OPERATION_DELETE
} from '../../crudeditor-lib/common/constants';

export default class SearchResultButtons extends PureComponent {
  static propTypes = {
    instance: PropTypes.object,
    index: PropTypes.number,
    parentRef: PropTypes.object,

    permissions: PropTypes.object.isRequired,
    customOperations: PropTypes.array,
    externalOperations: PropTypes.array,
    standardOperations: PropTypes.array.isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  }

  state = {
    previousSource: null
  }

  // handleToggleDropdown is a workaround for weird CSS overflow behavior
  // details: https://stackoverflow.com/a/6433475
  handleToggleDropdown = (dropdownOpened, event, { source }) => {
    const { parentRef } = this.props;
    const parentWidth = parentRef.clientWidth;
    const tableWidth = parentRef.firstChild.scrollWidth;

    // table is wider than visible div -> show scroll
    if (parentWidth < tableWidth) {
      parentRef.style.overflow = 'auto';
      return
    }

    // handle multiple dropdowns closing each other
    // don't rewrite styles if one DD is closed by opening another DD
    if (this.state.previousSource === 'click' && source === 'rootClose') {
      return
    }

    parentRef.style.overflow = dropdownOpened ? 'visible' : 'auto';

    this.setState({ previousSource: source })
  }

  operationsButton = operations => {
    if (operations.length === 0) {
      return null;
    }

    const { icon, handler, title, uid, disabled, hideIcon } = operations[0];

    if (operations.length === 1) {
      return (
        <Button
          onClick={handler}
          key={uid}
          {...(disabled ? { disabled } : null)}
        >
          {icon && !hideIcon && <Glyphicon glyph={icon} />}
          {icon && !hideIcon && ' '}
          {title}
        </Button>
      );
    }

    return (
      <Dropdown key={uid} id={uid} bsStyle="sm" onToggle={this.handleToggleDropdown}>
        <Button
          onClick={handler}
          {...(disabled ? { disabled } : null)}
        >
          {icon && <Glyphicon glyph={icon} />}
          {icon && ' '}
          {title}
        </Button>
        <Dropdown.Toggle/>
        <Dropdown.Menu>
          {
            operations.slice(1).map(({ icon, handler, title, uid, disabled, hideIcon }, index) => (
              <MenuItem
                key={index}
                eventKey={index}
                onClick={handler}
                {...(disabled ? { disabled } : null)}
              >
                <span className="btn-sm text-left">
                  {icon && !hideIcon && <Glyphicon glyph={icon}/>}
                  {icon && !hideIcon && '\u00A0\u00A0'}
                  {title}
                </span>
              </MenuItem>
            ))
          }
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  render() {
    const {
      permissions,
      index: uid,
      customOperations,
      externalOperations,
      standardOperations
    } = this.props;

    const { i18n } = this.context;
    const buttons = [];

    const editOperation = standardOperations.find(({ name }) => name === OPERATION_EDIT);
    const showOperation = standardOperations.find(({ name }) => name === OPERATION_SHOW);

    buttons.push(
      this.operationsButton([
        ...(
          permissions.edit && editOperation ?
            [{
              icon: 'edit',
              title: i18n.getMessage('crudEditor.edit.button'),
              uid: `internal-operation-${uid}`,
              ...editOperation
            }] : (
              permissions.view && showOperation ?
                [{
                  icon: 'eye-open',
                  title: i18n.getMessage('crudEditor.show.button'),
                  uid: `internal-operation-${uid}`,
                  ...showOperation
                }] :
                []
            )
        ),
        ...customOperations.
          map(({ name, ...rest }) => ({
            ...rest,
            title: getModelMessage(i18n, `model.label.${name}`, name),
            uid: `custom-operation-${uid}`
          }))
      ])
    );

    buttons.push(
      this.operationsButton(
        externalOperations.map(operation => ({
          ...operation,
          uid: `external-operation-${uid}`
        }))
      )
    );

    const deleteOperation = standardOperations.find(({ name }) => name === OPERATION_DELETE);

    if (permissions.delete && deleteOperation) {
      const deleteButton = this.operationsButton([{
        icon: 'trash',
        title: i18n.getMessage('crudEditor.delete.button'),
        uid: `delete-operation-${uid}`,
        ...deleteOperation
      }])

      buttons.push(
        <ConfirmDialog
          message={i18n.getMessage('crudEditor.delete.confirmation')}
          textConfirm={i18n.getMessage('crudEditor.delete.button')}
          textCancel={i18n.getMessage('crudEditor.cancel.button')}
          key="delete"
        >
          {deleteButton}
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
