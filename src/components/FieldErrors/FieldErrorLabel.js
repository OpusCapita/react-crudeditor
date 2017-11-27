import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Label, Fade } from 'react-bootstrap';

import {
  ERROR_INVALID_DATE,
  ERROR_INVALID_NUMBER,
  ERROR_MIN_DECEEDED,
  ERROR_MAX_EXCEEDED,
  ERROR_REQUIRED_MISSING
} from '../../data-types-lib/constants';

export default class FieldErrorLabel extends PureComponent {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.object)
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  };

  getErrorMessage = ({ id, message }) => {
    const { getMessage } = this.context.i18n;

    const errorMessages = {
      [ERROR_MIN_DECEEDED]: { key: "default.invalid.min.message", payload: message },
      [ERROR_MAX_EXCEEDED]: { key: "default.invalid.max.message", payload: message },
      [ERROR_REQUIRED_MISSING]: { key: "default.blank.message" },
      [ERROR_INVALID_NUMBER]: { key: "typeMismatch.java.math.BigDecimal" },
      [ERROR_INVALID_DATE]: { key: "typeMismatch.java.util.Date" }
    }

    return errorMessages[id] ? // if we have a translation
    getMessage(errorMessages[id].key, { payload: errorMessages[id].payload }) :
      message || id; // otherwise print error message or at least error id
  }

  render() {
    const { errors } = this.props;

    return (
      <div style={{ display: "block" }}>
        <div style={{ opacity: errors.length ? '1' : '0' }}>
          <Fade in={!!errors.length}>
            <Label bsStyle="danger">
              {errors.length ? this.getErrorMessage(errors[0]) : ' '}
            </Label>
          </Fade>
        </div>
      </div>
    )
  }
}
