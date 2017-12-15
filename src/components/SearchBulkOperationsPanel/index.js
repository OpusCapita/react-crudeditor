import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { OPERATION_DELETE_SELECTED } from '../../crudeditor-lib/common/constants';
import ConfirmDialog from '../ConfirmDialog';
import './SearchBulkOperationsPanel.less';

export default class SearchBulkOperationsPanel extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.shape({
        selectedInstances: PropTypes.array,
        permissions: PropTypes.shape({
          crudOperations: PropTypes.shape({
            delete: PropTypes.bool.isRequired
          })
        })
      }),
      actions: PropTypes.objectOf(PropTypes.func)
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  render() {
    const { i18n } = this.context;

    const {
      data: {
        permissions: {
          crudOperations: {
            delete: canDelete
          }
        },
        selectedInstances
      },
      operations: {
        standard
      }
    } = this.props.model;

    const deleteOperation = standard({ instances: selectedInstances }).
      find(({ name }) => name === OPERATION_DELETE_SELECTED);

    const buttons = [];

    if (canDelete && deleteOperation) {
      const { handler, disabled, ...rest } = deleteOperation;

      buttons.push(
        <ConfirmDialog
          message={i18n.getMessage('crudEditor.deleteSelected.confirmation')}
          textConfirm={i18n.getMessage('crudEditor.delete.button')}
          textCancel={i18n.getMessage('crudEditor.cancel.button')}
          key='deleteSelected'
        >
          <Button
            bsSize='sm'
            disabled={selectedInstances.length === 0 || disabled}
            onClick={handler}
          >
            {i18n.getMessage('crudEditor.deleteSelected.button')}
          </Button>
        </ConfirmDialog>
      )
    }

    return (
      <div className='crud---search-bulk-operations-panel'>
        {buttons}
        <div>
          {/* export menu here*/}
        </div>
      </div>
    )
  }
}

