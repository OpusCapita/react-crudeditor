import 'core-js/es6/promise';
import React from 'react';
import PropTypes from 'prop-types';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import { I18nManager } from '@opuscapita/i18n'
// import './ContractEditorScope.less'

function getParameterByName(name, url) {
  if (!url) {url = window.location.href;} // eslint-disable-line no-param-reassign
  name = name.replace(/[\[\]]/g, "\\$&"); // eslint-disable-line no-param-reassign
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) {return null;}
  if (!results[2]) {return '';}
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// This @showroomScopeDecorator modify React.Component prototype by adding _renderChildren() method.
export default
@showroomScopeDecorator
class ContractEditorScope extends React.Component {
  static childContextTypes = {
    i18n: PropTypes.object
  };

  constructor(...args) {
    super(...args);

    // check for URL query parameter 'lang', otherwise use default language
    this.i18n = new I18nManager({ locale: getParameterByName('lang') || 'en' });
  }

  getChildContext() {
    return { i18n: this.i18n }
  }

  render() {
    return (
      <div style={{ position: "relative" }} className="contract-editor-scope">
        {this._renderChildren()}
      </div>
    );
  }
}
