import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Form from '../SearchForm';
import Result from '../SearchResult';
import { getModelMessage } from '../lib'
import './SearchMain.less';

class SearchMain extends PureComponent {
  handleCreate = (e) => {
    this.props.model.actions.createInstance();
  }

  render() {
    const { model } = this.props;
    const { i18n } = this.context;

    return (
      <div className="crud--search-main">
        <div className="crud--search-main__page-header">
          <h3 className="crud--search-main__page-title">
            {i18n.getMessage('crudEditor.search.header', { "payload": getModelMessage(i18n, 'model.name') })}
          </h3>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={this.handleCreate}
          >
            {i18n.getMessage('crudEditor.create.button')}
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
