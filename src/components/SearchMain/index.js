import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from '../SearchForm';
import Result from '../SearchResult';

import './SearchMain.less';

class SearchMain extends Component {
  handleCreate = (e) => {
    this.props.model.actions.createInstance();
  }

  render() {
    const { model } = this.props;

    return (
      <div className="crud--search-main">
        <div className="crud--search-main__page-header">
          <h3 className="crud--search-main__page-title">{this.context.i18n.getMessage('model.name')} Editor</h3>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={this.handleCreate}
          >
            {this.context.i18n.getMessage('crudEditor.create.button')}
          </button>
        </div>

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
  }
}

SearchMain.propTypes = {
  model: PropTypes.shape({
    actions: PropTypes.objectOf(PropTypes.func)
  }).isRequired
}

SearchMain.contextTypes = {
  i18n: PropTypes.object
};

export default SearchMain;
