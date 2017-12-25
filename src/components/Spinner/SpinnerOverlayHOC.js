import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './SpinnerOverlay.less';

const withSpinner = WrappedComponent => {
  return class WithSpinner extends PureComponent {
    static propTypes = {
      model: PropTypes.shape({
        data: PropTypes.shape({
          isLoading: PropTypes.bool
        }).isRequired,
        uiConfig: PropTypes.shape({
          spinner: PropTypes.func.isRequired
        })
      }).isRequired
    }

    render() {
      const { children, model, ...props } = this.props;

      const SpinnerComponent = model.uiConfig.spinner;

      const Spinner = model.data.isLoading ?
        (
          <div className="crud--spinner-overlay">
            <SpinnerComponent/>
          </div>
        ) :
        null;

      return (
        <div className="ready-for-spinner">
          {Spinner}
          <WrappedComponent
            {...props}
            model={model}
            {...(Spinner ? { overflow: 'hidden' } : null)}
          >
            {children}
          </WrappedComponent>
        </div>
      );
    }
  }
}

export default withSpinner;
