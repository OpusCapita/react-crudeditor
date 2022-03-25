import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';

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
      }).isRequired,
      customBulkOperations: PropTypes.arrayOf(PropTypes.object),
    }).isRequired
  }

  render() {
    const {
      bulkOperations: {
        delete: bulkDelete
      } = {},
      customBulkOperations,
    } = this.props.model;

    const hasCustomOperations = customBulkOperations && customBulkOperations.length > 0;

    return (
      <div className='crud---search-bulk-operations-panel'>
        {
          (bulkDelete || hasCustomOperations) && (
            <div>
              <ButtonGroup>
                {bulkDelete &&
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
                }
                {hasCustomOperations && customBulkOperations.map((operation, idx) =>
                  (<Button
                    key={idx}
                    bsSize='sm'
                    disabled={operation.disabled}
                    onClick={() => !operation.disabled ? operation.handler() : null}
                  >
                    {operation.ui.title}
                  </Button>))}
              </ButtonGroup>
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

