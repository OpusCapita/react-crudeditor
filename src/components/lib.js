import Section from './EditSection';
import Field from './EditField';

export const formatEntry = entry => entry.field ? {
  Entry: Field,
  props: {
    entry: {
      name: entry.field,
      readOnly: entry.readOnly,
      Component: entry.render.Component,
      valuePropName: entry.render.valueProp.name
    }
  }
} : {
  Entry: Section,
  fields: entry.map(formatEntry), // Section always has at least one field.
  props: {
    title: entry.section.replace(/(^|\s)[a-z]/g, char => char.toUpperCase())
  }
};
