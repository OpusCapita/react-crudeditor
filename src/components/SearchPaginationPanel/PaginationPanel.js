import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Pagination from 'react-bootstrap/lib/Pagination';

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

  handleGotoPageChange = ({
    target: { value }
  }) => this.props.onGotoPageChange(value);

  handleGoToPage = event => {
    event.preventDefault(); // prevent reload on submit
    event.stopPropagation(); // in case we use component in outer 'form' element
    const { totalCount, max, onPaginate, gotoPage, onGotoPageChange } = this.props;
    let page = parseInt(gotoPage, 10); // 10 is a radix.

    if (!page || page < 0 || page !== Number(gotoPage)) {
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
    const { totalCount, max, offset, onPaginate, gotoPage } = this.props;

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
        <form
          className="pull-left"
          onSubmit={this.handleGoToPage}
        >
          <div className="pull-left" style={{ marginRight: '1em' }}>
            <input
              className='form-control'
              name='gotoPage'
              style={{ width: '50px', textAlign: 'center' }}
              onChange={this.handleGotoPageChange}
              value={gotoPage}
            />
          </div>
          <div className="pull-left">
            <button className='btn btn-default' type='submit'>
              {this.context.i18n.getMessage('common.CrudEditor.pagination.goToPage')}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
