import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

import Form from '../Form';
import connect from '../../../../connect';
import { selectTab } from '../../actions';
import { VIEW_NAME } from '../../constants';

import {
  getActiveTab,
  getFormInstance,
  getInstanceDescription,
  getTabs,
  getViewName
} from '../../selectors';

const { getEntityName } = commonSelectors;
const { FORM_ENTRY_MODE_DISABLED } = commonConstants;

export default connect({
  entityName          : getEntityName,
  instanceDescription : getInstanceDescription,
  tabs                : getTabs,
  activeTab           : getActiveTab,
  formInstance        : getFormInstance
}, {
  selectTab
})(({
  entityName,
  instanceDescription,
  tabs,
  activeTab: {
    Component: ActiveTabComponent,
    tab: activeTabName
  } = {},
  formInstance,
  selectTab
}) =>
  <div>
    <h1>
      {
        VIEW_NAME.charAt(0).toUpperCase() + VIEW_NAME.slice(1) + ' ' + entityName
      }
      &nbsp;
      {
        instanceDescription && <small>{instanceDescription}</small>
      }
    </h1>
    <br />
    {
      tabs.length && <Nav bsStyle='tabs' activeKey={activeTabName} onSelect={selectTab}>
        {
          tabs.map(({ tab: name, mode }, index) =>
            <NavItem eventKey={name} disabled={mode === FORM_ENTRY_MODE_DISABLED} key={index}>
              {
                name.replace(/(^|\s)[a-z]/g, char => char.toUpperCase())
              }
            </NavItem>
          )
        }
      </Nav>
    }
    {
      ActiveTabComponent ?
        <ActiveTabComponent viewName={VIEW_NAME} instance={formInstance} /> :
        <Form />
    }
  </div>
);
