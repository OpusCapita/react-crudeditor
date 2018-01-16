import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  NOTIFICATION_SUCCESS,
  NOTIFICATION_ERROR,
  NOTIFICATION_VALIDATION_ERROR
} from '../../middleware/notifications';

const withAlerts = WrappedComponent => {
  return class WithAlerts extends PureComponent {
    static contextTypes = {
      uiMessageNotifications: PropTypes.object.isRequired
    }

    componentWillUnmount() {
      const { uiMessageNotifications: notification } = this.context;

      [
        NOTIFICATION_SUCCESS,
        NOTIFICATION_ERROR,
        NOTIFICATION_VALIDATION_ERROR
      ].forEach(id => notification.remove({ id }));
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
