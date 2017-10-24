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
          message={this.context.i18n.getMessage('crudEditor.deleteSelected.confirmation')}
        >
          <Button bsSize='sm' disabled={this.props.model.data.selectedInstances.length === 0}>
            {this.context.i18n.getMessage('crudEditor.deleteSelected.button')}
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

SearchBulkOperationsPanel.contextTypes = {
  i18n: PropTypes.object
};

export default SearchBulkOperationsPanel;
