import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'react-bootstrap';

export default class PaginationPanel extends PureComponent {
  static propTypes = {
    max: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    onPaginate: PropTypes.func.isRequired
  };

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    this.form.elements['gotoPage'].value = '';
  }

  handleGoToPage = event => {
    event.preventDefault(); // prevent reload on submit
    const input = event.target.elements['gotoPage'];
    const gotoPage = input.value;

    const { totalCount, max, onPaginate } = this.props;
    let page = parseInt(gotoPage, 10); // 10 is a radix.

    if (!page || page < 0 || page !== Number(gotoPage)) {
      input.value = '';
      return;
    }

    const maxPage = Math.ceil(totalCount / max);

    if (page > maxPage) {
      page = maxPage;
      input.value = page;
    }

    onPaginate(page);
  };

  formRef = el => this.form = el; // eslint-disable-line no-return-assign

  render() {
    const { totalCount, max, offset, onPaginate } = this.props;

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
          autoComplete="off"
          onSubmit={this.handleGoToPage}
          ref={this.formRef}
        >
          <div className="pull-left" style={{ marginRight: '1em' }}>
            <input
              className='form-control'
              name='gotoPage'
              style={{ width: '50px', textAlign: 'center' }}
            />
          </div>
          <div className="pull-left">
            <button className='btn btn-default' type='submit'>
              {this.context.i18n.getMessage('crudEditor.pagination.goToPage')}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
