import React from 'react';
import ConfirmDialog from './ConfirmDialog';

export const BulkOperationsPanelViewReducer = function(dispatch, viewState, context) {
  const {selected} = viewState;
  return {
    selected,
    onDeleteSelected(selected) {
      dispatch('delete', {selected});
    }
  }
};

export default function(props) {
  const {selected, onDeleteSelected} = props;

  return (
    <nav className="navbar navbar-default navbar-sm">
      <div className="navbar-form pull-left">
        <ConfirmDialog trigger="click"
                       title="Delete confirmation"
                       onConfirm={() => onDeleteSelected(selected)}
                       message="Do you want to delete selected items?">
          <button className="btn btn-default btn-sm"
                  disabled={selected.length === 0}>Delete selected</button>
        </ConfirmDialog>
      </div>
      <div className="navbar-form pull-right">
        {/*export menu here*/}
      </div>
    </nav>
  );
}