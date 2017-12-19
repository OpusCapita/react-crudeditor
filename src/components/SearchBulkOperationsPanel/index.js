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
        }),
        standardOpsConfig: PropTypes.object
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
    const {
      permissions: {
        crudOperations
      },
      standardOpsConfig: {
        delete: deleteConfig = _ => {}
      } = {},
      selectedInstances
    } = this.props.model.data;
    const canDelete = crudOperations.delete;

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
                disabled={
                  selectedInstances.length === 0 ||
                  selectedInstances.reduce(
                    (result, instance) => result || !!(deleteConfig(instance) || {}).disabled
                    , false
                  )
                }
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

