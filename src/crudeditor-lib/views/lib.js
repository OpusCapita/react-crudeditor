import FieldString from '../../components/FieldString';
import FieldBoolean from '../../components/FieldBoolean';
import FieldNumber from '../../components/FieldNumber';
import FieldDate from '../../components/FieldDate';

import {
  AUDITABLE_FIELDS,
  VIEW_EDIT,
  VIEW_SHOW
} from '../common/constants';

import {
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_STRING_DATE,
  FIELD_TYPE_STRING_NUMBER,
  FIELD_TYPE_STRING,
  FIELD_TYPE_NUMBER
} from '../../data-types-lib/constants';

const defaultFieldRenders = {
  // default valueProp.type 'string' may be omitted.

  [FIELD_TYPE_BOOLEAN]: {
    Component: FieldBoolean,
    valueProp: {
      type: 'boolean'
    }
  },
  [FIELD_TYPE_STRING_DATE]: {
    Component: FieldDate,
    valueProp: {
      type: 'date'
    }
  },
  [FIELD_TYPE_STRING_NUMBER]: {
    Component: FieldString
  },
  [FIELD_TYPE_STRING]: {
    Component: FieldString
  },
  [FIELD_TYPE_NUMBER]: {
    Component: FieldNumber
  }
};

// █████████████████████████████████████████████████████████████████████████████████████████████████████████

export const buildFieldRender = ({
  render: customRender,
  type: fieldType
}) => {
  const render = customRender ||
    defaultFieldRenders[fieldType] ||
    (_ => {
      throw new TypeError(
        `Unknown field type "${fieldType}". Please, either specify known field type or use custom render`
      );
    })();

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
};

// █████████████████████████████████████████████████████████████████████████████████████████████████████████

const buildDefaultFormLayout = ({
  viewName,
  fieldsMeta
}) => _ => Object.keys(fieldsMeta).
  filter(name => ~[VIEW_SHOW, VIEW_EDIT].indexOf(viewName) || AUDITABLE_FIELDS.indexOf(name) === -1).
  map(name => ({
    field: name,
    readOnly: viewName === VIEW_EDIT && (
      !!~AUDITABLE_FIELDS.indexOf(name) || // Audiatable fields are read-only in Edit View.
        fieldsMeta[name].unique // Logical Key fields are read-only in Edit View.
    ),
    render: buildFieldRender({
      type: fieldsMeta[name].type
    })
  }));

// █████████████████████████████████████████████████████████████████████████████████████████████████████████

const buildFieldLayout = (viewName, fieldsMeta) => ({ name: fieldId, readOnly, render }) => ({
  field: fieldId,

  // making all fields read-only in "show" view.
  readOnly: viewName === VIEW_SHOW || !!readOnly,

  // assigning default Component to fields w/o custom Component.
  render: buildFieldRender({
    render,
    type: fieldsMeta[fieldId].type
  })
});

// █████████████████████████████████████████████████████████████████████████████████████████████████████████

const sectionLayout = ({ name: sectionId, columns }, ...allEntries) => {
  // entries is always an array, may be empty.
  const entries = allEntries.filter(entry => !!entry);
  entries.section = sectionId;
  entries.columns = columns;
  return entries.length ? entries : null;
};

// █████████████████████████████████████████████████████████████████████████████████████████████████████████

const tabLayout = ({ name: tabId, columns, ...props }, ...allEntries) => {
  // entries is always an array, may be empty.
  const entries = allEntries.filter(entry => !!entry);
  entries.tab = tabId;
  entries.columns = columns;

  Object.keys(props).forEach(name => {
    entries[name] = props[name];
  });

  return entries.length ? entries : null;
};

// █████████████████████████████████████████████████████████████████████████████████████████████████████████

export const buildFormLayout = ({ customBuilder, viewName, fieldsMeta }) => customBuilder ?
  customBuilder({
    tab: tabLayout,
    section: sectionLayout,
    field: buildFieldLayout(viewName, fieldsMeta)
  }) :
  buildDefaultFormLayout({ viewName, fieldsMeta });

// █████████████████████████████████████████████████████████████████████████████████████████████████████████

export const getLogicalKeyBuilder = fieldsMeta => {
  const logicalKeyFields = Object.keys(fieldsMeta).filter(fieldName => fieldsMeta[fieldName].unique);

  if (logicalKeyFields.length === 0) {
    console.error('Model should have at least one unique field');
    throw new Error('Model should have at least one unique field');
  }

  return instance => logicalKeyFields.reduce(
    (rez, fieldName) => ({
      ...rez,
      [fieldName]: instance[fieldName]
    }),
    {}
  )
};

export const findFieldLayout = fieldName => {
  const layoutWalker = layout => {
    if (layout.field === fieldName) {
      return layout;
    }

    let foundFieldLayout;

    return Array.isArray(layout) &&
      layout.some(entry => {
        foundFieldLayout = layoutWalker(entry);
        return foundFieldLayout;
      }) &&
      foundFieldLayout;
  };

  return layoutWalker;
};

export const getTab = (storeState, tabName) => {
  // The function returns tab object by tabName,
  // or default tab if tabName is not specified (i.e. falsy).

  const tabs = storeState.formLayout.filter(({ tab }) => !!tab); // [] in case of no tabs.
  let rezTab = tabs[0]; // default tab, undefined in case of no tabs.

  if (tabName) {
    tabs.some(tab => {
      if (tab.tab === tabName) {
        rezTab = tab;
        return true;
      }

      return false;
    });
  }

  return rezTab
}

// 'plusMinus' is a generator used to increment/decrement 'navigation offset' value
// to handle 'Save and Next' and next/previous navigation functionality
// usage:
// iterator = plusMinus()
// increment: iterator.next({i: 1})
// decrement: iterator.next({i: -1})
// on the first iteration iterator returns 'init' === true, you may check it
// if you need to run custom init logic
export function* plusMinus() {
  let i = 0, init = true;

  while (true) {
    const next = yield { i, init };
    if (init) {
      init = false
    }
    i += next.i
  }
}
