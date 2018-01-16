import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import createCrud from '../../../../../crudeditor-lib';
import secondModel from '../../../second-model';

export default class CustomTabComponent extends PureComponent {
  static propTypes = {
    viewName: PropTypes.string.isRequired,
    instance: PropTypes.object.isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object,
    uiSpinner: PropTypes.object
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

    return (
      <SecondCrud
        view={this._lastState || {
          name: 'search',
          state: {
            max: 10,
            hideSearchForm: true
          }
        }}

        uiConfig={{
          headerLevel: 3
        }}

        onTransition={this.handleTransition}
      />
    )
  }
}
