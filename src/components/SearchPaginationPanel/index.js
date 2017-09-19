import React from 'react';
import { Pagination, Dropdown, MenuItem } from 'react-bootstrap';

import './SearchPaginationPanel.less';

export default class extends React.PureComponent {
  handlePaginate = activePage => this.props.model.actions.searchInstances({
    offset: (activePage - 1) * this.props.model.data.pageParams.max
  })

  handleMaxChange = pageMax => this.props.model.actions.searchInstances({ max: pageMax })

  render() {
    const {
      totalCount,
      pageParams: {
        max,
        offset
      }
    } = this.props.model.data;

    return (
      <div className="crud--search-pagination-panel clearfix">
        <div className='paginate'>
          <Dropdown
            id='max-dropdown'
            onSelect={this.handleMaxChange}
            dropup={true}
            className="crud--search-pagination-panel__per-page-dropdown"
          >
            <Dropdown.Toggle>
              Results per page: <b>{max}</b>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem eventKey={-1} active={max === -1}>All</MenuItem>
              <MenuItem eventKey={1000} active={max === 1000}>1000</MenuItem>
              <MenuItem eventKey={100} active={max === 100}>100</MenuItem>
              <MenuItem eventKey={50} active={max === 50}>50</MenuItem>
              <MenuItem eventKey={30} active={max === 30}>30</MenuItem>
              <MenuItem eventKey={10} active={max === 10}>10</MenuItem>
              <MenuItem eventKey={3} active={max === 3}>3</MenuItem>  {/* FIXME: remove the line which is for testing only*/}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div>
          <div className='crud--search-pagination-panel__paginate paginate'>
            <div>
              <span>{totalCount} item(s) found</span>
            </div>

            <Pagination
              activePage={offset / max + 1}
              onSelect={this.handlePaginate}
              items={Math.ceil(totalCount / max)}
              maxButtons={10}
              boundaryLinks
              first
              last
            />
          </div>
        </div>
      </div>
    );
  }
}
