import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Glyphicon,
  Row,
  Col
} from 'react-bootstrap';
import Form from '../SearchForm';
import Result from '../SearchResult';
import { getModelMessage } from '../lib';
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
    const {
      data: {
        hideSearchForm,
        permissions: {
          crudOperations: {
            create: canCreate
          }
        }
      },
      actions: {
        toggleSearchForm
      }
    } = model;
    const { i18n } = this.context;

    return (
      <div className="crud--search-main">
        <h1>
          <Row>
            <Col xs={8}>

              {getModelMessage(i18n, 'model.name')}

              <Button
                bsStyle="link"
                onClick={toggleSearchForm}
                title={i18n.getMessage(`crudEditor.search.${hideSearchForm ? 'show' : 'hide'}SearchForm`)}
              >
                <Glyphicon glyph={`chevron-${hideSearchForm ? 'right' : 'left'}`} className="small"/>
              </Button>
            </Col>
            <Col xs={4}>
              <div style={{ float: "right" }}>
                {
                  canCreate &&
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={this.handleCreate}
                >
                  {i18n.getMessage('crudEditor.create.button')}
                </button>
                }
              </div>
            </Col>
          </Row>
        </h1>

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
