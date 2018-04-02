import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Pagination, FormControl, Button } from 'react-bootstrap';

const NEXT_BUTTON = (<span className="glyphicon glyphicon-forward"/>);
const PREV_BUTTON = (<span className="glyphicon glyphicon-backward"/>);

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

  constructor(props, context) {
    super(props, context);
    this.state = {
      pageNumber: ''
    };
  }

  onSelect = (eventKey) => {
    const radix = 10;
    let currentPage = Number.parseInt(eventKey, radix);
    if (!isNaN(currentPage) && currentPage >= 1) {
      const { totalCount, max } = this.props;
      let maxPage = Math.round(Math.ceil(totalCount / max));
      if (currentPage > maxPage) {
        currentPage = maxPage
      }
      this.props.onPaginate(currentPage);
    }
    this.setState({ pageNumber: '' })
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.onSelect(this.state.pageNumber);
    }
  };

  render() {
    const {
      totalCount,
      max,
      offset,
      onPaginate
    } = this.props;

    return (
      <div>
        <div className="pull-left" style={{ marginRight: '1em' }}>
          <Pagination
            activePage={offset / max + 1}
            onSelect={onPaginate}
            items={Math.ceil(totalCount / max)}
            prev={PREV_BUTTON}
            next={NEXT_BUTTON}
            className="crud--search-pagination-panel__pagination"
            maxButtons={5}
            boundaryLinks={true}
          />
        </div>
        <div className="pull-left" style={{ marginRight: '1em' }}>
          <FormControl
            type="text"
            className="form-control"
            style={{ width: '50px', textAlign: 'center' }}
            onChange={(e) => { this.setState({ pageNumber: e.target.value }) }}
            onKeyPress={this.handleKeyPress}
            value={this.state.pageNumber}
          />
        </div>
        <div className="pull-left">
          <Button className="btn btn-default" onClick={() => { this.onSelect(this.state.pageNumber) }}>
            {this.context.i18n.getMessage('crudEditor.pagination.goToPage')}
          </Button>
        </div>
      </div>
    );
  }
}
