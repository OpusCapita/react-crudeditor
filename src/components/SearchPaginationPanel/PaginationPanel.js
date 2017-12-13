import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { Pagination } from 'react-bootstrap';

export default class PaginationPanel extends PureComponent {
  static propTypes = {
    max: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    onPaginate: PropTypes.func.isRequired
  }

  componentDidMount() {
    // set proper icons for edge arrows
    const p = findDOMNode(this);

    const backward = p.firstChild.firstChild.firstChild;
    backward.className = 'glyphicon glyphicon-backward';
    backward.innerHTML = '';

    const forward = p.lastChild.firstChild.firstChild;
    forward.className = 'glyphicon glyphicon-forward';
    forward.innerHTML = '';
  }

  render() {
    const {
      totalCount,
      max,
      offset,
      onPaginate
    } = this.props;

    return (
      <Pagination
        activePage={offset / max + 1}
        onSelect={onPaginate}
        items={Math.ceil(totalCount / max)}
        className="crud--search-pagination-panel__pagination"
        maxButtons={5}
        boundaryLinks={true}
        prev={true}
        next={true}
      />
    );
  }
}
