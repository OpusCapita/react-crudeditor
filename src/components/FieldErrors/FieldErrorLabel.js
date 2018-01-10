import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Label, Fade } from 'react-bootstrap';

import {
  ERROR_INVALID_DATE,
  ERROR_INVALID_INTEGER,
  ERROR_INVALID_DECIMAL,
  ERROR_MIN_DECEEDED,
  ERROR_MAX_EXCEEDED,
  ERROR_REQUIRED_MISSING,
  ERROR_INVALID_EMAIL,
  ERROR_INVALID_URL,
  ERROR_REGEX_DOESNT_MATCH,
  ERROR_MIN_SIZE_DECEEDED,
  ERROR_MAX_SIZE_EXCEEDED
} from '../../data-types-lib/constants';

export default class FieldErrorLabel extends PureComponent {
  static propTypes = {
    errors: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      code: PropTypes.number,
      message: PropTypes.string,
      payload: PropTypes.string
    })),
    fieldName: PropTypes.string.isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  };

  getErrorMessage = ({ id, message, args }) => {
    const { getMessage } = this.context.i18n;
    const { fieldName } = this.props;

    const errorMessages = {
      [ERROR_MIN_DECEEDED]: "default.invalid.min.message",
      [ERROR_MAX_EXCEEDED]: "default.invalid.max.message",
      [ERROR_MIN_SIZE_DECEEDED]: "default.invalid.min.size.message",
      [ERROR_MAX_SIZE_EXCEEDED]: "default.invalid.max.size.message",
      [ERROR_REQUIRED_MISSING]: "default.blank.message",
      [ERROR_INVALID_INTEGER]: "default.invalid.integer.message",
      [ERROR_INVALID_DECIMAL]: "default.invalid.decimal.message",
      [ERROR_INVALID_DATE]: "default.invalid.date.message",
      [ERROR_INVALID_EMAIL]: "default.invalid.email.message",
      [ERROR_INVALID_URL]: "default.invalid.url.message",
      [ERROR_REGEX_DOESNT_MATCH]: "default.doesnt.match.message"
    }

    if (errorMessages[id]) {
      return getMessage(errorMessages[id], args)
    }

    // Try to find a translation defined by model.
    const key = `model.field.${fieldName}.error.${id}`;
    const text = getMessage(key, args);

    return text === key ?
      message || id : // Translation is not found.
      text;
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
