import React, { PureComponent } from 'react';
import {
  NotificationContainer,
  NotificationManager
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './styles.css';

import {
  NOTIFICATION_SUCCESS,
  NOTIFICATION_ERROR,
  NOTIFICATION_VALIDATION_ERROR
} from '../../middleware/notifications';

const withAlerts = WrappedComponent => {
  return class WithAlerts extends PureComponent {
    componentWillUnmount() {
      [
        NOTIFICATION_SUCCESS,
        NOTIFICATION_ERROR,
        NOTIFICATION_VALIDATION_ERROR
      ].forEach(id => NotificationManager.remove({ id }));
    }

    render() {
      const { children, ...props } = this.props;

      return (
        <div>
          <WrappedComponent {...props}>
            {children}
          </WrappedComponent>
          <NotificationContainer/>
        </div>
      );
    }
  }
}

export default withAlerts;
