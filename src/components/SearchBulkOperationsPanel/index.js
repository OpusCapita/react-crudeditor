import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ConfirmDialog from '../ConfirmDialog';
import './SearchBulkOperationsPanel.less';

export default class SearchBulkOperationsPanel extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      bulkOperations: PropTypes.shape({
        delete: PropTypes.shape({
          title: PropTypes.string.isRequired,
          disabled: PropTypes.bool,
          handler: PropTypes.func.isRequired,
          confirm: PropTypes.shape({
            message: PropTypes.string.isRequired,
            textConfirm: PropTypes.string.isRequired,
            textCancel: PropTypes.string.isRequired
          }).isRequired
        })
      }).isRequired
    }).isRequired
  }

  render() {
    const {
      bulkOperations: {
        delete: bulkDelete
      } = {}
    } = this.props.model;

    return (
      <div className='crud---search-bulk-operations-panel'>
        {
          bulkDelete && (
            <div>
              <ConfirmDialog {...bulkDelete.confirm}>
                <button
                  type="button"
                  className="btn btn-sm btn-default"
                  disabled={bulkDelete.disabled}
                  onClick={bulkDelete.handler} // eslint-disable-line react/jsx-handler-names
                >
                  {bulkDelete.title}
                </button>
              </ConfirmDialog>
            </div>
          )
        }
        <div>
          {/* export menu here*/}
        </div>
      </div>
    )
  }
}

