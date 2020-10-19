import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import find from 'lodash/find';
import PaginationPanel from './PaginationPanel';
import './SearchPaginationPanel.less';

export default class SearchResultPaginationPanel extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.shape({
        pageParams: PropTypes.shape({
          max: PropTypes.number,
          offset: PropTypes.number
        }),
        totalCount: PropTypes.number,
        gotoPage: PropTypes.string
      }).isRequired,
      actions: PropTypes.objectOf(PropTypes.func)
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  };

  handlePaginate = activePage => this.props.model.actions.searchInstances({
    offset: (activePage - 1) * this.props.model.data.pageParams.max
  })

  handleMaxChange = pageMax => this.props.model.actions.searchInstances({ max: pageMax })

  render() {
    const {
      data: {
        gotoPage,
        totalCount,
        pageParams: {
          max,
          offset
        },
        paginationOptions
      },
      actions: { updateGotoPage }
    } = this.props.model;

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
              <b>{find(paginationOptions, opt => opt.max === max).label}</b>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {
                paginationOptions.map(({ max: value, label }) => (
                  <MenuItem key={value} eventKey={value} active={max === value}>{label}</MenuItem>
                ))
              }
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
              gotoPage={gotoPage}
              onGotoPageChange={updateGotoPage}
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
