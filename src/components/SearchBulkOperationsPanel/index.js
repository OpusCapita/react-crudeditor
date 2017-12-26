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
        standardOperations: PropTypes.object
      }),
      actions: PropTypes.objectOf(PropTypes.func)
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  handleDelete = _ => {
    const {
      data: { selectedInstances },
      actions: { deleteInstances }
    } = this.props.model;

    return deleteInstances(selectedInstances)
  }

  render() {
    const { i18n } = this.context;
    const {
      data: {
        standardOperations: {
          delete: deleteConfig = _ => {}
        } = {},
        selectedInstances
      },
      actions: {
        deleteInstances
      }
    } = this.props.model;

    return (
      <div className='crud---search-bulk-operations-panel'>
        {
          deleteInstances && (<div>
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

