# CRUD Editor


[![CircleCI](https://circleci.com/gh/OpusCapita/react-crudeditor.svg?style=shield&circle-token=d9a917e9d6b76fc2d83928b2ec06e2297b3e05a4)](https://circleci.com/gh/OpusCapita/react-crudeditor)
[![npm version](https://img.shields.io/npm/v/@opuscapita/react-crudeditor.svg)](https://npmjs.org/package/@opuscapita/react-crudeditor)
[![Dependency Status](https://img.shields.io/david/OpusCapita/react-crudeditor.svg)](https://david-dm.org/OpusCapita/react-crudeditor)
[![NPM Downloads](https://img.shields.io/npm/dm/@opuscapita/react-crudeditor.svg)](https://npmjs.org/package/@opuscapita/react-crudeditor)
![badge-license](https://img.shields.io/github/license/OpusCapita/react-crudeditor.svg)

### Getting started

Installation:
```
npm i @opuscapita/react-crudeditor
```

Minimal setup:
```
import createEditor from '@opuscapita/react-crudeditor'
import modelDefinition from './modelDefinition'

const ContractEditor = createEditor(<Model Definition>)

// ...use it later
// <ContractEditor/>
```

### [Documentation for Editor component](https://github.com/OpusCapita/react-crudeditor/wiki/Editor-Component)

`<Model Definition>` is a single object: 
```
// modelDefinition.js
import { FIELD_TYPE_STRING } from '@opuscapita/react-crudeditor'

export default {
  model: {
    name: 'Contract',
    
    fields: {
      contractId: {
        unique: true,
        type: FIELD_TYPE_STRING,
        constraints: {
          required: true
        }
      },
      description: {
        type: FIELD_TYPE_STRING
      }
    },
    
    validate: () => true
  },
  
  permissions: {
    crudOperations: {
      create: true,
      edit: true,
      delete: true,
      view: true
    }
  },
  
  api: { get, search, delete, create, update }, // API functions
  
  ui: {
    create: { formLayout },
    edit: { formLayout },
    show: { formLayout }
  }
}
```
### [Documentation for Model Definition](https://github.com/OpusCapita/react-crudeditor/wiki/Model-Definition)

### [Demo](https://opuscapita.github.io/react-crudeditor/branches/master/?currentComponentName=ContractEditor&maxContainerWidth=100%25&showSidebar=false)

**Table of Content**

- [Terminology](#terminology)
- [Usage](#usage)
- [*EditorComponent*](#editorcomponent)
    * [props.view.name](#editorcomponent-propsviewname)
    * [props.view.state](#editorcomponent-propsviewstate)
    * [props.onTransition](#editorcomponent-propsontransition)
    * [props.externalOperations](#editorcomponent-propsexternaloperations)
    * [props.uiConfig](#editorcomponent-propsuiconfig)
- [Model Definition](#model-definition)
    * [Definition Object Structure](#definition-object-structure)
    * [FieldInputComponent](#fieldinputcomponent)
      * [Embedded FieldInputComponents](#embedded-fieldinputcomponents)
      * [Default FieldInputComponents](#default-fieldinputcomponents)
    * [FieldRenderComponent](#fieldrendercomponent)
    * [TabFormComponent](#tabformcomponent)
    * [ViewComponent](#viewcomponent)
    * [doTransition](#dotransition)
    * [i18n Translations](#i18n-translations)
- [Redux Store](#redux-store)
    * [State Structure](#state-structure)
    * [Parsing Error and Field/Instance Validation Error](#parsing-error-and-fieldinstance-validation-error)
    * [Internal Error](#internal-error)
- [*model* Property](#model-property)
    * [Search View *model* Property](#search-view-model-property)
    * [Create View *model* Property](#create-view-model-property)
    * [Edit View *model* Property](#edit-view-model-property)
    * [Show View *model* Property](#show-view-model-property)
    * [Error View *model* Property](#error-view-model-property)
- [Diagrams](#diagrams)
    * [Transitions of views and their states](#transitions-of-views-and-their-states)
    * [Data Flow](#data-flow)
- [Code Conventions](#code-conventions)
    * [Redux Actions](#redux-actions)
    * [Code Structure](#code-structure)
- [TODO](#todo)

## Redux Store

### State Structure

Every view *must* have "ready" status defined in its *constants.js* file for [onTransition](#editorcomponent-propsontransition) call to work properly.

```javascript
{
  common: {
    activeViewName: <"search"|"create"|"edit"|"show"|"error">,
  },
  views: {
    search: {

      /*
       * filter used in Search Result
       */
      resultFilter: {
        <field name>: <serializable, filter value for the field>,
        ...
      },

      /*
       * raw filter as displayed in Search Form
       * (may be equal to or different from "resultFilter")
       */
      formFilter: {
        <field name>: <serializable, filter value for the field>,
        ...
      },

      /*
       * raw filter as communicated to React Components rendering Search fields
       */
      formatedFilter: {
        <field name>: <serializable, filter value for the field formated to corresponding UI Type>,
        ...
      },

      sortParams: {
        field: <string, sort field name>,
        order: <"asc"|"desc", sort order>,
      },
      pageParams: {
        max: <natural number, search result limit>,
        offset: <whole number, search result offset>,
      }
      resultInstances: [{
        <field name>: <serializable, field value>,
        ...
      }, ...],
      selectedInstances: [
        <ref, reference to an object from "instances" array>,
        ...
      ],
      totalCount: <whole number, total number of filtered entity instances>,
      status: <"uninitialized"|"initializing"|"ready"|"searching"|"deleting"|"redirecting", search view status>,

      /*
       * Parsing and Internal Errors -- see relevant subheadings
       * (all other errors are displayed on "error" view)
       */
      errors: {
        fields: {
          <field name>: [<Parsing Error>, ...],
          ...
        },
        general: [<Internal Error>, ...]
      }
    },
    create: {
      formInstance: {
        <field name>: <serializable, field value>,
        ...
      },
      formatedInstance: {
        <field name>: <serializable, field value formated to corresponding UI Type>,
        ...
      },
      status: <"ready"|"saving", create view status>

      /*
       * Parsing, Field/Instance Validation and Internal Errors -- see relevant subheadings
       * (all other errors are displayed on "error" view)
       */
      errors: {
        fields: {
          <field name>: [<Parsing Error or Field Validation Error>, ...],
          ...
        },
        general: [<Instance Validation Error or Internal Error>, ...]
      }
    },
    edit: {

      /*
       * instance in its "canonical state", i.e. as present on the server
       */
      persistentInstance: {
        <field name>: <serializable, field value>,
        ...
      },

      /*
       * row instance as displayed in Edit Form
       */
      formInstance: {
        <field name>: <serializable, field value>,
        ...
      },

      /*
       * raw instance as communicated to React Components rendering Edit Form fields
       */
      formatedInstance: {
        <field name>: <serializable, field value formated to corresponding UI Type>,
        ...
      },

      /*
       * Either an array of arrays (representing tabs) -- for tabbed layout,
       * or an array of arrays (representing sections) and objects (representing fields) -- otherwise.
       */
      formLayout: [

          /*
           * array representing a tab. Its elements are sections/fields. The array also has props:
           * -- "tab", string with tab name,
           * -- "disabled", boolean.
           * -- "component", optional custom React Component, see TabFormComponent subheading.
           */
          [

            /*
             * array representing a section. Its elements are fields. The array also has props:
             * -- "section", string with section name.
             */
            [

              /*
               * object representing a field.
               */
              {
                field: <string, field name>,
                readOnly: <boolean>,
                component: <function, FieldInputComponent or default React Component for displaying the field>
              },
              ...
            ],
            ...
          ]
          ...
      ],

      /*
       * a ref to array representing active tab - for tabbed form layout,
       * undefined - otherwise.
       */
      activeTab: <array|undefined>,

      instanceLabel: <string, entity instance description>,
      status: <"uninitialized"|"initializing"|"ready"|"extracting"|"updating"|"deleting"|"redirecting", edit view status>,

      /*
       * Parsing, Field/Instance Validation and Internal Errors -- see relevant subheadings
       * (all other errors are displayed on "error" view)
       */
      errors: {
        fields: {
          <field name>: [<Parsing Error or Field Validation Error>, ...],
          ...
        },
        general: [<Instance Validation Error or Internal Error>, ...]
      }
    },
    show: {
      instance: {
        <field name>: <serializable, field value>,
        ...
      },
      tab: <string, active tab name>,
      status: <"uninitialized"|"initializing"|"ready"|"redirecting", show view status>,
    },
    error: {
      errors: [{
        code: <natural number, error code>,
        ?payload: <any, structure is defined by error code>
      }],
      status: <"uninitialized"|"ready"|"redirecting", error view status>
    }
  }
}
```

### Parsing Error and Field/Instance Validation Error

```javascript
{
  code: 400,
  id: <string, error id used by translation service>,
  ?message: <string, default error message - in case a translation is not provided>,
  ?args: <object, optional parameters for i18n service>
}
```

Both plain objects and instances of **Error** may be used. The error *must not* be an instance of system error constructor, like RangeError, SyntaxError, TypeError, etc.

### Internal Error

```javascript
{
  code: 500,
  id: <string, error id used by translation service>,
  message: <string, default error message in English>
}
```

All internal errors are plain objects, not instances of **Error**, **InternalError**, **TypeError**, etc.

## *model* Property

Every view passes *model* property to external React Components it uses.  The property is designed for communication with CRUD Editor and is distinct for different views.  It's important to explicitly forward the property to children if they are designed to communicate with the editor. *model* property must never be modified by React Components.

*model* property general structure:

```javascript
{
  /*
   * Dynamic collection of data from Redux store
   * linked with selectors
   * and updated every time the store state changes.
   */
  data: {...},

  /*
   * Static collection of event handlers
   * triggering async actions and Redux store state changes.
   */
  actions: {...}
}
```

### Search View *model* Property

*model* property structure set by Search View:

```javascript
{
  data: {
    entityName: <Model Definition>.model.name,
    formFilter: state.formFilter,
    formatedFilter: state.formatedFilter,
    isLoading: <boolean, whether API async operation is in progress>,
    pageParams: {
      max: state.pageParams.max,
      offset: state.pageParams.offset
    },
    resultFields: <Model Definition>.ui.search().resultFields || <array, default Result Fields>,
    resultFilter: state.resultFilter,
    resultInstances: state.resultInstances,
    searchableFields: [{
      name: <string, persistent field name>,
      component: <function, React Component for rendering Formated Instance's field>,
      valuePropName: <string, a name of component's prop with field value>,

      /*
       * Boolean, whether two react components for from-to ranging must be rendered.
       * if true, filter field value consists of two keys, "from" and "to",
       * and two distinct components are rendered for each of them.
       * NOTE: always false for custom component.
       */
      isRange: <boolean>

    }]
    selectedInstances: state.selectedInstances,
    sortParams: {
      field: state.sortParams.field,
      order: state.sortParams.order
    },
    status: state.status,
    totalCount: state.totalCount
  },
  actions: {

    /*
     * Switch to Create View
     * and populate its form fields with <Model Definition>.ui.create.defaultNewInstance if exists.
     */
    createInstance(),

    /*
     * Delete instances by asynchronously calling the server with
     * <Model Definition>.api.delete()
     * and <Model Definition>.api.search() to refresh Result Listing.
     * Only Logical Key fields are required, all others are ignored.
    deleteInstances([{
      <field name>: <serializable, field value>,
      ...
    }, ...]),

    /*
     * Load an instance in Edit View.
     * Only Logical Key fields of the instance are required, all others are ignored.
     */
    editInstance({
      instance: {
        <field name>: <serializable, field value>,
        ...
      },
      ?tab: <string, active tab name>
    }),

    /*
     * Clear all filter fields without Result Listing change.
     */
    resetFormFilter(),

    /*
     * Make <Model Definition>.api.search() call to the server and display response in Result Listing.
     */
    searchInstances({
      ?filter: {
        <field name>: <serializable, filter value for the field>,
        ...
      },
      ?sort: <string, sort field name>,
      ?order: <"asc"|"desc", sort order>,
      ?max: <natural number, search result limit>,
      ?offset: <whole number, search result offset>
    }),

    toggleSelected({
      instance: <object, ref to an element of resultInstances array>
      selected: <boolean, new selection state of the instance>,
    }),
    toggleSelectedAll(<boolean, new selection state of all instances from resultInstances array>),

    /*
     * Usually called with form field's onChange event. Result Listing is not automatically changed.
     */
    updateFormFilter({
      name: <string, field name>,
      value: <serializable, filter value for the field>
    })
  }
}
```

, where `state` is `<Redux store state>.views.edit`.

### Create View *model* Property

*model* property structure set by Create View:

```javascript
{
  data: {...},
  actions: {...}
```

, where `state` is `<Redux store state>.views.create`.

### Edit View *model* Property

*model* property structure set by Edit View:

```javascript
{
  data: {
    activeEntries: state.activeTab || state.formLayout,
    activeTab: state.activeTab,
    entityName: <Model Definition>.model.name,
    formatedInstance: state.formatedInstance,
    fieldsErrors: state.errors.fields,
    fieldsMeta: <Model Definition>.model.fields,
    generalErrors: storeState.errors.general,
    instanceLabel: state.instanceLabel,
    isLoading: <boolean, whether API async operation is in progress>,
    persistentInstance: state.persistentInstance,

    /*
     * Elements from state.formLayout representing tabs.
     * Empy array in case of tabless form layout.
     */
    tabs: state.formLayout.filter(({ tab }) => tab),

    status: state.status,
    viewName: 'edit'
  },
  actions: {

    /*
     * Usually called with field's onChange event.
     */
    changeInstanceField({
      name: <string, field name>,
      value: <serializable, new field value>
    }),

    /*
     * Delete an instance by asynchronously calling the server with
     * <Model Definition>.api.delete()
     * and <Model Definition>.api.search() to exit to Search View and refresh its Result Listing.
     * Only Logical Key fields are required, all others are ignored =>
     * the action can be called either on formInstance or persistentInstance with the same effect.
     */
    deleteInstances({
      <field name>: <serializable, field value>,
      ...
    }),

    /*
     * Exit to Search View.
     */
    exitEdit(),

    saveInstance(),
    saveAndNewInstance(),
    saveAndNextInstance(),
    selectTab(<string, name of tab to activate>),

    /*
     * Usually called with field's onBlur event.
     */
    validateInstanceField(<string, field name>)
  }
}
```

, where `state` is `<Redux store state>.views.edit`.

### Show View *model* Property

*model* property structure set by Show View:

```javascript
{
  data: {...},
  actions: {...}
```

, where `state` is `<Redux store state>.views.show`.

### Error View *model* Property

*model* property structure set by Error View:

```javascript
{
  data: {
    errors: state.errors,
    isLoading: <boolean, whether API async operation is in progress>,
  },
  actions: {

    /*
     * Navigate to CRUD Editor home page, which is Search View with default View State.
     */
    goHome()
  }
```

, where `state` is `<Redux store state>.views.show`.

## Diagrams

### Transitions of views and their states

![Views States Transitions](./docs/ViewStatesTransitions.png)

### Data Flow

![Data Flow](./docs/DataFlow.png)

## Code Conventions

### Redux Actions

An action symbolizes not a command but an effect, i.e. a change already happened in the application.

All actions are [FSA](https://github.com/acdlite/flux-standard-action)-compliant.

Action types are in `CONSTANT_CASE` and follow `<NOUN>_<VERB>` pattern, e.g. ``INSTANCE_ADD`. `VERB` is in the *present* tense. Putting `NOUN` first makes sorting actions more efficient.

An action creator name follows `<verb><Noun>` pattern, e.g. `createInstance()`.

Async actions are suffixed with
 - _REQUEST - for when you first send the api call,
 - _SUCCESS - for when the api call is done and successfully returned data,
 - _FAIL - for when the api call failed and responded with an error,
 - _COMPLETE - sometimes used at the end of the call regardless of status.

!!!TBD: "_SUCCESS" and "_FAIL" are not needed when [FSA](https://github.com/acdlite/flux-standard-action) convention is followed.

Action types are saved in a separate file as *sorted* constants (e.g. `var INSTANCE_ADD = 'INSTANCE_ADD';`) and used them from there. This avoids spelling errors, since if the variable doesn't exist, you'll get an error immediately, especially if you're linting.

Inner-view actions are scoped to their view, e.g. `'search/MY_ACTION_TYPE'`.

### Code Structure

**NOTE**: It's entirely possible for a reducer defined in one folder to respond to an action defined in another folder[\[1\]](#footnote-1).

    project-root/
    ├── common/
    │   └── ...  # "common" namespace dir content.
    ├── components/  # Editor-wide React Components.
    │   └── ....
    ├── views/
    │   ├── create/
    │   │   └── ...  # "create" view namespace dir content.
    │   ├── edit/
    │   │   └── ...  # "edit" view namespace dir content.
    │   ├── error/
    │   │   └── ...  # "error" view namespace dir content.
    │   ├── search/
    │   │   └── ...  # "search" view namespace dir content.
    │   └── show/
    │       ├── components/  # View-specific Presentational Components not aware of Redux.
    │       │   └── ....
    │       ├── actions.js  # action creators (always encapsulated inside a duck).
    │       ├── constants.js  # actions' types and other constants.
    │       ├── index.js  # View main Container Component aware of Redux and subscribing to Redux state.
    │       ├── reducer.js
    │       ├── sagas.js
    │       ├── selectors.js
    │       └── tests.js
    ├── index.js  # Editor main React Component.
    ├── rootReducer.js
    └── rootSaga.js

Every view dir and *common* dir represents a [ducks](https://github.com/erikras/ducks-modular-redux)-complient namespace. All namespaces have similar dir structure (see *show* view for an example).

## TODO

Not implemented:

- isCreateSupported,
- duplicationConfiguration,
- cmlExportConfiguration.
- Allow custom operations to overwrite standard operations.

## Footnotes

1. <a id="footnote-1"></a>"There's no such thing as reducer / action creator pairing in Redux. That's purely a Ducks thing. Some people like it but it obscures the fundamental strengths of Redux/Flux model: state mutations are decoupled from each other and from the code causing them. Actions are global in the app, and I think that's fine. One part of the app might want to react to another part's actions because of complex product requirements, and we think this is fine. The coupling is minimal: all you depend on is a string and the action object shape. The benefit is it's easy to introduce new derivations of the actions in different parts of the app without creating tons of wiring with action creators. Your components stay ignorant of what exactly happens when an action is dispatched—this is decided on the reducer end. So our official recommendation is that you should first try to have different reducers respond to the same actions. If it gets awkward, then sure, make separate action creators. But don't start with this approach." ([source](https://github.com/reactjs/redux/issues/1171#issuecomment-167704896))
