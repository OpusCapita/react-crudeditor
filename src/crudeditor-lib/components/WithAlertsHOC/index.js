import React, { PureComponent } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types';

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
    static contextTypes = {
      i18n: PropTypes.object
    };

    componentDidMount() {
      this.me = findDOMNode(this);
      this.notificationsContainer = document.createElement('div');
      this.me.parentElement.appendChild(this.notificationsContainer);
      ReactDOM.render(<NotificationContainer/>, this.notificationsContainer);
    }

    componentWillUnmount() {
      [
        NOTIFICATION_SUCCESS,
        NOTIFICATION_ERROR,
        NOTIFICATION_VALIDATION_WARNING,
        NOTIFICATION_VALIDATION_ERROR
      ].forEach(id => NotificationManager.remove({ id }));

      ReactDOM.unmountComponentAtNode(this.notificationsContainer);
      this.me.parentElement.removeChild(this.notificationsContainer);
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
