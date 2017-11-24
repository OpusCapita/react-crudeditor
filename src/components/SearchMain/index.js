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

class SearchMain extends PureComponent {
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
    console.log(hideSearchForm)

    return (
      <div className="crud--search-main">
        <h1>
          <Row>
            <Col xs={8}>
              <Button
                bsStyle="link"
                style={{ margin: '0 16px' }}
                onClick={toggleSearchForm}
              >
                <Glyphicon glyph={`chevron-${hideSearchForm ? 'right' : 'left'}`}/>
              </Button>
              {i18n.getMessage('crudEditor.search.header', { "payload": getModelMessage(i18n, 'model.name') })}
            </Col>
            <Col xs={4}>
              <div style={{ float: "right" }}>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={this.handleCreate}
                >
                  {i18n.getMessage('crudEditor.create.button')}
                </button>
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

SearchMain.propTypes = {
  model: PropTypes.shape({
    actions: PropTypes.objectOf(PropTypes.func)
  }).isRequired
}

SearchMain.contextTypes = {
  i18n: PropTypes.object
};

export default SearchMain;
