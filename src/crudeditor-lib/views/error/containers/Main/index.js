import React from 'react';

import connect from '../../../../connect';
import { getErrorInfo } from '../../selectors';

const ErrorView = ({
  errorInfo: {
    code,
    payload
  }
}) =>
  <div>
    <h1>Error {code}</h1>
    { payload }
  </div>;

export default connect({
  errorInfo: getErrorInfo
})(ErrorView);
