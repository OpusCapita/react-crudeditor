import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FieldString from '../FieldString';
import FieldDate from '../FieldDate';
import FieldNumber from '../FieldNumber';
import FieldBoolean from '../FieldBoolean';
import deferValueSync from '../DeferValueSync';

export default class GenericInput extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf([
      'checkbox',
      'date',
      'string',
      'integer',
      'decimal'
    ])
  }

  render() {
    const { type, ...props } = this.props;

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

    const DeferredComponent = deferValueSync(Component);

    return <DeferredComponent {...props}/>
  }
}
