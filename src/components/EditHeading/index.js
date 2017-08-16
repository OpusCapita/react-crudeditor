import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

export default ({
  model: {
    data: {
      activeTab: {
        tab: activeTabName
      } = {},
      entityName,
      objectLabel,
      tabs,
      viewName
    },
    actions: {
      selectTab
    }
  }
}) =>
  <div>
    <h1>
      { viewName.replace(/(^|\s)[a-z]/g, char => char.toUpperCase()) + ' ' + entityName }
      &nbsp;
      { objectLabel && <small>{objectLabel}</small> }
    </h1>
    <br />
    {
      tabs.length && <Nav bsStyle='tabs' activeKey={activeTabName} onSelect={selectTab}>
        {
          tabs.map(({ tab: name, disabled }, index) =>
            <NavItem eventKey={name} disabled={disabled} key={index}>
              {
                name.replace(/(^|\s)[a-z]/g, char => char.toUpperCase())
              }
            </NavItem>
          )
        }
      </Nav>
    }
  </div>;
