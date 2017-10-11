import React from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem } from 'react-bootstrap';

const EditHeading = ({
  model: {
    data: {
      activeTab: {
        tab: activeTabName
      } = {},
      entityName,
      instanceLabel,
      tabs,
      viewName
    },
    actions: {
      selectTab
    }
  }
}) =>
  (<div>
    <h1>
      { viewName.replace(/(^|\s)[a-z]/g, char => char.toUpperCase()) + ' ' + entityName }
      &nbsp;
      { instanceLabel && <small>{instanceLabel}</small> }
    </h1>
    <br />
    {
      tabs.length !== 0 && <Nav bsStyle='tabs' activeKey={activeTabName} onSelect={selectTab}>
        {
          tabs.map(({ tab: name, disabled }, index) =>
            (<NavItem eventKey={name} disabled={!!disabled} key={index}>
              {
                name.replace(/(^|\s)[a-z]/g, char => char.toUpperCase())
              }
            </NavItem>)
          )
        }
      </Nav>
    }
  </div>);

EditHeading.propTypes = {
  model: PropTypes.object.isRequired
}

export default EditHeading;
