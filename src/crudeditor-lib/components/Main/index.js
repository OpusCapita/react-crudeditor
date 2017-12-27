import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ViewSwitcher from '../ViewSwitcher';
import { hardRedirectView } from '../../common/actions';
// import Spinner from '../Spinner';

class CrudMain extends PureComponent {
  static propTypes = {
    viewName: PropTypes.string,
    viewState: PropTypes.object,
    modelDefinition: PropTypes.object.isRequired,
    hardRedirectView: PropTypes.func.isRequired,
    externalOperations: PropTypes.arrayOf(PropTypes.object).isRequired,
    uiConfig: PropTypes.object.isRequired
  }

  constructor(...args) {
    super(...args);

    // Initial initialization (viewState structure is unknown and depends on viewName value):
    this.props.hardRedirectView({
      viewName: this.props.viewName,
      viewState: this.props.viewState
    });
  }

  // componentDidMount() {
  //   Spinner.setComponent(_ => (<i className="spinner fa fa-spinner fa-spin fa-3x fa-fw"/>))
  //   Spinner.start()
  //   setTimeout(_ => Spinner.start(), 300)
  //   setTimeout(_ => Spinner.stop(), 500)
  //   setTimeout(_ => Spinner.stop(), 1500)
  //   setTimeout(_ => Spinner.start(), 3000)
  //   setTimeout(_ => Spinner.stop(), 5000)
  // }

  componentWillReceiveProps({ viewName, viewState }) {
    // Re-initialization (viewState structure is unknown and depends on viewName value):
    this.props.hardRedirectView({ viewName, viewState });
  }

  render = _ => (
    <ViewSwitcher
      modelDefinition={this.props.modelDefinition}
      externalOperations={this.props.externalOperations}
      uiConfig={this.props.uiConfig}
    />
  )
}

export default connect(
  undefined,
  { hardRedirectView },
  undefined,
  { areOwnPropsEqual: _ => false }
)(CrudMain);
