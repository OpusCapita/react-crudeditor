import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { getModelMessage } from '../lib';
import { VIEW_CREATE } from '../../crudeditor-lib/common/constants';
import ConfirmUnsavedChanges from '../ConfirmDialog/ConfirmUnsavedChanges';
import {
  Nav,
  NavItem,
  Col,
  Row,
  ButtonGroup,
  Button,
  Glyphicon
} from 'react-bootstrap';

export default class EditHeading extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.object,
      actions: PropTypes.objectOf(PropTypes.func),
      uiConfig: PropTypes.object.isRequired
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

  showConfirmDialog = _ => {
    const {
      formInstance,
      persistentInstance
    } = this.props.model.data;
    // compare persistent and form instances to decide weither to show confirm box or not
    return formInstance && !isEqual(formInstance, persistentInstance);
  }

  render() {
    const {
      model: {
        data: {
          activeTab: {
            tab: activeTabName
          } = {},
          instanceLabel,
          tabs,
          viewName,
          permissions: {
            crudOperations: permissions
          }
        },
        actions: {
          selectTab,
          exitView,
          gotoNextInstance,
          gotoPrevInstance
        },
        uiConfig: {
          headerLevel = 1
        }
      }
    } = this.props;

    const { i18n } = this.context;

    const title = permissions.view ?
      (
        <ConfirmUnsavedChanges showDialog={this.showConfirmDialog}>
          <a style={{ cursor: 'pointer' }} onClick={exitView}>
            {getModelMessage(i18n, 'model.name')}
          </a>
        </ConfirmUnsavedChanges>
      ) :
      getModelMessage(i18n, 'model.name');

    const arrows = [
      <ConfirmUnsavedChanges showDialog={this.showConfirmDialog} key='arrow-left'>
        <Button
          disabled={!gotoPrevInstance}
          onClick={gotoPrevInstance}
        >
          <Glyphicon glyph="arrow-left"/>
        </Button>
      </ConfirmUnsavedChanges>,
      <ConfirmUnsavedChanges showDialog={this.showConfirmDialog} key='arrow-right'>
        <Button
          disabled={!gotoNextInstance}
          onClick={gotoNextInstance}
        >
          <Glyphicon glyph="arrow-right"/>
        </Button>
      </ConfirmUnsavedChanges>
    ]

    const H = 'h' + headerLevel;

    return (<div style={{ marginBottom: '10px' }}>
      <H>
        <Row>
          <Col xs={8}>
            {title}
            {
              (instanceLabel || viewName === VIEW_CREATE) &&
              <small>
                {' / ' + (viewName === VIEW_CREATE ? i18n.getMessage('crudEditor.new.title') : instanceLabel)}
              </small>
            }
          </Col>
          <Col xs={4}>
            <div style={{ float: "right" }}>
              <ButtonGroup>
                {arrows}
              </ButtonGroup>
            </div>
          </Col>
        </Row>
      </H>

      {
        tabs.length > 1 && <Nav bsStyle='tabs' activeKey={activeTabName} onSelect={selectTab}>
          {
            tabs.map(({ tab: name, disabled }, index) =>
              (<NavItem eventKey={name} disabled={!!disabled} key={index}>
                <h4>{getModelMessage(i18n, `model.tab.${name}`, name)}</h4>
              </NavItem>)
            )
          }
        </Nav>
      }
    </div>);
  }
}

