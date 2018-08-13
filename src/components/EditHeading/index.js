import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { getModelMessage, getTabLabel } from '../lib';
import { VIEW_CREATE } from '../../crudeditor-lib/common/constants';
import ConfirmUnsavedChanges from '../ConfirmDialog/ConfirmUnsavedChanges';

export default class EditHeading extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.shape({
        activeTab: PropTypes.array,
        instanceLabel: PropTypes.string,
        tabs: PropTypes.array,
        viewName: PropTypes.string.isRequired,
        persistentInstance: PropTypes.object,
        unsavedChanges: PropTypes.bool
      }),
      actions: PropTypes.objectOf(PropTypes.func),
      uiConfig: PropTypes.object.isRequired
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object.isRequired
  };

  showConfirmDialog = _ => this.props.model.data.unsavedChanges;

  render() {
    const {
      model: {
        data: {
          activeTab: {
            tab: activeTabName
          } = {},
          instanceLabel,
          tabs,
          viewName
        },
        actions: {
          selectTab,
          exitView,
          gotoPreviousInstance,
          gotoNextInstance
        },
        uiConfig: {
          headerLevel = 1
        }
      }
    } = this.props;

    const { i18n } = this.context;

    const modelName = getModelMessage({ i18n, key: 'model.name' });

    const title = exitView ?
      (
        <ConfirmUnsavedChanges showDialog={this.showConfirmDialog}>
          <a style={{ cursor: 'pointer' }} onClick={exitView}>
            {modelName}
          </a>
        </ConfirmUnsavedChanges>
      ) :
      modelName;

    const arrows = [
      <ConfirmUnsavedChanges showDialog={this.showConfirmDialog} key='arrow-left'>
        <Button
          disabled={!gotoPreviousInstance}
          onClick={gotoPreviousInstance}
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
        tabs.length > 1 &&
        <ConfirmUnsavedChanges
          trigger='select'
          showDialog={this.showConfirmDialog}
        >
          <Nav bsStyle='tabs' activeKey={activeTabName} onSelect={selectTab}>
            {
              tabs.map(({ tab: name, disabled }, index) =>
                (<NavItem
                  eventKey={name}
                  disabled={!!disabled || name === activeTabName}
                  key={index}
                >
                  <h4>
                    {
                      getTabLabel({ i18n, name })
                    }
                  </h4>
                </NavItem>)
              )
            }
          </Nav>
        </ConfirmUnsavedChanges>
      }
    </div>);
  }
}

