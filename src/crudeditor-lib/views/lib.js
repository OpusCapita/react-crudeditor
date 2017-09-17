import FieldString from '../../components/FieldString';
import FieldBoolean from '../../components/FieldBoolean';

import {
  AUDITABLE_FIELDS,
  VIEW_EDIT,
  VIEW_SHOW
} from '../common/constants';

import {
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_DATE,
  FIELD_TYPE_NUMBER,
  FIELD_TYPE_STRING
} from '../../data-types-lib/constants';

const defaultFieldRenders = {
  [FIELD_TYPE_BOOLEAN]: {
    Component: FieldBoolean,
    valueProp: {
      type: 'boolean'
    }
  },
  [FIELD_TYPE_DATE]: {
    Component: FieldString
  },
  [FIELD_TYPE_NUMBER]: {
    Component: FieldString
  },
  [FIELD_TYPE_STRING]: {
    Component: FieldString
  }
};

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
    render: buildFieldRender({ type: fieldsMeta[name].type })
  }));

const buildFieldLayout = (viewName, fieldsMeta) => ({ name: fieldId, readOnly, render }) => ({
  field: fieldId,

  // making all fields read-only in "show" view.
  readOnly: viewName === VIEW_SHOW || !!readOnly,

  // assigning default Component to fields w/o custom component.
  render: buildFieldRender({
    render,
    type: fieldsMeta[fieldId].type
  })
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

  buildFieldRender = ({
    render: customRender,
    type: fieldType
  }) => {
    const render = customRender ||
      defaultFieldRenders[fieldType] ||
      (_ => { throw new Error(`Unknown field type "${fieldType}"`); })();

    if (!render.valueProp) {
      render.valueProp = {};
    }

    if (!render.valueProp.name) {
      render.valueProp.name = 'value';
    }

    if (!render.valueProp.type) {
      render.valueProp.type = 'string';
    }

    return render;
  },

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
