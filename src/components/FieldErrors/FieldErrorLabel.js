import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Label from 'react-bootstrap/lib/Label';
import Fade from 'react-bootstrap/lib/Fade';
import { getFieldErrorMessage } from '../lib';

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

  getErrorMessage = error => {
    const { i18n } = this.context;
    const { fieldName } = this.props;
    return getFieldErrorMessage({ error, i18n, fieldName });
  }

  render() {
    const { errors } = this.props;

    return (
      <div style={{ opacity: errors.length ? '1' : '0' }}>
        <Fade in={!!errors.length}>
          <Label bsStyle="danger">
            {errors.length ? this.getErrorMessage(errors[0]) : ' '}
          </Label>
        </Fade>
      </div>
    );
  }
}
