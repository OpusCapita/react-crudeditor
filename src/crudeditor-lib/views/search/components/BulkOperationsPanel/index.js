import React, { PureComponent } from 'react';
import { Button } from 'react-bootstrap';

import connect from '../../../../connect';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import { deleteInstances } from '../../actions';
import { getSelectedInstances } from '../../selectors';

@connect({
  selectedInstances: getSelectedInstances
}, {
  deleteInstances
})
export default class extends PureComponent {
  handleDelete = _ => this.props.deleteInstances(this.props.selectedInstances);

  render() {
    const { selectedInstances } = this.props;

    return (
      <nav className='navbar navbar-default navbar-sm'>
        <div className='navbar-form pull-left'>
          <ConfirmDialog
            trigger='click'
            title='Delete confirmation'
            onConfirm={this.handleDelete}
            message='Do you want to delete selected items?'
          >
            <Button bsSize='sm' disabled={selectedInstances.length === 0}>
              Delete selected
            </Button>
          </ConfirmDialog>
        </div>
        <div className='navbar-form pull-right'>
          {/*export menu here*/}
        </div>
      </nav>
    );
  }
}
