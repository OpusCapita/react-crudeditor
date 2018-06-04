import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import ConfirmDialog from '../ConfirmDialog';
import './SearchBulkOperationsPanel.less';

export default class SearchBulkOperationsPanel extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      bulkOperations: PropTypes.shape({
        delete: PropTypes.oneOfType([
          PropTypes.shape({
            title: PropTypes.string.isRequired,
            disabled: PropTypes.bool,
            handler: PropTypes.func.isRequired,
            confirm: PropTypes.shape({
              message: PropTypes.string.isRequired,
              textConfirm: PropTypes.string.isRequired,
              textCancel: PropTypes.string.isRequired
            }).isRequired
          }),
          PropTypes.bool
        ])
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
                <Button
                  bsSize='sm'
                  disabled={bulkDelete.disabled}
                  /* eslint-disable react/jsx-handler-names */
                  onClick={bulkDelete.handler}
                  /* eslint-enable react/jsx-handler-names */
                >
                  {bulkDelete.title}
                </Button>
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

