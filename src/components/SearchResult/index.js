import React from 'react';
import PropTypes from 'prop-types';
import ResultListing from '../SearchResultListing';
import BulkOperationsPanel from '../SearchBulkOperationsPanel';
import PaginationPanel from '../SearchPaginationPanel';
import './SearchResult.less';

const SearchResult = ({ model }, { i18n }) => model.data.totalCount > 0 ? (
  <div className="crud--search-result">
    <div className="crud--search-result__table">
      <ResultListing model={model} />
    </div>
    <div className="crud--search-result__footer">
      <BulkOperationsPanel model={model} />
      <PaginationPanel model={model} />
    </div>
  </div>
) : (
  <div className="crud--search-result__no-items-found">
    <span>{i18n.getMessage('crudEditor.found.items.message', { count: 0 })}</span>
  </div>
);

SearchResult.propTypes = {
  model: PropTypes.object.isRequired
}

SearchResult.contextTypes = {
  i18n: PropTypes.object
};

export default SearchResult;
