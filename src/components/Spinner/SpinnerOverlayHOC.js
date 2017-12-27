import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { SVG as Svg } from '@opuscapita/react-svg';
// import spinnerSVG from './spinner2.svg';
// import './SpinnerOverlay.less';

const withSpinner = WrappedComponent => {
  return class WithSpinner extends PureComponent {
    static propTypes = {
      model: PropTypes.shape({
        data: PropTypes.shape({
          // spinner: PropTypes.func,
          isLoading: PropTypes.bool
        }).isRequired
      }).isRequired
    }

    static contextTypes = {
      spinner: PropTypes.object.isRequired
    }

    constructor(...args) {
      super(...args);

      const { isLoading } = this.props.model.data;
      const { spinner } = this.context;
      console.log('constructor', {isLoading})

      if (isLoading) {
        console.log('constructor start')
        spinner.start()
      } else {
        console.log('constructor stop')
        spinner.stop()
      }
    }

    componentWillReceiveProps(nextProps) {
      const { spinner } = this.context;

      const prevLoading = this.props.model.data.isLoading;
      const nextLoading = nextProps.model.data.isLoading;

      if (prevLoading !== nextLoading) {
        if (nextLoading) {
          console.log('start', {prevLoading, nextLoading})
          spinner.start()
        } else {
          console.log('stop', {prevLoading, nextLoading})
          spinner.stop()
        }
      }

      console.log({spinner})
    }

    render() {
      const {
        children,
        ...props
      } = this.props;

      return (
        <WrappedComponent {...props}>
          {children}
        </WrappedComponent>
      )
    }

    // render() {
    //   const { children, model, ...props } = this.props;

    //   console.log(this.props)

    //   const CustomSpinner = model.data.spinner;

    //   const defaultSpinner = (<Svg svg={spinnerSVG} style={{ width: '64px', height: '64px' }} />);

    //   const Spinner = model.data.isLoading ?
    //     (
    //       <div className="crud--spinner-overlay">
    //         { CustomSpinner ? <CustomSpinner/> : defaultSpinner }
    //       </div>
    //     ) :
    //     null;

    //   return (
    //     <div className="ready-for-spinner">
    //       {Spinner}
    //       <WrappedComponent
    //         {...props}
    //         model={model}
    //         {...(Spinner ? { overflow: 'hidden' } : null)}
    //       >
    //         {children}
    //       </WrappedComponent>
    //     </div>
    //   );
    // }
  }
}

export default withSpinner;
