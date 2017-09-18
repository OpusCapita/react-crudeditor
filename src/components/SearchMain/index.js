import React from 'react';

import Form from '../SearchForm';
import Result from '../SearchResult';

import './SearchMain.less';

export default ({ model }) => (
  <div>
    <h3>Search {model.data.entityName}</h3>
    <div className="crud--search-main__container">
      <div className="crud--search-main__search-container">
        <Form model={model} />
      </div>
      <div className="crud--search-main__results-container">
        <Result model={model} />
      </div>
    </div>
  </div>
);
