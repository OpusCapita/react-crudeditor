import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Label } from 'react-bootstrap';

import {
  ERROR_INVALID_DATE,
  ERROR_INVALID_NUMBER,
  ERROR_MIN_DECEEDED,
  ERROR_MAX_EXCEEDED,
  ERROR_REQUIRED_MISSING
} from '../../data-types-lib/constants';

const errorMessages = {
  [ERROR_MIN_DECEEDED]: "default.invalid.min.size.message",
  [ERROR_MAX_EXCEEDED]: "default.invalid.max.size.message",
  [ERROR_REQUIRED_MISSING]: "default.blank.message",
  [ERROR_INVALID_NUMBER]: "typeMismatch.java.math.BigDecimal",
  [ERROR_INVALID_DATE]: "typeMismatch.java.util.Date"
}

export default class extends PureComponent {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.object),
    show: PropTypes.bool
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  getErrorMessage = ({ id, message }) => errorMessages[id] ?
    this.context.i18n.getMessage(errorMessages[id]) :
    message.length ? message : id;

  render() {
    const { errors, show } = this.props;

    return (
      <div style={{ display: "block" }}>
        <Label
          bsStyle="danger"
          style={{ opacity: show ? '1' : '0' }}
        >{(show && errors.length > 0) ? this.getErrorMessage(errors[0]) : ' '}
        </Label>
      </div>
    )
  }
}
