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

  componentDidMount() {
    // console.log('custom tab mounted')
  }

  componentWillReceiveProps() {
    // console.log('custom tab will receive props')

    // uncomment this to create new crud on every load
    // this._secondCrud = createCrud(secondModel)
  }

  componentWillUnmount() {
    // console.log('custom tab will unmount')
  }

  render() {
    const SecondCrud = this._secondCrud;

    return SecondCrud && (
      <SecondCrud
        view={{
          name: 'search',
          state: {
            hideSearchForm: true,
            max: 10
          }
        }}

        uiConfig={{
          headerLevel: 3
        }}
      />
    )
  }
};
