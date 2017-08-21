import buildFieldComponent from '../components/DefaultFieldInput';

import {
  AUDITABLE_FIELDS,
  VIEW_EDIT,
  VIEW_SHOW
} from '../common/constants';

const buildDefaultFormLayout = ({
  viewName,
  fieldsMeta
}) => Object.keys(fieldsMeta).
  filter(name => [VIEW_SHOW, VIEW_EDIT].includes(viewName) || !AUDITABLE_FIELDS.includes(name)).
  map(name => ({
    field: name,
    readOnly: viewName === VIEW_EDIT && (
        AUDITABLE_FIELDS.includes(name) ||  // Audiatable fields are read-only in Edit View.
        fieldsMeta[name].unique  // Logical Key fields are read-only in Edit View.
      ),
    Component: buildFieldComponent(fieldsMeta[name].type)
  }));

const buildFieldLayout = (viewName, fieldsMeta) => ({ name: fieldId, readOnly, Component }) => ({
  field: fieldId,

  // making all fields read-only in "show" view.
  readOnly: viewName === VIEW_SHOW || !!readOnly,

  // assigning default Component to fields w/o custom component.
  Component: Component || buildFieldComponent(fieldsMeta[fieldId].type)
});

const sectionLayout = ({ name: sectionId }, ...entries) => {
  // entries is always an array, may be empty.
  entries = entries.filter(entry => !!entry);
  entries.section = sectionId;
  return entries.length ? entries : null;
};

const tabLayout = ({ name: tabId, ...props }, ...entries) => {
  // entries is always an array, may be empty.
  entries = entries.filter(entry => !!entry);
  entries.tab = tabId;
  Object.entries(props).forEach(([name, value]) => entries[name] = value);
  return entries.length ? entries : null;
};

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  buildFormLayout = ({ customBuilder, viewName, fieldsMeta }) => customBuilder ?
    customBuilder({
      tab     : tabLayout,
      section : sectionLayout,
      field   : buildFieldLayout(viewName, fieldsMeta)
    }) :
    buildDefaultFormLayout(viewName, fieldsMeta),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getLogicalKeyBuilder = fieldsMeta => {
    const logicalKeyFields = Object.keys(fieldsMeta).filter(fieldName => fieldsMeta[fieldName].unique);

    return instance => logicalKeyFields.reduce(
      (rez, fieldName) => ({
        ...rez,
        [fieldName]: instance[fieldName]
      }),
      {}
    )
  };
