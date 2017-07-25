import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

import EditForm from '../EditForm';
import connect from '../../../../connect';
import { selectTab } from '../../actions';

import {
  constants as commonConstants,
  selectors as commonSelectors
} from '../../../../common';

import {
  getActiveTab,
  getFormInstance,
  getInstanceDescription,
  getTabs
} from '../../selectors';

const { getEntityName } = commonSelectors;
const { FORM_ENTRY_MODE_DISABLED } = commonConstants;

const EditView = ({
  entityName,
  instanceDescription,
  tabs,
  activeTab: {
    Component: ActiveTabComponent,
    tab: activeTabName
  } = {},
  formInstance,
  view: viewName,
  selectTab
}) =>
  <div>
    <h1>
      {
        viewName.charAt(0).toUpperCase() + viewName.slice(1) + ' ' + entityName
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
        <ActiveTabComponent view={viewName} instance={formInstance} /> :
        <EditForm view={viewName} />
    }
  </div>;


export default connect({
  entityName          : getEntityName,
  instanceDescription : getInstanceDescription,
  tabs                : getTabs,
  activeTab           : getActiveTab,
  formInstance        : getFormInstance
}, {
  selectTab
})(EditView);
