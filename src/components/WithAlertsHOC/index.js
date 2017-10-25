import React, { PureComponent } from 'react';
import { OCAlert } from '@opuscapita/react-alerts';
import isEqual from 'lodash/isEqual';
import { OCAlertsProvider } from '@opuscapita/react-alerts';

const withAlerts = WrappedComponent => {
  return class extends PureComponent {
    componentWillReceiveProps(nextProps) {
      console.log('HOC componentWillReceiveProps');
      console.log(nextProps.model.data)
      const { model: { data: { generalErrors: newErrors } } } = nextProps;
      const { model: { data: { generalErrors: oldErrors } } } = this.props;

      if (newErrors.length > 0 && !isEqual(oldErrors, newErrors)) {
        if (this.errAlert) {
          OCAlert.closeAlert(this.errAlert);
        }
        this.errAlert = OCAlert.alertError(newErrors.map(e => e.message))
      }
    }

    componentWillUnmount() {
      if (this.errAlert) {
        OCAlert.closeAlert(this.errAlert);
      }
    }

    render() {
      const { children, ...props} = this.props;

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
