import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ErrorMain = ({
  model: {
    data: { errors },
    actions: { goHome }
  }
}) => (
  <div>
    {
      errors.length === 0 ?
        <h1> Unknown Error</h1> :
        errors.map(({ code, payload }, index) => (
          <div key={`error-${index}`}>
            <h1>Error {code}</h1>
            { payload ? JSON.stringify(payload) : null }
            <hr />
          </div>
        ))
    }
    <Button bsStyle='link' onClick={goHome} key="Cancel">Home</Button>
  </div>
);

ErrorMain.propTypes = {
  model: PropTypes.shape({
    data: PropTypes.shape({
      errors: PropTypes.array
    })
  })
}

export default ErrorMain;
