import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './styles.css';

import {
  NOTIFICATION_SUCCESS,
  NOTIFICATION_ERROR,
  NOTIFICATION_VALIDATION_WARNING
} from '../../events';

const withAlerts = WrappedComponent => {
  return class WithAlerts extends PureComponent {
    static contextTypes = {
      i18n: PropTypes.object
    };

    componentWillUnmount() {
      [NOTIFICATION_SUCCESS,
        NOTIFICATION_ERROR,
        NOTIFICATION_VALIDATION_WARNING
      ].forEach(id => NotificationManager.remove({ id }))
    }

    render() {
      const { children, ...props } = this.props;

      return (<div>
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
