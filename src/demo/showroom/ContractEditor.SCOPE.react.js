import React from 'react';
import PropTypes from 'prop-types';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import { I18nManager } from '@opuscapita/i18n'

import modelTranslations from '../models/contracts/i18n';
import crudTranslations from '../../crudeditor-lib/i18n';

// This @showroomScopeDecorator modify React.Component prototype by adding _renderChildren() method.
export default
@showroomScopeDecorator
class ContractEditorScope extends React.Component {
  static childContextTypes = {
    i18n: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);

    this.initI18n();
  }

  getChildContext() {
    const i18n = this.i18n;
    return ({ i18n });
  }

  initI18n(props) {
    const i18n = new I18nManager({ locale: 'ru' });

    i18n.register('CrudEditor', crudTranslations);
    i18n.register('Model', modelTranslations);

    this.i18n = i18n;
  }

  render() {
    return (
      <div>
        {this._renderChildren()}
      </div>
    );
  }
}
