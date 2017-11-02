import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import { I18nManager } from '@opuscapita/i18n'
import modelTranslations from '../models/contracts/i18n';
import crudTranslations from '../../crudeditor-lib/i18n';

function getParameterByName(name, url) {
  if (!url) {url = window.location.href;} // eslint-disable-line no-param-reassign
  name = name.replace(/[\[\]]/g, "\\$&"); // eslint-disable-line no-param-reassign
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
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

  getChildContext() {
    // check for URL query parameter 'lang', otherwise use default language
    const i18n = new I18nManager({ locale: getParameterByName('lang') || 'en' });
    i18n.register('CrudEditor', crudTranslations);
    i18n.register('Model', modelTranslations);
    return { i18n }
  }

  render() {
    return (
      <div style={{ position: "relative" }}>
        {this._renderChildren()}
      </div>
    );
  }
}
