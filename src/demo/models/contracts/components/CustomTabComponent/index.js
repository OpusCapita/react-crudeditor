import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import createCrud from '../../../../../crudeditor-lib';
import secondModel from '../../../second-model';

export default class CustomTabComponent extends PureComponent {
  static propTypes = {
    viewName: PropTypes.string.isRequired,
    instance: PropTypes.object.isRequired,
    uiConfig: PropTypes.object.isRequired
  }

  constructor(...args) {
    super(...args);

    this._secondCrud = createCrud(secondModel)
  }

  handleTransition = state => {
    this._lastState = state
  };

  render() {
    const SecondCrud = this._secondCrud;
    const { spinner, headerLevel = 1 } = this.props.uiConfig;

    return (
      <SecondCrud
        view={this._lastState || {
          name: 'search',
          state: {
            hideSearchForm: true,
            max: 10
          }
        }}

        uiConfig={{
          headerLevel: headerLevel + 1,
          spinner
        }}

        onTransition={this.handleTransition}
      />
    )
  }
}
