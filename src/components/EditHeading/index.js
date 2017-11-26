import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import {
  Nav,
  NavItem,
  Col,
  Row,
  ButtonGroup,
  Button,
  Glyphicon
} from 'react-bootstrap';
import ConfirmDialog from '../ConfirmDialog';
import { getModelMessage } from '../lib';
import { VIEW_CREATE } from '../../crudeditor-lib/common/constants';

export default class EditHeading extends PureComponent {
  static propTypes = {
    model: PropTypes.shape({
      data: PropTypes.object,
      actions: PropTypes.objectOf(PropTypes.func)
    }).isRequired
  }

  static contextTypes = {
    i18n: PropTypes.object
  };

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
          persistentInstance,
          formInstance,
          permissions: {
            crudOperations
          }
        },
        actions: {
          selectTab,
          exitView,
          gotoNextInstance,
          gotoPrevInstance
        }
      }
    } = this.props;

    const { i18n } = this.context;

    const title = (crudOperations.view ?
      (<a style={{ cursor: 'pointer' }} onClick={exitView}>
        {getModelMessage(i18n, 'model.name')}
      </a>) :
      getModelMessage(i18n, 'model.name'));

    // compare persistent and form instances to decide weither to show confirm box or not
    const showDialog = _ => formInstance && !isEqual(formInstance, persistentInstance);

    const arrowLeft = (
      <ConfirmDialog
        trigger='click'
        onConfirm={gotoPrevInstance}
        title="You have unsaved changes"
        message={i18n.getMessage('crudEditor.unsaved.confirmation')}
        textConfirm={i18n.getMessage('crudEditor.confirm.action')}
        textCancel={i18n.getMessage('crudEditor.cancel.button')}
        showDialog={showDialog}
      >
        <Button disabled={!gotoPrevInstance}>
          <Glyphicon glyph="arrow-left"/>
        </Button>
      </ConfirmDialog>
    )

    const arrowRight = (
      <ConfirmDialog
        trigger='click'
        onConfirm={gotoNextInstance}
        title="You have unsaved changes"
        message={i18n.getMessage('crudEditor.unsaved.confirmation')}
        textConfirm={i18n.getMessage('crudEditor.confirm.action')}
        textCancel={i18n.getMessage('crudEditor.cancel.button')}
        showDialog={showDialog}
      >
        <Button disabled={!gotoNextInstance}>
          <Glyphicon glyph="arrow-right"/>
        </Button>
      </ConfirmDialog>
    )

    return (<div style={{ marginBottom: '10px' }}>
      <h1>
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
                {arrowLeft}
                {arrowRight}
              </ButtonGroup>
            </div>
          </Col>
        </Row>
      </h1>

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

