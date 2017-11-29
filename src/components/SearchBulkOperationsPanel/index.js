import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

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

  handleDelete = _ => this.props.model.actions.deleteInstances(this.props.model.data.selectedInstances)

  render() {
    const { i18n } = this.context;
    const canDelete = this.props.model.data.permissions.crudOperations.delete;

    return (
      <div className='crud---search-bulk-operations-panel'>
        {
          canDelete && (<div>
            <ConfirmDialog
              message={i18n.getMessage('crudEditor.deleteSelected.confirmation')}
              textConfirm={i18n.getMessage('crudEditor.delete.button')}
              textCancel={i18n.getMessage('crudEditor.cancel.button')}
            >
              <Button
                bsSize='sm'
                disabled={this.props.model.data.selectedInstances.length === 0}
                onClick={this.handleDelete}
              >
                {i18n.getMessage('crudEditor.deleteSelected.button')}
              </Button>
            </ConfirmDialog>
          </div>)
        }
        <div>
          {/* export menu here*/}
        </div>
      </div>
    )
  }
}

