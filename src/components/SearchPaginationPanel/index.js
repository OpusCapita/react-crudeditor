import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, MenuItem } from 'react-bootstrap';
import PaginationPanel from './PaginationPanel';
import {
  OPERATION_SEARCH
} from '../../crudeditor-lib/common/constants';
import './SearchPaginationPanel.less';

export default class SearchResultPaginationPanel extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.shape({
        pageParams: PropTypes.shape({
          max: PropTypes.number
        }),
        totalCount: PropTypes.number
      }),
      operations: PropTypes.shape({
        standard: PropTypes.func.isRequired
      })
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  handlePaginate = activePage => {
    const { standard } = this.props.model.operations;
    const { handler } = standard({
      offset: (activePage - 1) * this.props.model.data.pageParams.max
    }).find(({ name }) => name === OPERATION_SEARCH);

    return handler()
  }

  handleMaxChange = pageMax => {
    const { standard } = this.props.model.operations;
    const { handler } = standard({ max: pageMax }).find(({ name }) => name === OPERATION_SEARCH);

    return handler()
  }

  render() {
    const {
      totalCount,
      pageParams: {
        max,
        offset
      }
    } = this.props.model.data;

    const { i18n } = this.context;

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
              {i18n.getMessage('crudEditor.search.resultsPerPage')}
              {':\u0020'}
              <b>{max !== -1 ? max : i18n.getMessage('crudEditor.search.all')}</b>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem eventKey={-1} active={max === -1}>All</MenuItem>
              <MenuItem eventKey={1000} active={max === 1000}>1000</MenuItem>
              <MenuItem eventKey={100} active={max === 100}>100</MenuItem>
              <MenuItem eventKey={50} active={max === 50}>50</MenuItem>
              <MenuItem eventKey={30} active={max === 30}>30</MenuItem>
              <MenuItem eventKey={10} active={max === 10}>10</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {
          totalCount > max && max > 0 &&
          <div className="crud--search-pagination-panel__paginate">
            <PaginationPanel
              totalCount={totalCount}
              max={max}
              offset={offset}
              onPaginate={this.handlePaginate}
            />
          </div>
        }

        <div>
          <span>{this.context.i18n.getMessage('crudEditor.found.items.message', { count: totalCount })}</span>
        </div>
      </div>
    );
  }
}
