import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Nav,
  NavItem,
  Col,
  Row,
  ButtonGroup,
  Button,
  Glyphicon
} from 'react-bootstrap';
import { getTabText } from '../lib';

class EditHeading extends PureComponent {
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
          editNextInstance,
          editPrevInstance
        }
      }
    } = this.props;

    const { i18n } = this.context;

    const title = i18n.getMessage(
      `crudEditor.${viewName.toLowerCase()}.header`,
      { modelName: i18n.getMessage('model.name') }
    )

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
                <Button bsStyle='link' onClick={exitView}>
                  {i18n.getMessage('crudEditor.search.result.label')}
                </Button>
                <Button
                  onClick={editPrevInstance}
                  disabled={editPrevInstance === undefined}
                >
                  <Glyphicon glyph="arrow-left" />
                </Button>
                <Button
                  onClick={editNextInstance}
                  disabled={editNextInstance === undefined}
                >
                  <Glyphicon glyph="arrow-right" />
                </Button>
              </ButtonGroup>
            </div>
          </Col>
        </Row>
      </h1>


      <br />
      {
        tabs.length !== 0 && <Nav bsStyle='tabs' activeKey={activeTabName} onSelect={selectTab}>
          {
            tabs.map(({ tab: name, disabled }, index) =>
              (<NavItem eventKey={name} disabled={!!disabled} key={index}>
                {
                  getTabText(i18n, name)
                }
              </NavItem>)
            )
          }
        </Nav>
      }
    </div>);
  }
}

EditHeading.propTypes = {
  model: PropTypes.shape({
    data: PropTypes.object,
    actions: PropTypes.objectOf(PropTypes.func)
  }).isRequired
}

EditHeading.contextTypes = {
  i18n: PropTypes.object
};

export default EditHeading;
