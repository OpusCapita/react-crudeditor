import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

import CreateForm from '../../../views/create/components/Form';
import EditForm from '../../../views/edit/components/Form';
import ShowForm from '../../../views/show/components/Form';

import connect from '../../../connect';

import {
  constants as commonConstants,
  selectors as commonSelectors
} from '../../../common';

const { getEntityName } = commonSelectors;

const {
  FORM_ENTRY_MODE_DISABLED,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
} = commonConstants;

export default connect({
  entityName: getEntityName
})(({
  entityName,
  instanceDescription,
  tabs,
  activeTab: {
    Component: ActiveTabComponent,
    tab: activeTabName
  } = {},
  formInstance,
  viewName,
  selectTab
}) => {
  const Form = viewName === VIEW_CREATE && CreateForm ||
    viewName === VIEW_EDIT && EditForm ||
    viewName === VIEW_SHOW && ShowForm;

  return (
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
          <Form />
      }
    </div>
  );
}
);
