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
    const { type, children, ...props } = this.props;

    let Component = null;

    switch (type) {
      case 'date':
        Component = FieldDate;
        break;
      case 'checkbox':
        Component = FieldBoolean;
        break;
      default:
        Component = FieldString;
    }

    return (
      <Component {...props}>
        {children}
      </Component>
    )
  }
}
