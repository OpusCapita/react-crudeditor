import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Revisions = ({
  match: {
    params: {
      entityId
    }
  }
}) =>
  (<div>
    <h2>Revisions for {entityId}</h2>
    <br/>
    <Link to='/crud/contracts'>
      Back to Contracts
    </Link>
  </div>);

Revisions.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      entityId: PropTypes.string
    })
  })
}

export default Revisions;
