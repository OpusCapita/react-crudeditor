import React from 'react';

import Form from '../SearchForm';
import Result from '../SearchResult';

export default ({ model }) =>
  <div>
    <h1>Search {model.entityName}</h1>
    <Form model={model} />
    <Result model={model} />
  </div>;
