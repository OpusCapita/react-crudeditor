import React from 'react';

import Heading from '../EditHeading';
import Tab from '../EditTab';
import Section from '../EditSection';
import Field from '../EditField';

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

export default ({ model }) => {
  const ActiveTabComponent = model.data.activeTab && model.data.activeTab.Component;

  return <div>
    <Heading model={model} />
    {ActiveTabComponent ?
      <ActiveTabComponent viewName={model.data.viewName} instance={model.data.formInstance} /> :
      <Tab viewName={model.data.viewName} model={model}>
        {
          model.data.activeEntries.map(formatEntries).map(({ Entry, props, fields }, supIndex) =>
            <Entry key={supIndex} {...props} model={model}>  {/* either Section or top-level Field */}
              {
                fields && fields.map(({ props }, subIndex) =>
                  <Field key={`${supIndex}_${subIndex}`} {...props} model={model} />
                )
              }
            </Entry>
          )
        }
      </Tab>
    }
  </div>;
};
