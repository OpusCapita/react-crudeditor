import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import ConfirmDialog from '../ConfirmDialog';
import './SearchBulkOperationsPanel.less';

class SearchBulkOperationsPanel extends React.PureComponent {
  handleDelete = _ => this.props.model.actions.deleteInstances(this.props.model.data.selectedInstances)

  render = _ =>
    (<div className='crud---search-bulk-operations-panel'>
      <div>
        <ConfirmDialog
          trigger='click'
          title='Delete confirmation'
          onConfirm={this.handleDelete}
          message='Do you want to delete selected items?'
        >
          <Button bsSize='sm' disabled={this.props.model.data.selectedInstances.length === 0}>
            Delete selected
          </Button>
        </ConfirmDialog>
      </div>
      <div>
        {/* export menu here*/}
      </div>
    </div>)
}

SearchBulkOperationsPanel.propTypes = {
  model: PropTypes.shape({
    data: PropTypes.shape({
      selectedInstances: PropTypes.array
    }),
    actions: PropTypes.objectOf(PropTypes.func)
  }).isRequired
}

export default SearchBulkOperationsPanel;
