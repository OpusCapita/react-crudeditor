import React from 'react';

import { connect } from 'react-redux';
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

export default connect(
  storeState => getErrorInfo(storeState)
)(ErrorView);
