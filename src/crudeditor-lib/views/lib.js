import React from 'react';
import cloneDeep from 'lodash/cloneDeep';

import GenericInput from '../../components/GenericInput';
import RangeInput from '../../components/RangeInput';
import deferValueSync from '../../components/DeferValueSyncHOC';

import {
  converter,
  validate as standardFieldValidate
} from '../../data-types-lib';

import {
  DEFAULT_TAB_COLUMNS,
  VIEW_EDIT,
  VIEW_SHOW,
  OPERATION_SHOW,
  OPERATION_EDIT,
  OPERATION_DELETE
} from '../common/constants';

import {
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_INTEGER,
  FIELD_TYPE_DECIMAL,
  FIELD_TYPE_STRING,
  FIELD_TYPE_STRING_DATE,
  FIELD_TYPE_STRING_INTEGER,
  FIELD_TYPE_STRING_DECIMAL,

  FIELD_TYPE_STRING_DATE_RANGE,
  FIELD_TYPE_INTEGER_RANGE,
  FIELD_TYPE_DECIMAL_RANGE,
  FIELD_TYPE_STRING_INTEGER_RANGE,
  FIELD_TYPE_STRING_DECIMAL_RANGE,

  UI_TYPE_BOOLEAN,
  UI_TYPE_DATE,
  UI_TYPE_STRING,

  UI_TYPE_DATE_RANGE_OBJECT,
  UI_TYPE_STRING_RANGE_OBJECT
} from '../../data-types-lib/constants';

const standardOperations = [OPERATION_SHOW, OPERATION_EDIT, OPERATION_DELETE];

export const
  COMPONENT_NAME_INPUT = 'input',
  COMPONENT_NAME_RANGE_INPUT = 'rangeInput';

/*
 * The function receives render object with component name in "component" property.
 * It returns React Component with the name and UI Type corrresponding to the Component.
 * As side effect, it also assigns default "type" to render.props, if not specified.
 */
const namedComponentInfo = ({
  component: name,
  props
}) => {
  let component, uiType, valuePropName;

  switch (name) {
    case COMPONENT_NAME_INPUT:
      component = deferValueSync(GenericInput);
      valuePropName = 'value';

      if (!props.hasOwnProperty('type')) {
        props.type = 'string'; // eslint-disable-line no-param-reassign
      }

      switch (props.type) {
        case 'checkbox':
          uiType = UI_TYPE_BOOLEAN;
          break;
        case 'date':
          uiType = UI_TYPE_DATE;
          break;
        case 'string':
          uiType = UI_TYPE_STRING;
          break;
        default:
          throw new TypeError(`Unknown type "${props.type}" of "${COMPONENT_NAME_INPUT}" render component`);
      }

      break;
    case COMPONENT_NAME_RANGE_INPUT:
      component = deferValueSync(RangeInput);
      valuePropName = 'value';

      if (!props.hasOwnProperty('type')) {
        props.type = 'string'; // eslint-disable-line no-param-reassign
      }

      switch (props.type) {
        case 'date':
          uiType = UI_TYPE_DATE_RANGE_OBJECT;
          break;
        case 'string':
          uiType = UI_TYPE_STRING_RANGE_OBJECT;
          break;
        default:
          throw new TypeError(`Unknown type "${props.type}" of "${COMPONENT_NAME_RANGE_INPUT}" render component`);
      }

      break;
    default:
      throw new TypeError(`Unknown render component "${name}"`);
  }

  return {
    component,
    uiType,
    valuePropName
  };
}

const defaultFieldRenders = {
  [FIELD_TYPE_BOOLEAN]: {
    component: 'input',
    props: {
      type: 'checkbox'
    }
  },
  [FIELD_TYPE_INTEGER]: {
    component: 'input',
    props: {
      type: 'string'
    }
  },
  [FIELD_TYPE_DECIMAL]: {
    component: 'input',
    props: {
      type: 'string'
    }
  },
  [FIELD_TYPE_STRING]: {
    component: 'input',
    props: {
      type: 'string'
    }
  },
  [FIELD_TYPE_STRING_DATE]: {
    component: 'input',
    props: {
      type: 'date'
    }
  },
  [FIELD_TYPE_STRING_INTEGER]: {
    component: 'input',
    props: {
      type: 'string'
    }
  },
  [FIELD_TYPE_STRING_DECIMAL]: {
    component: 'input',
    props: {
      type: 'string'
    }
  },
  [FIELD_TYPE_INTEGER_RANGE]: {
    component: 'rangeInput',
    props: {
      type: 'string'
    }
  },
  [FIELD_TYPE_DECIMAL_RANGE]: {
    component: 'rangeInput',
    props: {
      type: 'string'
    }
  },
  [FIELD_TYPE_STRING_DATE_RANGE]: {
    component: 'rangeInput',
    props: {
      type: 'date'
    }
  },
  [FIELD_TYPE_STRING_INTEGER_RANGE]: {
    component: 'rangeInput',
    props: {
      type: 'string'
    }
  },
  [FIELD_TYPE_STRING_DECIMAL_RANGE]: {
    component: 'rangeInput',
    props: {
      type: 'string'
    }
  }
};

// █████████████████████████████████████████████████████████████████████████████████████████████████████████

export const buildFieldRender = ({
  render: customRender,
  type: fieldType
}) => {
  const render = customRender ?
    cloneDeep(customRender) :
    defaultFieldRenders[fieldType] || (_ => {
      throw new TypeError(
        `Field type ${fieldType} is unknown or does not have an assigned render component. Define custom component`
      );
    })();

  if (!render.hasOwnProperty('component')) {
    throw new TypeError('render.component must be defined');
  }
  if (!render.hasOwnProperty('props')) {
    render.props = {};
  }

  if (!render.hasOwnProperty('valueProp')) {
    render.valueProp = {};
  }

  let Component;

  if (typeof render.component === 'string') {
    const { component, uiType, valuePropName } = namedComponentInfo(render);

    if (!render.valueProp.hasOwnProperty('type')) {
      render.valueProp.type = uiType;
    } else if (render.valueProp.type !== uiType) {
      throw new TypeError(`Invalid "${render.valueProp.type}" valueProp.type for "${render.component}" component`);
    }

    if (!render.valueProp.hasOwnProperty('name')) {
      render.valueProp.name = valuePropName;
    } else if (render.valueProp.name !== valuePropName) {
      throw new TypeError(`Invalid "${render.valueProp.name}" valueProp.name for "${render.component}" component`);
    }

    Component = component;
  } else {
    Component = render.component;
  }

  if (!render.valueProp.hasOwnProperty('name')) {
    render.valueProp.name = 'value';
  }

  if (render.valueProp.hasOwnProperty('type')) {
    if (!render.valueProp.hasOwnProperty('converter')) {
      const defaultConverter = converter({
        fieldType,
        uiType: render.valueProp.type
      });

      if (defaultConverter) {
        render.valueProp.converter = defaultConverter;
      }
    }

    // Removing "type" because it was only needed to get default converter, if any.
    // delete render.valueProp.type;
  }

  if (!render.valueProp.hasOwnProperty('converter')) {
    render.valueProp.converter = {
      format: ({ value }) => value,
      parse: ({ value }) => value
    };
  }

  return {
    ...render,
    component: ({ children, ...props }) => <Component {...props} {...render.props}>{children}</Component>
  };
};

// █████████████████████████████████████████████████████████████████████████████████████████████████████████

const buildDefaultFormLayout = ({ viewName, fieldsMeta }) => _ => Object.keys(fieldsMeta).map(name => ({
  field: name,
  readOnly: viewName === VIEW_EDIT && fieldsMeta[name].unique, // Logical Key fields are read-only in Edit View.
  render: buildFieldRender({
    type: fieldsMeta[name].type
  }),
  validate: standardFieldValidate({
    type: fieldsMeta[name].type,
    constraints: fieldsMeta[name].constraints
  }) ||
    (value => true)
}));

// █████████████████████████████████████████████████████████████████████████████████████████████████████████

const buildFieldLayout = (viewName, fieldsMeta) =>
  ({
    name: fieldName,
    readOnly,
    render,
    validate: customValidate
  }) => ({
    field: fieldName,

    // making all fields read-only in "show" view.
    readOnly: viewName === VIEW_SHOW || !!readOnly,

    validate: customValidate ||
      standardFieldValidate({
        type: fieldsMeta[fieldName].type,
        constraints: fieldsMeta[fieldName].constraints
      }) ||
      (value => true),

    // assigning default component to fields w/o custom component.
    render: buildFieldRender({
      render,
      type: fieldsMeta[fieldName].type
    })
  });

// █████████████████████████████████████████████████████████████████████████████████████████████████████████

const sectionLayout = ({ name: sectionId, ...props }, ...allEntries) => {
  // entries is always an array, may be empty.
  const entries = allEntries.filter(entry => !!entry);
  entries.section = sectionId;

  Object.keys(props).forEach(name => {
    entries[name] = props[name];
  });

  return entries.length ? entries : null;
};

// █████████████████████████████████████████████████████████████████████████████████████████████████████████

const tabLayout = ({ name: tabId, columns, ...props }, ...allEntries) => {
  // entries is always an array, may be empty.
  const entries = allEntries.filter(entry => !!entry);
  entries.tab = tabId;
  entries.columns = columns || DEFAULT_TAB_COLUMNS;

  entries.forEach(entry => {
    if (entry.section && !entry.columns) {
      entry.columns = entries.columns; // eslint-disable-line no-param-reassign
    }
  });

  Object.keys(props).forEach(name => {
    entries[name] = props[name];
  });

  return entries.length || entries.component ? entries : null;
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

// viewOperations creates operations (buttons) for particular view
export const viewOperations = ({
  viewName,
  viewState,
  operations,
  softRedirectView,
  standardHandlers
}) => ({ instance, ...restArgs }) => {
  if (!viewState) { // viewState is undefined when view is not initialized yet.
    return [];
  }

  const modelOps = operations(
    instance,
    {
      name: viewName,
      state: viewState
    }
  ) || [];

  const standardOps = Object.keys(standardHandlers).
    filter(key => !modelOps.find(({ name }) => name === key)).
    reduce(
      (rez, name) => [
        ...rez,
        {
          name,
          handler: _ => standardHandlers[name]({ instance, ...restArgs })
        }
      ],
      []
    );

  return modelOps.
    filter(({ hidden }) => !hidden).
    reduce(
      (rez, { name, handler, hidden, ...rest }) => [
        ...rez,
        ...(handler ?
          [{
            name,
            ...rest,
            handler: _ => {
              const view = handler();

              if (view && view.name) {
                softRedirectView(view);
              }

              return view;
            }
          }] :
          Object.keys(standardHandlers).indexOf(name) !== -1 ?
            [{
              name,
              ...rest,
              handler: _ => standardHandlers[name]({ instance, ...restArgs })
            }] :
            []
        )
      ],
      standardOps
    )
}
