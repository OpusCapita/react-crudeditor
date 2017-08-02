# CRUD Editor

Table of Content

- [Terminology](#terminology)
- [Usage](#usage)
- [*EditorComponent*](#editorcomponent)
    * [props.view.name](#editorcomponent-propsview)
    * [props.view.state](#editorcomponent-propsstate)
    * [props.onTransition](#editorcomponent-propsontransition)
    * [props.onExternalOperation](#editorcomponent-propsonexternaloperation)
- [Entity Configuration](#entity-configuration)
    * [Configuration Object Structure](#configuration-object-structure)
    * [FieldInputComponent](#fieldinputcomponent)
    * [FieldRenderComponent](#fieldrendercomponent)
    * [TabFormComponent](#tabformcomponent)
    * [ViewComponent](#viewcomponent)
    * [doTransition](#dotransition)
- [Store](#store)
    * [State Structure](#state-structure)
    * [Validation Error](#validation-error)
    * [Internal Error](#internal-error)
- [Diagrams](#diagrams)
    * [Transitions of views and their states](#transitions-of-views-and-their-states)
    * [Data Flow](#data-flow)
- [Code Conventions](#code-conventions)
    * [Redux Actions](#redux-actions)
    * [Code Structure](#code-structure)
- [TODO](#todo)

## Terminology

<dl>
  <dt>Logical ID</dt>
  <dd>Field(s) and their value(s) constituting visible ID of an entity instance. It may or may not be DB <i>Primary ID</i>.</dd>

  <dt>Operation</dt>
  <dd>Optional actions to be perfomed with an entity instance. There are three kinds of operations:
    <ul>
      <li id="internal-operation"><i>Internal</i> - predefined operation. Its handler is defined inside CRUD Editor,</li>
      <br />
      <li id="custom-operation"><i>Custom</i> - custom operation which handler is defined in <a href="#entity-configuration">Entity Configuration</a>'s <b>ui.operations</b> property.<br /><br /><i>Custom operation</i> has higher priority over internal operation, i.e. may overwrite it.</li>
      <br />
      <li id="external-operation"><i>External</i> - operation which handler is defined by an application as a callback function passed to <a href="#editorcomponent-propsonexternaloperation"><i>EditorComponent</i> props.onExternalOperation</a>.<br /><br /><i>External Operation</i> has higher priority over <a href="#custom-operation">Custom</a>/<a href="#internal-operation">Internal</a> Operation, i.e. may overwrite it.</li>
    </ul>
  </dd>
  <dt id="persistent-field">Persistent field</dt>
  <dd>Entity attribute stored on server and returned as instance property by api.get() and api.search() calls. CRUD Editor does not necessarily knows about and works with <i>all</i> persistent fields, but only those listed in <a href="#entity-configuration">Entity Configuration</a>'s <b>model.fields</b>.</dd>
  <dt>Auditable field</dt>
  <dd>One of the following <a href="#persistent-field">Persistent fields</a>:<ul><li>createdBy</li><li>changedBy</li><li>createdOn</li><li>changedOn</li></ul></dd>
  <dt id="store-state">Store State</dt>
  <dd>Redux <a href="#store">store</a> <a href="#state-structure">state</a> of CRUD Editor. It must be serializable.</dd>
  <dt id="editor-state">Editor State</dt>
  <dd>CRUD Editor state which may be saved and later restored by e.g. an application. It is a subset of <a href="#store-state">Store State</a> and contains information about active View <a href="#editorcomponent-propsview">Name</a>/<a href="#editorcomponent-propsstate">State</a>. See <a href="#editorcomponent-propsontransition"><i>EditorComponent</i> props.onTransition</a> for <i>Editor State</i> structure.</dd>
</dl>

## Usage

```javascript
// 'contract-crudeditor' package.
import React from 'react';
import crudEditor from 'react-crudeditor';

const ContractEditor = crudEditor(<Entity Configuration>);
export default ContractEditor;
```

```javascript
// application.
import React from 'react';
import ContractEditor from 'contract-crudeditor';

export default class extends React.Component {
  render() {
    return (
      ...
      <ContractEditor
        ?view={?name: <string>, ?state: <object>}
        ?onTransition={<function>}
        ?onExternalOperation={<object>}
      />;
      ...
    )
```

`crudEditor` is a function which the only argument is [Entity Configuration](#entity-configuration) object. It returns [*EditorComponent*](#editorcomponent).

## *EditorComponent*

React component with the following props:

Name | Default | Description
---|---|---
[view](#editorcomponent-propsview) | {<br />&nbsp;&nbsp;name: "search",<br />&nbsp;&nbsp;state: {}<br />}| [View Name](#editorcomponent-propsview) and full/sliced [View State](#editorcomponent-propsstate)
[onTransition](#editorcomponent-propsontransition) | - | [Editor State](#editor-state) transition handler
[onExternalOperation](#editorcomponent-propsonexternaloperation) | - | Set of [External Operations](#external-operation) handlers

### *EditorComponent* props.view.name

Name of a custom/standard View. *Custom Views* are defined in [Entity Configuration](#entity-configuration)'s **ui.customViews**. *Standard View* is one of:

View Name | Description
---|---
search | Search criteria and result
create | New entity instance creation
edit | Existing entity instance editing
show | The same as *edit* but read-only
error | Error page

### *EditorComponent* props.view.state

Full/sliced State describing [props.view.name](#editorcomponent-propsview).  Its structure is determined by View it describes.

If View State is sliced, not given or `{}`, all not-mentioned properties retain their current values (or default values in case of initial [*EditorComponent*](#editorcomponent) rendering).

View State *must* be serializable.

#### *EditorComponent* props.state for *"search"* View:

```javascript
{
  ?filter: {
    <field name>: <serializable, filter value for the field>,
    ...
  },
  ?sort: <string, sort field name>,
  ?order: <"asc"|"desc", sort order>,
  ?max: <natural number, search result limit>,
  ?offset: <whole number, search result offset>
}
```

Name | Default
---|---
filter | <ul><li>`{}` - for initial View rendering,</li><li>CRUD Editor current value - otherwise.</li></ul>
sort | <ul><li>Result field marked with `sortByDefault` (first result field if no `sortByDefault` marker is set) - for initial View rendering</li><li>CRUD Editor current value - otherwise.</li></ul>
order | <ul><li>`"asc"` - for initial View rendering,</li><li>CRUD Editor current value - otherwise</li></ul>
max | <ul><li>`30` - for initial View rendering,</li><li>CRUD Editor current value - otherwise.</li></ul>
offset | `0`

#### *EditorComponent* props.state for *"create"* View:

```javascript
{
  instance: <object, an entity instance with predefined field values>
}
```

#### *EditorComponent* props.state for *"edit"* and *"show"* Views:

```javascript
{
  instance: <object, an entity instance with Logical ID fields only>,
  ?tab: <string, active tab name>
}
```

Name | Default
---|---
instance | -
tab | First tab name

#### *EditorComponent* props.state for *"error"* View:

```javascript
{
  code: <natural number, error code>,
  ?payload: <any, structure is defined by error code>
}
```

Name | Default
---|---
code | -
payload | -

### *EditorComponent* props.onTransition

A transition handler to be called after [Editor State](#editor-state) changes. Its only argument is [Editor State](#editor-state) object. Usually the function reflects [Editor State](#editor-state) to URL.  It may also change [Editor State](#editor-state) by rendering [*EditorComponent*](#editorcomponent) with new *props*.

```javascript
function ({
  name: <string, View name>,  // See EditorComponent props.view.name
  state: <object, Full View State>  // See EditorComponent props.view.state
}) {
  ...
  return;  // Return value is ignored.
}
```

### *EditorComponent* props.onExternalOperation

An object with [External Operations](#external-operation) handlers.  A handler is called when a corresponding [External Operation](#external-operation) is triggered by CRUD Editor.

```javascript
{
  <external operation name>: function({ instance, view, state }) {
    ...
    return;  // Return value is ignored.
  },
  ...
}
```

Every handler has the same set of arguments:

Argument | Type | Description
---|---|---
instance | object | An entity instance which [External Operation](#external-operation) was called upon.
view | {<br />&nbsp;&nbsp;name: <string>,<br />&nbsp;&nbsp;state: <object><br />} | View [ID](#editorcomponent-propsview)/Full [State](#editorcomponent-propsstate) at the time when [External Operation](#external-operation) was called

## Entity Configuration

### Configuration Object Structure

Entity Configuration is an object describing an entity. It has the following structure:

```javascript
{
  model: {
    name: <string, usually singular entity name>,
    logicalId: <array[string], names of Ligical ID fields>,

    /*
     * Persistent fields CRUD Editor is interested in.
     */
    fields: {
      <field name>: {

        /*
         * Standard field type, "string" by default.
         * It defines a React Component for displaying a field value.
         * Types other than listed are ignored.
         * If a field does not hava a standard type and wants to be displayed, custom React
         * Component(s) must be provided in corresponding sections of the configuration.
         */
        ?type: <"string"|"number"|"date"|"boolean">,

        /*
         * Constraints for field validation.
         * They are usually applied during entity instance creation/modification.
         */
        ?constraints: {
          ?max: <number|date, max length for strings or max value for dates/numbers>,
          ?min: <number|date, min length for strings or min value for dates/numbers>,
          ?required: <boolean, whether the field value can be empty>,
          ?email: <boolean>,
          ?matches: <regexp>,
          ?url: <boolean>,

          /*
           * Custom validator returning a promise of boolean
           * - true for pass,
           * - false for fail.
           */
          ?async validate: function(<serializable, field value>, <object, entity instance>) {...}
        }
      },
      ...
    }
  },

  /*
   * Methods for async operations.
   * Each method returns a promise.  In case of failure it rejects to
   * {
   *   code: <whole number, error code>,
   *   ?payload: <any, structure is defined by error code>
   * }
   */
  api: {
    /*
     * get single entity instance by its Logical ID.
     */
    async get: function(<object, an entity instance with Logical ID fields only>) {
      ...
      return {
        <field name>: <serializable, field value>,
        ...
      };
    },

    /*
     * search for entity instances by a criteria.
     */
    async search: function({
      ?filter: {
        <field name>: <serializable, filter value for the field>,
        ...
      },
      ?sort: <string, sort field name>,
      ?order: <"asc"|"desc", sort order>,
      ?max: <natural number, search result limit>,
      ?offset: <whole number, search result offset>
    }) {
      ...
      return {
        instances: [{
          <field name>: <serializable, field value>,
          ...
        }, ...],
        totalCount: <whole number, total number of filtered entity instances>
      };
    },

    /*
     * delete entity instances transactionally by their Logical IDs.
     */
    async delete: function(<array[string], entity instances with Logical ID fields only>) {
      return {
        count: <whole number, how many entity instances where actually deleted>
      };
    },

    /*
     * create new entity instance and return its actial server copy.
     */
    async create: function({
      <field name>: <serializable, field value>,
      ...
    }) {
      ...
      return {
        <field name>: <serializable, field value>,
        ...
      };
    },

    /*
     * update existing entity instance and return its actial server copy.
     */
    async update: function({
      <field name>: <serializable, field value>,
      ...
    }) {
      ...
      return {
        <field name>: <serializable, field value>,
        ...
      };
    }
  },

  ?ui: {
    ?search: function() {
      ...
      return {
        /*
         * Only Persistent fields from model.fields are allowed.
         * By default, all Persistent (excluding Auditable) fields from model.fields
         * are used for building search criteria.
         */
        ?searchableFields: [{
          name: <string, persistent field name>,
          ?Component: <FieldInputComponent>  // see "FieldInputComponent" subheading.
        }, ...],

        /*
         * Both persistent and composite fields are allowed.
         * By default, all Persistent (including Auditable) fields from model.fields are used in result listing.
         * Only one field may have "sortByDefault" set to true.
         */
        ?resultFields: [{
          name: <string, persistent or composite field name>,
          ?sortable: <boolean, false by default>,
          ?sortByDefault: <boolean, false by default>,
          ?textAlignment: <"left"|"center"|"right">,
          ?Component: <FieldRenderComponent>  // see "FieldRenderComponent" subheading.
        }, ...]
      };
    },

    ?createEditShow: function(<"create"|"edit"|"show">) {
      ...
      return {

        /*
         * Generate label for entity instance description.
         * Default is instance._objectLabel
         */
        ?instanceDescription(<object, entity instance>) {
          ...
          return <string, entity instance description>;
        },

        /*
         * layout(), tab() and section() may accept false/undefined/null arguments which are ignored.
         * See "TabFormComponent" and "FieldInputComponent" subheading for React components props.
         *
         * If formLayout is not specified, create/edit/show View does not have any tabs/sections
         * and displays all fields from the model. The following fields are read-only in such case:
         * -- all fields in show View,
         * -- auditable fields in edit View,
         * -- logicalId fields in edit View.
         */
        ?formLayout(instance) {
          ...
          return [{
            tab: <string, tab name>,
            ?mode: <"hidden"|"disabled"|"enabled">,  // "enabled" by default
            ?Component: <function, React Component>,
            entries: [{
              section: <string, section name>,
              ?mode: <"hidden"|"visible">,  // "visible" by default
              entries: [{
                field: <string, field name>,
                ?mode: <"hidden"|"readonly"|"writable">,  // "writable" by default
                ?Component: <function, React Component>
              }...]
            }, ...]
          }, ...];
        }
      }
    },

    /*
     * Views in addition to standard ones.
     */
    ?customViews: {
      <view name>: <ViewComponent>,  // see "ViewComponent" subheading.
      ...
    },

    /*
     * Generate and return an entity instance with predefined field values.
     * The instance is not persistent.
     */
    ?defaultNewInstance: function(<object, "search" View State>) {
      ...
      return <object, entity instance>;
    },

    /*
     * Internal, Custom and External operations available in CRUD Editor.
     * An operation handler is called by pressing a dedicated button.
     * Handlers are provided for Custom Operations.
     */
    ?operations: function(<object, entity instance>, <string, View Name>) {
      ...
      return [{
        name: <string, operation ID>,
        ?icon: <string, name of an icon to be displayed inside a button, ex. "trash", "edit"; see full list at http://getbootstrap.com/components/#glyphicons >,

        // handler for a Custom Operation.
        ?handler: function() {
          ...
          return {
            ?name: <string, View Name, active View by default>,
            ?state: <object, View State, empty object by default>
          };
        }
      }, ...]
    }
  }
}
```

### FieldInputComponent

React component for a custom rendering of entity instance field in Search Form or Create/Edit Form.

Props:

Name | Type | Necessity | Default | Description
---|---|---|---|---
id | string | optional | - | ID of DOM element which must be focused on label click
readOnly | boolean | optional | false | Wheter field value can be changed
value | serializable | mandatory | - | [Persistent field](#persistent-field) value
onChange | function | mandatory | - | Handler called when Component's value changes.<pre><code class="javascript">function(&lt;serializable, new field value&gt;) &#123;<br />&nbsp;&nbsp;...<br />&nbsp;&nbsp;return;  // return value is ignored<br />&#125;</code></pre>
onBlur | function | optional | - | Handler called when Component loses focus.<pre><code class="javascript">function() &#123;<br />&nbsp;&nbsp;...<br />&nbsp;&nbsp;return;  // return value is ignored<br />&#125;</code></pre>

### FieldRenderComponent

React component for a custom rendering of instance [persistent](#persistent-field)/composite field value in Search Result listing.

Props:

Name | Type | Necessity | Default | Description
---|---|---|---|---
name | string | mandatory | - | Field name from [Entity Configuration](#entity-configuration)'s **ui.search().resultFields**
instance | object | mandatory | - | Entity instance

### TabFormComponent

React component for a custom rendering of Tab form in create/edit/show Views.

Props:

Name | Type | Necessity | Default | Description
---|---|---|---|---
viewName | string | mandatory | - | [View Name](#editorcomponent-propsview)
instance | object | mandatory | - | row instance as displayed in Edit Form
[doTransition](#dotransition) | function | optional | - | [Editor State](#editor-state) change handler

### ViewComponent

React component for a custom View.

Props:

Name | Type | Necessity | Default | Description
---|---|---|---|---
viewState | object | mandatory | - | Custom [View State](#editorcomponent-propsstate)
[doTransition](#dotransition) | function | optional | - | [Editor State](#editor-state) change handler

### doTransition

This handler is called when

 - active View changes its [State](#editorcomponent-propsstate), *view* argument is optional in such case;
 - another [View](#editorcomponent-propsview) must be displayed, *state* argument is optional in such case.

```javascript
function ({
  ?name: <string, View Name>,
  ?state: <object, View State>
}) {
  ...
  return;  // return value is ignored.
}
```

Arguments:

Name | Default | Description
---|---|---
name | active View Name | To-be-displayed [View Name](#editorcomponent-propsview)
state | `{}` | Full/sliced to-be-displayed [View State](#editorcomponent-propsstate).

## Store

### State Structure

```javascript
{
  common: {
    activeView: <"search"|"create"|"edit"|"show"|"error">,
    entityConfigurationIndex: <natural number>,  // an index for setting/getting entityConfiguration object by "entityConfiguration.js" module.
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
      }

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
      status: <"ready"|"searching"|"deleting", search view status>
    },
    create: {
      instance: {
        <field name>: <serializable, field value>,
        ...
      },
      status: <"ready"|"saving">

      /*
       * validation or internal error
       * (all other errors are displayed on "error" view)
       */
      error: <Validation Error|Internal Error>,  // See relevant subheadings.
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

      tab: <string, active tab name>,
      status: <"ready"|"extracting", edit view status>

      /*
       * validation or internal error
       * (all other errors are displayed on "error" view)
       */
      error: <Validation Error|Internal Error>  // See relevant subheadings.
    },
    show: {
      instance: {
        <field name>: <serializable, field value>,
        ...
      },
      tab: <string, active tab name>,
      status: <"ready"|"extracting", show view status>
    },
    error: {
      code: <natural number, error code>,
      ?payload: <any, structure is defined by error code>
    }
  }
}
```

### Validation Error

```javascript
{
  code: 400,
  payload: {
    <field name>: [{
      code: <natural number, error code>,
      ?message: <string, error message>
    }, ...]
  }
}
```

### Internal Error

```javascript
{
  code: 500,
  ?payload: <string, error message>
}
```

## Diagrams

### Transitions of views and their states

![Views States Transitions](./docs/ViewStatesTransitions.png)

### Data Flow

![Data Flow](./docs/DataFlow.png)

## Code Conventions

### Redux Actions

An action symbolizes not a command but an effect, i.e. a change already happened in the application.

All actions are [FSA](https://github.com/acdlite/flux-standard-action)-compliant.

Action types are in `CONSTANT_CASE` and follow `<NOUN>_<VERB>` pattern, e.g. `TODO_ADD`. `VERB` is in the *present* tense. Putting `NOUN` first makes sorting actions more efficient.

An action creator name follows `<verb><Noun>` pattern, e.g. `createTodo()`.

Async actions are suffixed with
 - _REQUEST - for when you first send the api call,
 - _SUCCESS - for when the api call is done and successfully returned data,
 - _FAIL - for when the api call failed and responded with an error,
 - _COMPLETE - sometimes used at the end of the call regardless of status.

!!!TBD: "_SUCCESS" and "_FAIL" are not needed when [FSA](https://github.com/acdlite/flux-standard-action) convention is followed.

Action types are saved in a separate file as *sorted* constants (e.g. `var TODO_ADD = 'TODO_ADD';`) and used them from there. This avoids spelling errors, since if the variable doesn't exist, you'll get an error immediately, especially if you're linting.

Inner-view actions are scoped to their view, e.g. `'search/MY_ACTION_TYPE'`.

### Code Structure

**NOTE**: It's entirely possible for a reducer defined in one folder to respond to an action defined in another folder[\[1\]](#footnote-1).

    project-root/
    └── client/
        ├── common/
        │   └── ...  # "common" namespace dir content
        ├── views/
        │   ├── create/
        │   │   └── ...  # "create" view namespace dir content
        │   ├── edit/
        │   │   └── ...  # "edit" view namespace dir content
        │   ├── error/
        │   │   └── ...  # "error" view namespace dir content
        │   ├── search/
        │   │   └── ...  # "search" view namespace dir content
        │   └── show/
        │       ├── components/
        │       │   └── ....
        │       ├── actions.js  # action creators (always encapsulated inside a duck)
        │       ├── constants.js  # actions' types and other constants
        │       ├── reducer.js
        │       ├── sagas.js
        │       ├── selectors.js
        │       └── tests.js
        ├── rootReducer.js
        ├── rootSaga.js
        └── services/
            └── ...

Every view dir and *common* dir represents a [ducks](https://github.com/erikras/ducks-modular-redux)-complient namespace. All namespaces have similar dir structure (see *show* view for an example).

## TODO

Not implemented:

- isCreateSupported,
- duplicationConfiguration,
- cmlExportConfiguration.

## Footnotes

1. <a id="footnote-1"></a>"There's no such thing as reducer / action creator pairing in Redux. That's purely a Ducks thing. Some people like it but it obscures the fundamental strengths of Redux/Flux model: state mutations are decoupled from each other and from the code causing them. Actions are global in the app, and I think that's fine. One part of the app might want to react to another part's actions because of complex product requirements, and we think this is fine. The coupling is minimal: all you depend on is a string and the action object shape. The benefit is it's easy to introduce new derivations of the actions in different parts of the app without creating tons of wiring with action creators. Your components stay ignorant of what exactly happens when an action is dispatched—this is decided on the reducer end. So our official recommendation is that you should first try to have different reducers respond to the same actions. If it gets awkward, then sure, make separate action creators. But don't start with this approach." ([source](https://github.com/reactjs/redux/issues/1171#issuecomment-167704896))
