import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Pagination, FormControl, Button } from 'react-bootstrap';

export default class PaginationPanel extends PureComponent {
  static propTypes = {
    max: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    onPaginate: PropTypes.func.isRequired,
    gotoPage: PropTypes.string.isRequired,
    onGotoPageChange: PropTypes.func.isRequired
  };

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  };

  handleGoToPage = _ => {
    const { totalCount, max, onPaginate, gotoPage, onGotoPageChange } = this.props;
    let page = parseInt(gotoPage, 10); // 10 is a radix.

    if (!page || page < 0) {
      onGotoPageChange('');
      return;
    }

    let maxPage = Math.ceil(totalCount / max);

    if (page > maxPage) {
      page = maxPage;
    }

    onPaginate(page);
  };

  render() {
    const { totalCount, max, offset, onPaginate, gotoPage, onGotoPageChange } = this.props;

    return (
      <div>
        <div className="pull-left" style={{ marginRight: '1em' }}>
          <Pagination
            activePage={offset / max + 1}
            onSelect={onPaginate}
            items={Math.ceil(totalCount / max)}
            prev={<span className="glyphicon glyphicon-backward" />}
            next={<span className="glyphicon glyphicon-forward" />}
            className="crud--search-pagination-panel__pagination"
            maxButtons={5}
            boundaryLinks={true}
          />
        </div>
        <div className="pull-left" style={{ marginRight: '1em' }}>
          <FormControl
            type="text"
            style={{ width: '50px', textAlign: 'center' }}
            onChange={({ target }) => onGotoPageChange(target.value)}
            onKeyPress={({ key }) => key === 'Enter' && this.handleGoToPage()}
            value={gotoPage}
          />
        </div>
        <div className="pull-left">
          <Button onClick={this.handleGoToPage}>
            {this.context.i18n.getMessage('crudEditor.pagination.goToPage')}
          </Button>
        </div>
      </div>
    );
  }
}
