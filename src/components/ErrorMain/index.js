import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ErrorMain = ({
  model: {
    data: { errors },
    actions: { goHome },
    uiConfig: {
      headerLevel = 1
    }
  },
  modelDefinition: {
    permissions: {
      crudOperations
    }
  }
}) => {
  const H = 'h' + headerLevel;
  console.log(crudOperations)
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
        crudOperations.view &&
        <Button bsStyle='link' onClick={goHome} key="Cancel">
          Home
        </Button>
      }
    </div>
  );
};

ErrorMain.propTypes = {
  model: PropTypes.shape({
    actions: PropTypes.objectOf(PropTypes.func),
    data: PropTypes.shape({
      errors: PropTypes.array
    }),
    uiConfig: PropTypes.object.isRequired
  }).isRequired,
  modelDefinition: PropTypes.shape({
    permissions: PropTypes.shape({
      crudOperations: PropTypes.shape({
        create: PropTypes.bool,
        edit: PropTypes.bool,
        delete: PropTypes.bool,
        view: PropTypes.bool,
      })
    })
  })
}

export default ErrorMain;
