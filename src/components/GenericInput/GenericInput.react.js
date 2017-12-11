import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FieldString from '../FieldString';
import FieldDate from '../FieldDate';
import FieldBoolean from '../FieldBoolean';

export default class GenericInput extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf([
      'checkbox',
      'date',
      'string'
    ])
  }

  render() {
    const { type, ...props } = this.props;

    switch (type) {
      case 'date':
        return <FieldDate {...props} />
      case 'checkbox':
        return <FieldBoolean {...props} />
      default:
        return <FieldString {...props} />
    }
  }
}
