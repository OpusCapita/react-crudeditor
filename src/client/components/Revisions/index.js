import React from 'react';
import { Link } from 'react-router-dom';

export default ({
  match: {
    params: {
      entityId
    }
  }
}) =>
  <div>
    <h2>Revisions for {entityId}</h2>
    <br/>
    <Link to='/crud/contracts'>
      Back to Contracts
    </Link>
  </div>;
