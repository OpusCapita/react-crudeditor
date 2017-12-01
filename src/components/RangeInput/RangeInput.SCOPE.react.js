import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { showroomScopeDecorator } from '@opuscapita/react-showroom-client';
import { I18nManager } from '@opuscapita/i18n';
import translations from '../../crudeditor-lib/i18n';

// This @showroomScopeDecorator modify React.Component prototype by adding _renderChildren() method.
export default
@showroomScopeDecorator
class RangeInputScope extends PureComponent {
  static childContextTypes = {
    i18n: PropTypes.object
  };

  constructor(...args) {
    super(...args);

    // check for URL query parameter 'lang', otherwise use default language
    this.i18n = new I18nManager({ locale: 'en' });
    this.i18n.register('RangeInput', translations);
  }

  state = {}

  getChildContext() {
    return { i18n: this.i18n }
  }

  handleStringChange = stringValue => this.setState({ stringValue }, _ => {
    console.log(this.state.stringValue)
  })

  handleNumberChange = numberValue => this.setState({ numberValue }, _ => {
    console.log(this.state.numberValue)
  })

  handleFocus = _ => console.log('FOCUS')

  handleBlur = _ => console.log('BLUR')

  render() {
    return (
      <div>
        {this._renderChildren()}
      </div>
    );
  }
}
