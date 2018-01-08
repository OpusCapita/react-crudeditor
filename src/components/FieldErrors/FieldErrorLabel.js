import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Label, Fade } from 'react-bootstrap';

import {
  ERROR_INVALID_DATE,
  ERROR_INVALID_INTEGER,
  ERROR_INVALID_DECIMAL,
  ERROR_MIN_DECEEDED,
  ERROR_MAX_EXCEEDED,
  ERROR_REQUIRED_MISSING
} from '../../data-types-lib/constants';

export default class FieldErrorLabel extends PureComponent {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      code: PropTypes.number,
      message: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      payload: PropTypes.string
    })),
    fieldName: PropTypes.string.isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  };

  getErrorMessage = ({ id, message, payload }) => {
    const { getMessage } = this.context.i18n;
    const { fieldName } = this.props;

    const errorMessages = {
      [ERROR_MIN_DECEEDED]: { key: "default.invalid.min.message", payload: message },
      [ERROR_MAX_EXCEEDED]: { key: "default.invalid.max.message", payload: message },
      [ERROR_REQUIRED_MISSING]: { key: "default.blank.message" },
      [ERROR_INVALID_INTEGER]: { key: "typeMismatch.java.math.BigInteger" },
      [ERROR_INVALID_DECIMAL]: { key: "typeMismatch.java.math.BigDecimal" },
      [ERROR_INVALID_DATE]: { key: "typeMismatch.java.util.Date" }
    }

    if (errorMessages[id]) {
      return getMessage(errorMessages[id].key, { payload: errorMessages[id].payload })
    }

    // Try to find a translation defined by model.
    const key = `model.field.${fieldName}.error.${id}`;
    const text = getMessage(key, payload);

    return text === key ?
      message || id : // Translation is not found.
      text;
  }

  render() {
    const { errors } = this.props;

    const hasErrors = !!errors.length;

    return (
      <div style={{ display: "block", opacity: hasErrors ? '1' : '0' }}>
        <Fade in={hasErrors}>
          <Label bsStyle="danger">
            {hasErrors ? this.getErrorMessage(errors[0]) : ' '}
          </Label>
        </Fade>
      </div>
    )
  }
}
