import React from 'react';
import { Link } from 'react-router-dom';

export default () =>
  <div>
    <h2>Home-Sweet-Home</h2>
    <br/>
    <Link to='/crud/contracts'>
      Contracts
    </Link>
  </div>;
