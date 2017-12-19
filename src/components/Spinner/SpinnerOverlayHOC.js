import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SVG as Svg } from '@opuscapita/react-svg';
import spinnerSVG from './spinner2.svg';
import './SpinnerOverlay.less';

const withSpinner = WrappedComponent => {
  return class WithSpinner extends PureComponent {
    static propTypes = {
      model: PropTypes.shape({
        data: PropTypes.shape({
          spinner: PropTypes.func,
          isLoading: PropTypes.bool
        }).isRequired
      }).isRequired
    }

    render() {
      const { children, model, ...props } = this.props;

      const CustomSpinner = model.data.spinner;

      const defaultSpinner = (<Svg svg={spinnerSVG} style={{ width: '64px', height: '64px' }} />);

      const Spinner = model.data.isLoading ?
        (
          <div className="crud--spinner-overlay">
            { CustomSpinner ? <CustomSpinner/> : defaultSpinner }
          </div>
        ) :
        null;

      return (
        <div className="ready-for-spinner">
          {Spinner}
          <div className={`${Spinner ? 'under-active-spinner' : ''}`}>
            <WrappedComponent model={model} {...props}>
              {children}
            </WrappedComponent>
          </div>
        </div>
      );
    }
  }
}

export default withSpinner;
