import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

import Form from '../Form';
import Section from '../Section';
import Field from '../Field';

import connect from '../../../../connect';
import { selectTab } from '../../actions';
import { VIEW_NAME } from '../../constants';
import { getEntityName } from '../../../../common/selectors';

import {
  getActiveEntries,
  getActiveTab,
  getFormInstance,
  getInstanceDescription,
  getTabs,
  getViewName
} from '../../selectors';

import {
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW,
  FORM_ENTRY_MODE_DISABLED
} from '../../../../common/constants';

const formatEntries = ({ section, field, mode, entries, Component }) => field ? {
  Entry: Field,
  props: {
    entry: {
      name: field,
      mode,
      Component
    }
  }
} : {
  Entry: Section,
  fields: entries.map(formatEntries),  // Section always has at least one field.
  props: {
    title: section.replace(/(^|\s)[a-z]/g, char => char.toUpperCase())
  }
};

export default connect({
  activeEntries       : getActiveEntries,
  entityName          : getEntityName,
  instanceDescription : getInstanceDescription,
  tabs                : getTabs,
  activeTab           : getActiveTab,
  formInstance        : getFormInstance
}, {
  selectTab
})(({
  activeEntries,
  entityName,
  instanceDescription,
  tabs,
  activeTab: {
    Component: ActiveTabComponent,
    tab: activeTabName
  } = {},
  formInstance,
  selectTab
}) => {
  const title = VIEW_NAME === VIEW_CREATE && 'Create' ||
    VIEW_NAME === VIEW_EDIT && 'Edit' ||
    VIEW_NAME === VIEW_SHOW && 'Show';

  return (
    <div>
      <h1>
        { title +' ' + entityName }
        &nbsp;
        { instanceDescription && <small>{instanceDescription}</small> }
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
          <Form>
            {activeEntries.map(formatEntries).map(({ Entry, props, fields }, supIndex) =>
              <Entry key={supIndex} {...props}>  {/* either Section or top-level Field */}
                {fields && fields.map(({ props }, subIndex) =>
                  <Field key={`${supIndex}_${subIndex}`} {...props} />
                )}
              </Entry>
            )}
          </Form>
      }
    </div>
  );
});
