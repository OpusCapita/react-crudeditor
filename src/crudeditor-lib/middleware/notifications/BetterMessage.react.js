import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';
import './BetterMessage.less';

export default class BetterMessage extends PureComponent {
  static propTypes = {
    message: PropTypes.node.isRequired,
    details: PropTypes.node,
    detailsHeader: PropTypes.string
  }

  static defaultProps = {
    detailsHeader: 'Error'
  }

  state = {
    collapsed: true
  }

  handleCollapse = e => {
    e.stopPropagation();
    this.setState(prevState => ({ collapsed: !prevState.collapsed }));
  }

  handleCopyToClipboard = e => {
    e.stopPropagation();
    document.getSelection().selectAllChildren(this.details);
    document.execCommand("copy");
    document.getSelection().collapse(this.details, 0);
  }

  render() {
    const { message, details, detailsHeader } = this.props;
    const { collapsed } = this.state;

    return (
      <div>
        <div>
          {message}
          <span
            className={`fa fa-angle-${collapsed ? 'down' : 'up'}`}
            style={{ padding: '0 0.4em' }}
            onClick={this.handleCollapse}
          ></span>
        </div>
        <Collapse in={!collapsed}>
          <div style={{ marginTop: '10px' }}>
            <span style={{ fontWeight: 'bold' }}>
              {detailsHeader}
              <i
                className='fa fa-clipboard react-crudeditor--clipboard-icon'
                onClick={this.handleCopyToClipboard}
              ></i>
            </span>
            <div ref={el => (this.details = el)}>
              {details}
            </div>
          </div>
        </Collapse>
      </div>
    )
  }
}
