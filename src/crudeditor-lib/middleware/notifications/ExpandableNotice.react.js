import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Collapse from 'react-bootstrap/lib/Collapse';
import './ExpandableNotice.less';
import { NotificationManager } from 'react-notifications';

// save `remove` for descendants
const _removeNotification = NotificationManager.remove.bind(NotificationManager);

export default class ExpandableNotice extends PureComponent {
  static propTypes = {
    message: PropTypes.node.isRequired,
    details: PropTypes.node,
    detailsHeader: PropTypes.string,
    id: PropTypes.string.isRequired
  }

  static defaultProps = {
    detailsHeader: 'Error(s) details'
  }

  state = {
    collapsed: true
  }

  componentDidMount() {
    const { id } = this.props;
    const el = this.notificationRef;

    // this is used to carry notification object from original `remove` to deferred one
    let notification;

    function handleMouseLeave() {
      NotificationManager.remove = _removeNotification;
    }

    function handleMouseLeaveAfterTrigger() {
      setTimeout(_ => _removeNotification(notification), 1000);
    }

    function deferredRemove() {
      if (arguments.length === 1 && (arguments[0] || {}).id === id) {
        notification = arguments[0];
        el.addEventListener('mouseleave', handleMouseLeaveAfterTrigger);
      } else {
        // in case if signature of NotificationManager.remove ever changes -> fall back to original function
        console.warn('Unexpected arguments for NotificationManager.remove: `react-notifications` API has changed!');
        _removeNotification(notification)
      }
    }

    function handleMouseOver() {
      if (NotificationManager.remove !== deferredRemove) {
        NotificationManager.remove = deferredRemove;
      }
      el.addEventListener('mouseleave', handleMouseLeave);
    }

    el.addEventListener('mouseover', handleMouseOver);
  }

  componentWillUnmount() {
    NotificationManager.remove = _removeNotification;
  }

  handleCollapse = event => {
    event.stopPropagation();
    this.setState(prevState => ({ collapsed: !prevState.collapsed }));
  }

  handleCopyToClipboard = event => {
    event.stopPropagation();
    document.getSelection().selectAllChildren(this.details);
    document.execCommand('copy');
    document.getSelection().collapse(this.details, 0);
  }

  saveRef = el => (this.notificationRef = el);

  render() {
    const { message, details, detailsHeader } = this.props;
    const { collapsed } = this.state;

    return (
      <div ref={this.saveRef}>
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
