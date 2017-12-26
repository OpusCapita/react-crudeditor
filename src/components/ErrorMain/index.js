import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ErrorMain = ({
  model: {
    data: {
      errors
    },
    actions: {
      goHome
    },
    uiConfig: {
      headerLevel = 1
    }
  }
}) => {
  const H = 'h' + headerLevel;

  return (
    <div>
      {
        errors.length === 0 ?
          <H>Unknown Error</H> :
          errors.map(({ code, payload }, index) => (
            <div key={`error-${index}`}>
              <H>Error {code}</H>
              { payload ? JSON.stringify(payload) : null }
              <hr />
            </div>
          ))
      }
      {
        goHome &&
        <Button bsStyle='link' onClick={goHome} key="Cancel">
          Home
        </Button>
      }
    </div>
  );
};

ErrorMain.propTypes = {
  model: PropTypes.shape({
    actions: PropTypes.shape({
      goHome: PropTypes.func.isRequired
    }),
    data: PropTypes.shape({
      errors: PropTypes.arrayOf(PropTypes.object).isRequired
    }),
    uiConfig: PropTypes.object.isRequired
  }).isRequired
}

export default ErrorMain;
