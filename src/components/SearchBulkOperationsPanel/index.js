import React from 'react';
import { Button } from 'react-bootstrap';

import ConfirmDialog from '../ConfirmDialog';

export default class extends React.PureComponent {
  handleDelete = _ => this.props.model.actions.deleteInstances(this.props.model.data.selectedInstances);

  render() {
    return (
      <nav className='navbar navbar-default navbar-sm'>
        <div className='navbar-form pull-left'>
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
        <div className='navbar-form pull-right'>
          {/*export menu here*/}
        </div>
      </nav>
    );
  }
}
