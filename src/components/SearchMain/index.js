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
import { OPERATION_CREATE } from '../../crudeditor-lib/common/constants';
import './SearchMain.less';

export default class SearchMain extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      actions: PropTypes.objectOf(PropTypes.func),
      data: PropTypes.shape({
        permissions: PropTypes.shape({
          crudOperations: PropTypes.object.isRequired
        })
      }),
      uiConfig: PropTypes.object.isRequired
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

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
      },
      uiConfig: {
        headerLevel = 1
      },
      operations: {
        standard
      }
    } = model;

    const { i18n } = this.context;
    const H = 'h' + headerLevel;

    const createOperation = standard({}).find(({ name }) => name === OPERATION_CREATE);

    const buttons = [];

    if (canCreate && createOperation) {
      const { handler, disabled } = createOperation;

      buttons.push(
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={handler}
          key='create'
          {...(disabled ? 'disabled' : null)}
        >
          {i18n.getMessage('crudEditor.create.button')}
        </button>
      )
    }

    return (
      <div className="crud--search-main">
        <H>
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
                {buttons}
              </div>
            </Col>
          </Row>
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
