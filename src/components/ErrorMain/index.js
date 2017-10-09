import React from 'react';

export default ({
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
