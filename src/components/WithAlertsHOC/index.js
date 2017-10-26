import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
// import { getFieldText } from '../lib'

import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const withAlerts = WrappedComponent => {
  return class WithAlerts extends PureComponent {
    static propTypes = {
      model: PropTypes.object.isRequired
    }

    static contextTypes = {
      i18n: PropTypes.object
    };

    componentWillReceiveProps(nextProps) {
      const { i18n } = this.context;

      const { model: { data: {
        // fieldsErrors: newFieldsErrors,
        generalErrors: newGeneralErrors,
        flags: newFlags
      } } } = nextProps;

      const { model: { data: {
        // fieldsErrors: oldFieldsErrors,
        generalErrors: oldGeneralErrors,
        flags: oldFlags
      } } } = this.props

      // handle fields validation errors
      // if (newFieldsErrors && !isEqual(newFieldsErrors, oldFieldsErrors)) {
      //   const displayErrors = Object.keys(newFieldsErrors).reduce(
      //     (errArr, fieldName) => errArr.concat(newFieldsErrors[fieldName]), []
      //   )

      //   if (displayErrors.length > 0) {
      //     NotificationManager.create({
      //       id: 'warning',
      //       type: 'warning',
      //       message: this.context.i18n.getMessage('crudEditor.objectSaveFailed.message')
      //     })
      //   }
      // }

      // handle critical/serverside errors
      if (
        newGeneralErrors && newGeneralErrors.length > 0 &&
        !isEqual(newGeneralErrors, oldGeneralErrors &&
        newGeneralErrors.length > 0
        )) {
        NotificationManager.create({
          id: 'error',
          type: 'warning',
          message: i18n.getMessage('crudEditor.objectSaveFailed.message')
        })
      }

      // handle saveSuccess flag
      if (newFlags && newFlags.saveSuccess && newFlags.saveSuccess && !isEqual(newFlags, oldFlags)) {
        NotificationManager.create({
          id: 'success',
          type: 'success',
          message: i18n.getMessage('crudEditor.objectSaved.message')
        })
      }

      // handle updateSuccess flag
      if (newFlags && newFlags.updateSuccess && newFlags.updateSuccess && !isEqual(newFlags, oldFlags)) {
        NotificationManager.create({
          id: 'success',
          type: 'success',
          message: i18n.getMessage('crudEditor.objectUpdated.message')
        })
      }
    }

    componentWillUnmount() {
      ['success', 'warning', 'error'].forEach(id => NotificationManager.remove({ id }))
    }

    handlePluralMessages = msgs => (Array.isArray(msgs) && msgs.length === 1) || typeof msgs === 'string' ?
      msgs :
      (<div>
        {msgs.map((message, index) => <p key={message + '-' + index}>{message}</p>)}
      </div>);

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
