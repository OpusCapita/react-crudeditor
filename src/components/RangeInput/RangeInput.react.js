import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import StringRangeInput from './components/StringRangeInput';
import NumberRangeInput from './components/NumberRangeInput';
import DateRangeInput from './components/DateRangeInput';

export default class RangeInput extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf([
      'date',
      'string',
      'integer',
      'decimal'
    ])
  }

  render() {
    const { type, ...props } = this.props;

    switch (type) {
      case 'date':
        return <DateRangeInput {...props} />
      case 'integer':
        return <NumberRangeInput type="integer" {...props} />
      case 'decimal':
        return <NumberRangeInput type="decimal" {...props} />
      default:
        return <StringRangeInput {...props} />
    }
  }
}
