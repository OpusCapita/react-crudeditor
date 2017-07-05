import React from 'react';
import Pagination from 'react-bootstrap/lib/Pagination';

export const PaginationPanelViewReducer = function (dispatch, viewState) {
  const {filter, totalCount, max, offset, sort, order} = viewState;

  return {
    totalCount,
    max,
    offset,
    onPaginate(offset) {
      dispatch('search', {filter, offset, max, sort, order});
    }
  };
};


export default function(props) {
  const {totalCount, max, offset, onPaginate} = props;

  return (
    <div>
      <div className="pull-right paginate">
        {/*select menu to change max parameter here*/}
      </div>

      <div className="pull-right">
        <div className="paginate" style={{display: 'flex', alignItems: 'center'}}>
          <div className="pull-left">
            {totalCount} item(s) found
          </div>
          <div className="pull-left">
            <Pagination activePage={(offset / max) + 1}
                        onSelect={(activePage) => onPaginate((activePage - 1) * max)}
                        items={Math.round(totalCount / max)}
                        maxButtons={10}
                        boundaryLinks first last/>
          </div>
        </div>
      </div>
    </div>
  );
}