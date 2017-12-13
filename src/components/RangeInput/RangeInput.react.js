import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import StringRangeInput from './components/StringRangeInput';
import DateRangeInput from './components/DateRangeInput';

export default class RangeInput extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf([
      'date',
      'string'
    ])
  }

  render() {
    const { type, ...props } = this.props;

    switch (type) {
      case 'date':
        return <DateRangeInput {...props} />
      default:
        return <StringRangeInput {...props} />
    }
  }
}
