import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ResultListing from '../SearchResultListing';
import BulkOperationsPanel from '../SearchBulkOperationsPanel';
import PaginationPanel from '../SearchPaginationPanel';
import WithSpinner from '../Spinner/SpinnerOverlayHOC';
import './SearchResult.less';

class SearchResult extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.shape({
        totalCount: PropTypes.number
      }).isRequired
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  render() {
    const { model } = this.props;
    const { i18n } = this.context;

    return model.data.totalCount > 0 ? (
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
  }
}

export default WithSpinner(SearchResult);
