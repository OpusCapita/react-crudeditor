import React from 'react';

import Heading from '../Heading';
import Tab from '../Tab';
import Section from '../../../../../components/EditSection';
import Field from '../Field';

import connect from '../../../../connect';
import { VIEW_NAME } from '../../constants';

import {
  getActiveEntries,
  getActiveTab,
  getFormInstance
} from '../../selectors';

import {
  FORM_ENTRY_MODE_DISABLED,
  FORM_ENTRY_MODE_READONLY
} from '../../../../common/constants';

const formatEntries = ({ section, field, readOnly, entries, Component }) => field ? {
  Entry: Field,
  props: {
    entry: {
      name: field,
      readOnly,
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

const EditView = ({
  activeEntries,
  activeTab: {
    Component: ActiveTabComponent
  } = {},
  formInstance
}) =>
  <div>
    <Heading title='Edit'/>
    {ActiveTabComponent ?
      <ActiveTabComponent viewName={VIEW_NAME} instance={formInstance} /> :
      <Tab viewName={VIEW_NAME}>
        {
          activeEntries.map(formatEntries).map(({ Entry, props, fields }, supIndex) =>
            <Entry key={supIndex} {...props}>  {/* either Section or top-level Field */}
              {
                fields && fields.map(({ props }, subIndex) =>
                  <Field key={`${supIndex}_${subIndex}`} {...props} />
                )
              }
            </Entry>
          )
        }
      </Tab>
    }
  </div>;

export default connect({
  activeEntries: getActiveEntries,
  activeTab: getActiveTab,
  formInstance: getFormInstance
})(EditView);
