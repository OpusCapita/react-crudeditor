import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const withSpinner = WrappedComponent => {
  return class WithSpinner extends PureComponent {
    static propTypes = {
      model: PropTypes.shape({
        data: PropTypes.shape({
          isLoading: PropTypes.bool
        }).isRequired
      }).isRequired
    }

    static contextTypes = {
      uiSpinner: PropTypes.object.isRequired
    }

    constructor(...args) {
      super(...args);

      const { isLoading } = this.props.model.data;
      const { uiSpinner: spinner } = this.context;

      if (isLoading) {
        spinner.show()
      } else {
        spinner.hide()
      }
    }

    componentWillReceiveProps(nextProps) {
      const { uiSpinner: spinner } = this.context;

      const prevLoading = this.props.model.data.isLoading;
      const nextLoading = nextProps.model.data.isLoading;

      if (prevLoading !== nextLoading) {
        if (nextLoading) {
          spinner.show()
        } else {
          spinner.hide()
        }
      }
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
  }
}

export default withSpinner;
