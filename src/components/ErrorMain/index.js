import React from 'react';
import PropTypes from 'prop-types';

const ErrorMain = ({
  model: {
    data: errors
  }
}) =>
  (<div>
    {errors.map(({ code, payload }, index) =>
      (<div key={`error-${index}`}>
        <h1>Error {code}</h1>
        { payload ? JSON.stringify(payload) : null }
      </div>)
    )}
  </div>);

ErrorMain.propTypes = {
  model: PropTypes.shape({
    data: PropTypes.shape({
      errors: PropTypes.object
    })
  })
}

export default ErrorMain;
