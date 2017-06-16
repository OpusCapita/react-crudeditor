# CRUD Editor

## Terminology

<dl>
  <dt>Logical ID</dt>
  <dd>Entity item's visible string ID, which may or may not be DB <i>Primary ID</i>.</dd>

  <dt>Operation</dt>
  <dd>Optional actions to be perfomed with an entity item. There are three kinds of operations:
    <ul>
      <li><i>Internal</i> - predefined operation. Its handler is defined inside CRUD Editor,</li>
      <br />
      <li><i>Custom</i> - custom operation which handler is defined in <a href="#entity-configuration">Entity Configuration</a>'s <b>ui.operations</b> property.<br /><br /><i>Custom operation</i> has higher priority over internal operation, i.e. may overwrite it.</li>
      <br />
      <li><i>External</i> - operation which handler is defined by an application as a callback function passed to <b>onExternalOperation</b> prop of <i>EditorComponent</i>.<br /><br /><i>External Operation</i> has higher priority over <i>Custom/Internal Operation</i>, i.e. may overwrite it.</li>
    </ul>
  </dd>
  <dt>Persistent field</dt>
  <dd>Entity attribute stored on server and returned as item property by api.get() and api.search() calls. CRUD Editor does not necessarily knows about and works with <i>all</i> persistent fields, but only those listed in <a href="#entity-configuration">Entity Configuration</a>'s <b>model.fields</b>.</dd>
  <dt>Auditable field</dt>
  <dd>One of the following <i>Persistent fields</i>:<ul><li>createdBy</li><li>changedBy</li><li>createdOn</li><li>changedOn</li></ul></dd>
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
        ?view={<string>}
        ?state={<object>}
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
view | "search" | View ID.<br>See [props.view](#editorcomponent-propsview)
state | `{}` | Full/sliced View State.<br />See [props.state](#editorcomponent-propsstate)
onTransition | - | View ID and/or View State transition handler.<br />See [props.onTransition](#editorcomponent-propsontransition)
onExternalOperation | - | Set of *external operations* handlers.<br />See [props.onExternalOperation](#editorcomponent-propsonexternaloperation)

### *EditorComponent* props.view

Custom/standard View ID. *Custom Views* are defined in [Entity Configuration](#entity-configuration)'s **ui.customViews**. *Standard View* is one of:

View ID | Description
---|---
search | Search criteria and result
create | New entity item creation
edit | Existing entity item editing
show | The same as *edit* but in read-only mode
error | Error page

### *EditorComponent* props.state

Full/sliced View State describing CRUD Editor state.  Its structure is determined by [props.view](#editorcomponent-propsview).

If View State is sliced, not given or `{}`, all not-mentioned properties retain their current values (or default values in case of initial *EditorComponent* rendering).

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
{}
```

#### *EditorComponent* props.state for *"edit"* and *"show"* Views:

```javascript
{
  id: <string, entity item Ligical ID>,
  ?tab: <string, active tab name>
}
```

Name | Default
---|---
id | -
tab | First tab

#### *EditorComponent* props.state for *"error"* View:

```javascript
{
  code: <natural number, error code>,
  ?message: <string, error message>
}
```

Name | Default
---|---
code | -
message | -

### *EditorComponent* props.onTransition

A transition handler to be called *before* CRUD Editor changes View ID/State.  Usually this function reflects View ID and View State to URL.  It may also change View ID/State by rendering *EditorComponent* with new *props*.

```javascript
function ({ view, state, preventDefault }) {
  ...
  return;  // Return value is ignored.
}
```

Argument | Type | Description
---|---|---
view | string | View ID.<br />See [props.view](#editorcomponent-propsview)
state | object | Full View State.<br />See [props.state](#editorcomponent-propsstate)
preventDefault | function | Call this function to prevent CRUD Editor from changing its View and/or State.

### *EditorComponent* props.onExternalOperation

An object with *external operation* handlers.  A handler is called when a corresponding *external operation* is triggered by CRUD Editor.

```javascript
{
  <external operation name>: function({ item, view, state }) {
    ...
    return;  // Return value is ignored.
  },
  ...
}
```

Every handler has the same set of arguments:

Argument | Type | Description
---|---|---
item | object | An entity item which *external operation* was called upon.
view | string | View ID at the time when *external operation* was called.<br />See [props.view](#editorcomponent-propsview)
state | object | Full View State at the time when *external operation* was called.<br />See [props.state](#editorcomponent-propsstate)

## Entity Configuration

An object describing an entity. It has the following structure:

```javascript
{
  model: {
    name: <string, usually singular entity name>,
    idField: <string, Logical ID field name>,

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
         * They are usually applied during entity item creation/modification.
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
          ?async validate: function(<serializable, field value>, <object, entity item>) {...}
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
   *   ?message: <string, error message>
   * }
   */
  api: {
    /*
     * get single entity item by its Logical ID.
     */
    async get: function(<string, Logical IDs>) {
      ...
      return {
        <field name>: <serializable, field value>,
        ...
      };
    },

    /*
     * search for entity items by a criteria.
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
        items: [{
          <field name>: <serializable, field value>,
          ...
        }, ...],
        totalCount: <whole number, total number of filtered entity items>
      };
    },

    /*
     * delete entity items transactionally by their Logical IDs.
     */
    async delete: function(<array[string], Logical IDs>) {
      return {
        count: <whole number, how many entity items where actually deleted>
      };
    },

    /*
     * create new entity item and return its actial server copy.
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
     * update existing entity item and return its actial server copy.
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
         * By default, all Persistent (but not Auditable) fields from model.fields
         * are used for building search criteria.
         */
        ?searchableFields: [{
          name: <string, persistent field name>,
          ?Component: <FieldInputComponent>  // see "FieldInputComponent" subheading.
        }, ...],

        /*
         * Both persistent and composite fields are allowed.
         * By default, all Persistent fields from model.fields are used in result listing.
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
         * Generate label for entity item description.
         * Default is item._objectLabel
         */
        ?itemDescription(<object, entity item>) {
          ...
          return <string, entity item description>;
        },

        /*
         * layout(), tab() and section() may accept false/undefined/null arguments which a ignored.
         * See "TabFormComponent" and "FieldInputComponent" subheading for React components props.
         *
        ?formLayout({
          layout: <function>,
          tab: <function>,
          section: <function>,
          field: <function>,
          item: <object, entity item>
        }) {
          return layout(
            ?tab({name: <string>, ?disabled: <boolean>, ?Component: <TabFormComponent>},
              ?section({name: <string>},
                ?field({name: <string>, ?hidden: <boolean>, ?readOnly: <boolean>, ?Component: <FieldInputComponent>}),
                ...
              ),
              ?field({name: <string>, ?hidden: <boolean>, ?readOnly: <boolean>, ?Component: <FieldInputComponent>}),
              ...
            ),
            ?section({name: <string>, ?hidden: <boolean>},
              ?field({name: <string>, ?hidden: <boolean>, ?readOnly: <boolean>, ?Component: <FieldInputComponent>}),
              ...
            ),
            ?field({name: <string>, ?hidden: <boolean>, ?readOnly: <boolean>, ?Component: <FieldInputComponent>}),
            ...
          );
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
     * Generate and return an entity item with predefined field values.
     * The item is not persistent.
     */
    ?defaultNewItem: function(<object, "search" View State>) {
      ...
      return <object, entity item>;
    },

    /*
     * Internal, Custom and External operations available in CRUD Editor.
     * An operation handler is called by pressing a dedicated button.
     * Handlers are provided for Custom Operations.
     */
    ?operations: function(<object, entity item>, <string, View ID>) {
      ...
      return [{
        name: <string, operation ID>,
        ?icon: <string, name of an icon to be displayed inside a button>,

        // handler for a Custom Operation.
        ?handler: function() {
          ...
          return {
            ?view: <string, View ID, active View by default>,
            ?state: <object, View State, empty object by default>
          };
        }
      }, ...]
    }
  }
}
```

### FieldInputComponent

React component for a custom rendering of entity item field in Search Form or Create/Edit Form.

Props:

Name | Type | Necessity | Default | Description
---|---|---|---|---
id | string | optional | - | ID of DOM element which must be focused on label click
readOnly | boolean | optional | false | Wheter field value can be changed.
value | serializable | mandatory | - | Persistent field value.
onChange | function | mandatory | - | Handler called when Component's value changes.<pre><code class="javascript">function(&lt;serializable, new field value&gt;) &#123;<br />&nbsp;&nbsp;...<br />&nbsp;&nbsp;return;  // return value is ignored<br />&#125;</code></pre>
onBlur | function | optional | - | Handler called when Component loses focus.<pre><code class="javascript">function() &#123;<br />&nbsp;&nbsp;...<br />&nbsp;&nbsp;return;  // return value is ignored<br />&#125;</code></pre>

### FieldRenderComponent

React component for a custom rendering of item persistent/composite field value in Search Result listing.

Props:

Name | Type | Necessity | Default | Description
---|---|---|---|---
name | string | mandatory | - | Field name from [Entity Configuration](#entity-configuration)'s **ui.search().resultFields**
item | object | mandatory | - | Entity item

### TabFormComponent

React component for a custom rendering of Tab form in create/edit/show Views.

Props:

Name | Type | Necessity | Default | Description
---|---|---|---|---
view | string | mandatory | - | View ID. See [props.view](#editorcomponent-propsview)
state | object | mandatory | - | View State. See [props.state](#editorcomponent-propsstate)
doTransition | function | optional | - | See [doTransition](#dotransition)

### ViewComponent

React component for a custom View.

Props:

Name | Type | Necessity | Default | Description
---|---|---|---|---
state | object | mandatory | - | State of the custom View
doTransition | function | optional | - | See [doTransition](#dotransition)

### doTransition

This handler is called when

 - active View changes its State, *view* argument is optional in such case;
 - another View must be displayed, *state* argument is optional in such case.

```javascript
function ({
  view,
  state
}) {
  ...
  return;  // return value is ignored.
}
```

Arguments:

Name | Type | Necessity | Default | Description
---|---|---|---|---
view | string | optional | active View | ID of to-be-displayed View
state | object | optional | `{}` | Full/sliced State of to-be-displayed View.<br /><br />If View State is sliced, not given or `{}`, all not-mentioned properties retain their current values (or default values in case of initial React Component rendering).
