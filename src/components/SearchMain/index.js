import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Form from '../SearchForm';
import Result from '../SearchResult';
import { getModelMessage } from '../lib'
import './SearchMain.less';

export default class SearchMain extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      actions: PropTypes.objectOf(PropTypes.func),
      data: PropTypes.shape({
        permissions: PropTypes.shape({
          crudOperations: PropTypes.object.isRequired
        })
      })
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  handleCreate = (e) => {
    this.props.model.actions.createInstance();
  }

  render() {
    const { model } = this.props;
    const { i18n } = this.context;
    const canCreate = model.data.permissions.crudOperations.create;

    return (
      <div className="crud--search-main">
        <div className="crud--search-main__page-header">
          <h1 className="crud--search-main__page-title">
            {i18n.getMessage('crudEditor.search.header', { "payload": getModelMessage(i18n, 'model.name') })}
          </h1>
          { canCreate &&
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={this.handleCreate}
            >
              {i18n.getMessage('crudEditor.create.button')}
            </button>
          }
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
