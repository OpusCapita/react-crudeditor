import React, { PureComponent } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './styles.css';

import {
  NOTIFICATION_SUCCESS,
  NOTIFICATION_ERROR,
  NOTIFICATION_VALIDATION_WARNING,
  NOTIFICATION_VALIDATION_ERROR
} from '../../middleware/notifications';

const withAlerts = WrappedComponent => {
  return class WithAlerts extends PureComponent {
    componentDidMount() {
      this.me = findDOMNode(this);

      // workaround for embedded editors
      // sometimes this.me is undefined here in case we open a tab with embedded editor
      // and navigate to another instance in parent editor
      // ** reason is unclear **
      // componentDidMount gets called with this.me === null immediately after
      // previous editor's componentWillUnmount
      if (this.me) {
        this.notificationsContainer = document.createElement('div');
        this.me.insertAdjacentElement('afterend', this.notificationsContainer);
        ReactDOM.render(<NotificationContainer/>, this.notificationsContainer);
      }
    }

    componentWillUnmount() {
      [
        NOTIFICATION_SUCCESS,
        NOTIFICATION_ERROR,
        NOTIFICATION_VALIDATION_WARNING,
        NOTIFICATION_VALIDATION_ERROR
      ].forEach(id => NotificationManager.remove({ id }));

      // workaround for embedded editors
      // sometimes this.me is undefined here in case we open a tab with embedded editor
      // and navigate to another instance in parent editor
      // ** reason is unclear **
      // componentWillUnmount gets called twice, first time this.me is a DOM node, and the second - null
      if (this.me) {
        ReactDOM.unmountComponentAtNode(this.notificationsContainer);
        this.me.parentElement.removeChild(this.notificationsContainer);
      }
    }

    render() {
      const { children, ...props } = this.props;

      return (
        <WrappedComponent {...props}>
          {children}
        </WrappedComponent>
      );
    }
  }
}

export default withAlerts;
