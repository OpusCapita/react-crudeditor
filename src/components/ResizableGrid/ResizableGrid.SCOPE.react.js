import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import { I18nManager } from '@opuscapita/i18n';
import localeStore from "./store/localeStore";

// This @showroomScopeDecorator modifies React.Component prototype by adding _renderChildren() method.
export default
@showroomScopeDecorator
class ResizableGridScope extends PureComponent {
  static childContextTypes = {
    i18n: PropTypes.object
  };

  constructor(...args) {
    super(...args);
    this.i18n = new I18nManager({ locale: 'en' });
  }

  getChildContext() {
    return { i18n: this.i18n }
  }

  createLocaleStore = (storeIdProvider, defaultValue) => {
    return localeStore(storeIdProvider, defaultValue);
  }

  render() {
    return (
      <div>
        {this._renderChildren()}
      </div>
    );
  }
}
