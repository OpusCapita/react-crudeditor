import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Label, Fade } from 'react-bootstrap';
import { getModelMessage } from '../lib';

import {
  ERROR_INVALID_DATE,
  ERROR_INVALID_INTEGER,
  ERROR_INVALID_DECIMAL,
  ERROR_MIN_DECEEDED,
  ERROR_MAX_EXCEEDED,
  ERROR_REQUIRED_MISSING,
  ERROR_INVALID_EMAIL,
  ERROR_INVALID_URL,
  ERROR_REGEX_DOESNT_MATCH
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
    const { i18n } = this.context;
    const { fieldName } = this.props;

    const errorMessages = {
      [ERROR_MIN_DECEEDED]: "default.invalid.min.message",
      [ERROR_MAX_EXCEEDED]: "default.invalid.max.message",
      [ERROR_REQUIRED_MISSING]: "default.blank.message",
      [ERROR_INVALID_INTEGER]: "typeMismatch.java.math.BigInteger",
      [ERROR_INVALID_DECIMAL]: "typeMismatch.java.math.BigDecimal",
      [ERROR_INVALID_DATE]: "typeMismatch.java.util.Date",
      [ERROR_INVALID_EMAIL]: "default.invalid.email.message",
      [ERROR_INVALID_URL]: "default.invalid.url.message",
      [ERROR_REGEX_DOESNT_MATCH]: "default.doesnt.match.message"
    }

    // crud internal translations for errors
    if (errorMessages[id]) {
      return i18n.getMessage(errorMessages[id], args)
    }

    // try to find a translation defined by model
    return getModelMessage({
      i18n,
      key: `model.field.${fieldName}.error.${id}`,
      args,
      defaultMessage: message || id
    })
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
