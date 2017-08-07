import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

export default ({
  entityName,
  instanceDescription,
  tabs,
  activeTab: {
    tab: activeTabName
  } = {},
  selectTab,
  title
}) =>
  <div>
    <h1>
      { title + ' ' + entityName }
      &nbsp;
      { instanceDescription && <small>{instanceDescription}</small> }
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
