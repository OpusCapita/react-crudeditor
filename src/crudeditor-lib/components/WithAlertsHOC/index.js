import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './styles.css';

const withAlerts = WrappedComponent => {
  return class WithAlerts extends PureComponent {

    static contextTypes = {
      i18n: PropTypes.object
    };

    componentWillUnmount() {
      ['success', 'warning', 'error'].forEach(id => NotificationManager.remove({ id }))
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
