import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import {
  Nav,
  NavItem,
  Col,
  Row,
  ButtonGroup,
  Button
} from 'react-bootstrap';
import makeButtonWithConfirm from './buttonWithConfirm';
import { getModelMessage } from '../lib';

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

    const title = i18n.getMessage(
      `crudEditor.${viewName.toLowerCase()}.header`,
      { modelName: getModelMessage(i18n, 'model.name') }
    )

    // compare persistent and form instances to decide weither to show confirm box or not
    const showDialog = _ => formInstance && !isEqual(formInstance, persistentInstance);

    const arrowLeft = makeButtonWithConfirm({
      glyph: 'arrow-left',
      handleFunc: gotoPrevInstance,
      title: "You have unsaved changes",
      message: i18n.getMessage('crudEditor.unsaved.confirmation'),
      textConfirm: i18n.getMessage('crudEditor.confirm.action'),
      textCancel: i18n.getMessage('crudEditor.cancel.button'),
      showDialog
    });
    const arrowRight = makeButtonWithConfirm({
      glyph: 'arrow-right',
      handleFunc: gotoNextInstance,
      title: "You have unsaved changes",
      message: i18n.getMessage('crudEditor.unsaved.confirmation'),
      textConfirm: i18n.getMessage('crudEditor.confirm.action'),
      textCancel: i18n.getMessage('crudEditor.cancel.button'),
      showDialog
    });

    return (<div style={{ marginBottom: '15px' }}>
      <h1>
        <Row>
          <Col xs={8}>
            {title}
            &nbsp;
            {instanceLabel && <small>{instanceLabel}</small>}
          </Col>
          <Col xs={4}>
            <div style={{ float: "right" }}>
              <ButtonGroup>
                { crudOperations.view &&
                  <Button bsStyle='link' onClick={exitView}>
                    {i18n.getMessage('crudEditor.search.result.label')}
                  </Button>
                }
                {arrowLeft}
                {arrowRight}
              </ButtonGroup>
            </div>
          </Col>
        </Row>
      </h1>


      <br />
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

