import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import StringRangeInput from './components/StringRangeInput';
import NumberRangeInput from './components/NumberRangeInput';
import DateRangeInput from './components/DateRangeInput';

export default class RangeInput extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf([
      'date',
      'number',
      'string'
    ])
  }

  render() {
    switch (this.props.type) {
      case 'date':
        return <DateRangeInput {...this.props} />
      case 'number':
        return <NumberRangeInput {...this.props} />
      default:
        return <StringRangeInput {...this.props} />
    }
  }
}
