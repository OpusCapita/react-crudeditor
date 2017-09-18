import React from 'react';

import Form from '../SearchForm';
import Result from '../SearchResult';

import './SearchMain.less';

export default ({ model }) => (
  <div className="crud--search-main">
    <h4 className="crud--search-main__search-title">{model.data.entityName} Search</h4>

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
