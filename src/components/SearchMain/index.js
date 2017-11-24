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
        hideSearchForm
      },
      actions: {
        toggleSearchForm
      }
    } = model;
    const { i18n } = this.context;

    const canCreate = model.data.permissions.crudOperations.create;

    return (
      <div className="crud--search-main">
        <h1>
          <Row>
            <Col xs={8}>

              {getModelMessage(i18n, 'model.name')}

              <Button
                bsStyle="link"
                onClick={toggleSearchForm}
                title={`${hideSearchForm ? 'Show' : 'Hide'} search form`}
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
            "crud--search-main__search-container open"
          }
          >
            <Form model={model} />
          </div>

          <div className={ hideSearchForm ?
            "crud--search-main__results-container" :
            "crud--search-main__results-container open"
          }
          >
            <Result model={model} />
          </div>
        </div>
      </div>
    );
  }
}
