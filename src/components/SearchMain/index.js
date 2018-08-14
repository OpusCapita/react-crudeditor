import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Form from '../SearchForm';
import Result from '../SearchResult';
import { getModelMessage } from '../lib';
import './SearchMain.less';

export default class SearchMain extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      actions: PropTypes.objectOf(PropTypes.func),
      data: PropTypes.shape({
        hideSearchForm: PropTypes.bool
      }),
      uiConfig: PropTypes.shape({
        headerLevel: PropTypes.number
      })
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  }

  render() {
    const { model } = this.props;

    const {
      data: {
        hideSearchForm
      },
      actions: {
        toggleSearchForm,
        createInstance
      },
      uiConfig: {
        headerLevel = 1
      }
    } = model;

    const { i18n } = this.context;
    const H = 'h' + headerLevel;

    return (
      <div className="crud--search-main">
        <H>
          <div className="row">
            <div className="col-xs-8">

              {getModelMessage({ i18n, key: 'model.name' })}

              <button
                type="button"
                className="btn btn-link"
                onClick={toggleSearchForm}
                title={i18n.getMessage(`crudEditor.search.${hideSearchForm ? 'show' : 'hide'}SearchForm`)}
              >
                <span className={`small glyphicon glyphicon-chevron-${hideSearchForm ? 'right' : 'left'}`}></span>
              </button>
            </div>
            <div className="col-xs-4">
              <div style={{ float: "right" }}>
                {
                  createInstance &&
                  <button
                    type="button"
                    className="btn btn-sm btn-default"
                    onClick={createInstance}
                  >
                    {i18n.getMessage('crudEditor.create.button')}
                  </button>
                }
              </div>
            </div>
          </div>
        </H>

        <div className="crud--search-main__container">
          <div className={ hideSearchForm ?
            "crud--search-main__search-container" :
            "crud--search-main__search-container form-open"
          }
          >
            <Form model={model} />
          </div>

          <div className={ hideSearchForm ?
            "crud--search-main__results-container" :
            "crud--search-main__results-container form-open"
          }
          >
            <Result model={model} />
          </div>
        </div>
      </div>
    );
  }
}
