import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { OCAlert } from '@opuscapita/react-alerts';
import isEqual from 'lodash/isEqual';
import { OCAlertsProvider } from '@opuscapita/react-alerts';
import { getFieldText } from '../lib'

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

      const { model: { data: { fieldsErrors: newFieldsErrors } } } = nextProps;
      const { model: { data: { fieldsErrors: oldFieldsErrors } } } = this.props

      if (newFieldsErrors && !isEqual(newFieldsErrors, oldFieldsErrors)) {
        if (this.warnAlert) {
          OCAlert.closeAlert(this.warnAlert);
        }

        const displayErrors = Object.keys(newFieldsErrors).reduce(
          (errArr, fieldName) => errArr.concat(
            newFieldsErrors[fieldName].map(
              errObj => `Error in field "${i18n ? getFieldText(i18n, fieldName) : fieldName}": ${errObj.message}`
            )
          ), []
        )

        if (displayErrors.length > 0) {
          this.warnAlert = OCAlert.alertWarning(displayErrors)
        } else if (this.warnAlert) {
          OCAlert.closeAlert(this.warnAlert);
        }
      }

      const { model: { data: { generalErrors: newGeneralErrors } } } = nextProps;
      const { model: { data: { generalErrors: oldGeneralErrors } } } = this.props;

      if (newGeneralErrors && newGeneralErrors.length > 0 && !isEqual(newGeneralErrors, oldGeneralErrors)) {
        if (this.errAlert) {
          OCAlert.closeAlert(this.errAlert);
        }

        const displayErrors = newGeneralErrors.map(e => e.message);

        if (displayErrors.length > 0) {
          this.errAlert = OCAlert.alertError(displayErrors)
        } else if (this.errAlert) {
          OCAlert.closeAlert(this.errAlert);
        }
      }
    }

    componentWillUnmount() {
      OCAlert.closeAlerts();
    }

    render() {
      const { children, ...props } = this.props;

      return (<div>
        <WrappedComponent {...props}>
          {children}
        </WrappedComponent>
        <OCAlertsProvider/>
      </div>
      );
    }
  }
}

export default withAlerts;
