import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import createCrud from '../../../../../crudeditor-lib';
import secondModel from '../../../second-model';

export default class CustomTabComponent extends PureComponent {
  static propTypes = {
    viewName: PropTypes.string.isRequired,
    instance: PropTypes.object.isRequired
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

    return SecondCrud && (
      <SecondCrud
        view={this._lastState || {
          name: 'search',
          state: {
            hideSearchForm: true,
            max: 10
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
