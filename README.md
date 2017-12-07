# CRUD Editor


[![CircleCI](https://circleci.com/gh/OpusCapita/react-crudeditor.svg?style=shield&circle-token=d9a917e9d6b76fc2d83928b2ec06e2297b3e05a4)](https://circleci.com/gh/OpusCapita/react-crudeditor)
[![npm version](https://img.shields.io/npm/v/@opuscapita/react-crudeditor.svg)](https://npmjs.org/package/@opuscapita/react-crudeditor)
[![Dependency Status](https://img.shields.io/david/OpusCapita/react-crudeditor.svg)](https://david-dm.org/OpusCapita/react-crudeditor)
[![NPM Downloads](https://img.shields.io/npm/dm/@opuscapita/react-crudeditor.svg)](https://npmjs.org/package/@opuscapita/react-crudeditor)
![badge-license](https://img.shields.io/github/license/OpusCapita/react-crudeditor.svg)

### [Demo](https://opuscapita.github.io/react-crudeditor/branches/master/?maxContainerWidth=91%25)

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
      * [Built-in components](#built-in-components)
      * [Default Field Types](#default-field-types)
    * [FieldRenderComponent](#fieldrendercomponent)
    * [TabFormComponent](#tabformcomponent)
    * [ViewComponent](#viewcomponent)
    * [doTransition](#dotransition)
- [Redux Store](#redux-store)
    * [State Structure](#state-structure)
    * [Parsing Error and Field/Instance Validation Error](#parsing-error-and-fieldinstance-validaton-error)
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

## Terminology

<dl>
  <dt>Logical Key</dt>
  <dd>Field(s) and their value(s) constituting visible unique identifier of an entity instance. It may or may not be DB <i>Primary ID</i>.</dd>

  <dt>Operation</dt>
  <dd>Optional actions to be perfomed with an entity instance. There are three kinds of operations:
    <ul>
      <li id="internal-operation">
        <i>Internal</i> - predefined operation. Its handler is defined inside CRUD Editor.
      </li>
      <br />
      <li id="custom-operation">
        <i>Custom</i> - an operation for navigation inside CRUD Editor.  Its handler <i>must</i> be a pure function returning either nothing or new view name/state. <i>Custom operations</i> are defined in <a href="#model-definition">Model Definition</a>'s <b>ui.operations</b> property.
        <br />
        <br />
        <i>Important</i>: Before moving into new view a user is warned about unsaved changes, if any, with confirmation dialog - so the transormation may be cancelled.
      </li>
      <br />
      <li id="external-operation">
        <i>External</i> - an operation for navigating out of CRUD Editor. Its handler is <i>not</i> a pure function because it has side effects and returns nothing. The handler is defined by an application as a callback function passed to <a href="#editorcomponent-propsexternaloperations"><i>EditorComponent</i> props.externalOperations</a>.
        <br />
        <br />
        <i>Important</i>: All unsaved Editor data gets lost if the handler changes <b>window.location</b> or view name/state.
      </li>
    </ul>
  </dd>
  <dt id="persistent-field">Persistent Field</dt>
  <dd>Entity attribute stored on server and returned as instance property by api.get() and api.search() calls. CRUD Editor does not necessarily knows about and works with <i>all</i> persistent fields, but only those listed in <a href="#model-definition">Model Definition</a>'s <b>model.fields</b>.</dd>
  <dt id="composite-field">Composite Field</dt>
  <dd>In contrast to a <a href="#persistent-field">Persistent field</a>, <i>composite field</i> is not stored on server and represents some combination of <a href="#persistent-field">Persistent fields</a>.  It is only used for displaying an entity instance in Search Result listing.</dd>
  <dt id="store-state">Store State</dt>
  <dd><a href="#redux-store">Redux store</a> <a href="#state-structure">state</a> of CRUD Editor. It must be serializable.</dd>
  <dt id="editor-state">Editor State</dt>
  <dd>CRUD Editor state which may be saved and later restored by e.g. an application. It is a subset of <a href="#store-state">Store State</a> and contains information about active View <a href="#editorcomponent-propsviewname">Name</a>/<a href="#editorcomponent-propsviewstate">State</a>. See <a href="#editorcomponent-propsontransition"><i>EditorComponent</i> props.onTransition</a> for <i>Editor State</i> structure.</dd>
  <dt id="field-type">Field Type</dt>
  <dd>
    Field classification, "string" by default. There are <a href="#standard-field-types">standard</a> types as well as custom.  Custom type can be any string, ex. "collection", "com.jcatalog.core.DateRange", etc.
    <br /><br />
    There are default React Components for displaying fields of standard types.  Rendering of custom types fields requires specifying custom React Components (see <a href="#fieldinputcomponent">FieldInputComponent</a> and <a href="#fieldrendercomponent">FieldRenderComponent</a>) in <a href="#model-definition">Model Definition</a>'s <b>ui.search</b>, <b>ui.create</b>, <b>ui.edit</b> and <b>ui.show</b>.
    <br /><br />
    <i>Field Type</i> has nothing to do with JavaScript types and defines a structure of any serializable data. By convention, <b>null</b> is considered to be <i>empty value</i> for any <i>Field Type</i>.
    <br />
    <br />
    <i>Field Types</i> are defined in <a href="#model-definition">Model Definition</a>'s <b>model.fields</b>.
  </dd>
  <dt id="ui-type">UI Type</dt>
  <dd>
    Value conversion is necessary for communication with a React Component rendering the field.  Every field value is formated from its <a href="#field-type">Field Type</a> to appropriate <i>UI Type</i> before sending to a React Component, and parsed from the <i>UI Type</i> back to its <a href="#field-type">Field Type</a> after the React Component modifies the value and returns it in onChange event handler.
    <br/>
    <br/>
    <i>UI Type</i> has nothing to do with JavaScript types and defines a structure of any serializable data. By convention, <b>null</b> is considered to be <i>empty value</i> for any <i>UI Type</i>.  Thus any React Components displaying a field must have embedded <i>empty value</i> concept and be able to deal with <b>null</b>.
    <br/>
    <br/>
    <i>UI Types</i> are defined in <b>render.valueProp.type</b> of <b>searchableFields</b> and <b>formLayout</b> (see <a href="#model-definition">Model Definition</a>'s <b>ui.search</b>, <b>ui.create</b>, <b>ui.edit</b> and <b>ui.show</b>)
  </dd>
  <dt>Instance</dt>
  <dd>An object CRUD operations are performed upon.  Each instance has three different representations in CRUD Editor:
    <ul>
      <li id="persistent-instance"><i>Persistent Instance</i> - an instance as stored on server.</li>
      <li id="form-instance"><i>Form Instance</i> - an instance as displayed in Search/Create/Show/Edit Form.  It is distint from <a href="#persistent-instance">Persistent Instance</a> when a user modified the instance but has not saved changes yet.</li>
      <li id="formated-instance"><i>Formated Instance</i> - <a href="#form-instance">Form Instance</a> with field values formated to <a href="#ui-type">UI Type</a>.</li>
    </ul>
    </dd>
</dl>

## Usage

```javascript
// 'contract-crudeditor' package.
import React from 'react';

import createEditor, {
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT,
  VIEW_SHOW
} from '@opuscapita/react-crudeditor';

const ContractEditor = createEditor(<Model Definition>);
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
        ?externalOperations={[<object>, ...]}
        ?uiConfig={{
          ?headerLevel: <integer>
        }}
      />;
      ...
    )
```

`createEditor` is a function which the only argument is [Model Definition](#model-definition) object. It returns [*EditorComponent*](#editorcomponent).

## *EditorComponent*

React component with the following props:

Name | Default | Description
---|---|---
view | {<br />&nbsp;&nbsp;name: "search",<br />&nbsp;&nbsp;state: {}<br />}| [View Name](#editorcomponent-propsviewname) and full/sliced [View State](#editorcomponent-propsviewstate)
[onTransition](#editorcomponent-propsontransition) | - | [Editor State](#editor-state) transition handler
[externalOperations](#editorcomponent-propsexternaloperations) | - | Set of [External Operation](#external-operation) handlers

### *EditorComponent* props.view.name

Name of a custom/standard View. *Custom Views* are defined in [Model Definition](#model-definition)'s **ui.customViews**. *Standard View* is one of:

View Name | Description
---|---
search | Search criteria and result
create | New entity instance creation
edit | Existing entity instance editing
show | The same as *edit* but read-only
error | Error page

### *EditorComponent* props.view.state

Full/sliced State describing [props.view.name](#editorcomponent-propsviewname).  Its structure is determined by View it describes.

If View State is sliced, not given or `{}`, all not-mentioned properties have their default values.

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
  ?offset: <whole number, search result offset>,
  ?hideSearchForm: <boolean, search form initial visibility>
}
```

Name | Default
---|---
filter | `{}`
sort | Result field marked with `sortByDefault` (first result field if no `sortByDefault` marker is set)
order | `"asc"`
max | `30`
offset | `0`
hideSearchForm | false

#### *EditorComponent* props.state for *"create"* View:

```javascript
{
  ?predefinedFields: <object, an entity instance with predefined field values>
}
```

Name | Default
---|---
predefinedFields | {}

#### *EditorComponent* props.state for *"edit"* and *"show"* Views:

```javascript
{
  instance: <object, an entity instance with Logical Key fields only>,
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

or

```javascript
[{
  code: <natural number, error code>,
  ?payload: <any, structure is defined by error code>
}, ...]
```

Name | Default
---|---
code | -
payload | -

### *EditorComponent* props.onTransition

A transition handler to be called after [Editor State](#editor-state) changes to the one with "ready" status. Its only argument is [Editor State](#editor-state) object. Usually the function reflects [Editor State](#editor-state) to URL.  It may also change [Editor State](#editor-state) by rendering [*EditorComponent*](#editorcomponent) with new *props*.

```javascript
function ({
  name: <string, View name>,  // See EditorComponent props.view.name
  state: <object, Full View State>  // See EditorComponent props.view.state
}) {
  ...
  return;  // Return value is ignored.
}
```

### *EditorComponent* props.externalOperations

An array of [External Operations](#external-operation).  Each has a handler which is called when a corresponding [External Operation](#external-operation) is triggered by CRUD Editor.

```javascript
[
  {
    title: <string, external operation translated name>,
    
    /*
     * name of an icon to be displayed inside a button, ex. "trash", "edit";
     * see full list at
     * http://getbootstrap.com/components/#glyphicons
     */
    ?icon: <string>,
    
    handler(instance) {
      ...
      return;  // Return value is ignored.
    },
    ...
  },
  ...
]
```

Every handler has the same set of arguments:

Argument | Type | Description
---|---|---
instance | object | An entity persistent instance which [External Operation](#external-operation) was called upon

### *EditorComponent* props.uiConfig

An object with optional configurations for UI.

Name | Type | Default | Description
---|---|---|---
headerLevel | integer from 1 to 6 | 1 | Header text size in all Views. Specially designed for sub-editors.

## Model Definition

### Definition Object Structure

Complete example of the model configuration file: [contracts model](https://github.com/OpusCapita/react-crudeditor/blob/master/src/demo/models/contracts/index.js).

Model Definition is an object describing an entity. It has the following structure:

```javascript
{
  model: {
    name: <string, usually singular entity name>,

    /*
     * Persistent fields CRUD Editor is interested in.
     */
    fields: {
      <field name>: {

        /*
         * At least one field must have "unique" property set to true.
         */
        ?unique: <boolean, whether the field is a part of Logical Key, false by default>,
        
        ?type: <string, field type (see corresponding "Terminology" section)>,  // TODO more types and their constraints.

        /*
         * Constraints for field validation.
         * Their allowed set and tuning parameters of each constraint depend on field type.
         * Constraints are usually called after field input's "onBlur" event
         * and before saving instance modifications.
         */
        ?constraints: {
          ?max: <number|date, max length for strings or max value for dates/numbers>,
          ?min: <number|date, min length for strings or min value for dates/numbers>,
          ?required: <boolean, whether the field value can be empty>,
          ?email: <boolean>,
          ?matches: <regexp>,
          ?url: <boolean>,

          /*
           * Custom field-validator returning boolean true in case of successful validation,
           * or throwing an array of errors if validation failed.
           */
          validate(<serializable, field value>, <object, entity instance>) {
            ...
            throw [<Field Validation Error>, ...];
            ...
            return true;
          }
        }
      },
      ...
    },

    /*
     * Custom instance-validator, usually called after "Submit" button press
     * but before sending the instance to the server for save/modify.
     * Field-validation is done upon all fields just before calling the instance-validator.
     * The function returns boolean true in case of successful validation,
     * or throws an object with errors if validation failed.
     * The function may also be asyncronous and return a resolved/rejected promise.
     */
    validate(<object, entity instance>) {
      ...
      throw [<Instance Validation Error>, ...];
      ...
      return true;
    }
  },
  
  permissions: {
    crudOperations: {
      ?create: <boolean, false by default>,
      ?edit: <boolean, false by default>,
      ?delete: <boolean, false by default>,
      ?view: <boolean, false by default>
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
     * get single entity instance by its Logical Key.
     */
    async get: function({
      instance: <object, an entity instance with at least Logical Key fields>
    }) {
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
     * delete entity instances transactionally by their Logical Keys.
     */
    async delete: function({
      instances: <array[object], entity instances with at least Logical Key fields>
    }) {
      return {
        count: <whole number, how many entity instances where actually deleted>
      };
    },

    /*
     * create new entity instance and return its actial server copy.
     */
    async create: function({
      instance: {
        <field name>: <serializable, field value>,
        ...
      }
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
      instance: {
        <field name>: <serializable, field value>,
        ...
      }
    }) {
      ...
      return {
        <field name>: <serializable, field value>,
        ...
      };
    }
  },

  ?ui: {
    ?Spinner: <function, React component to be displayed instead of built-in spinner>,

    ?search: function() {
      ...
      return {
        /*
         * Only Persistent fields from model.fields are allowed.
         * By default, all Persistent fields from model.fields
         * are used for building search criteria.
         */
        ?searchableFields: [{
          name: <string, persistent field name>,

          /*
           * There is no default "render" property for a fild of custom Field Type
           * => "render" property must be explicitly defined in such a case.
           *
           * Default "render" property for a fild of standard Field Type:
           * {
           *   component: <string, id of default component for displaying the Field Type>,
           *
           *   valueProp: {
           *     name: "value",
           *     type: <string, UI Type peculiar to the default React Component>
           *   }
           * }
           */
          ?render: {

            /*
             * Either custom FieldInputComponent (see corresponding subheading)
             * or id with embedded React Component name.
             */
            component: <FieldInputComponent|string>,

            ?props: <object, the component props to overwrite defaults>,
            ?valueProp: {
              ?name: <string, a name of Component prop with field value>,

              /*
               * Redundant for an embedded React Component,
               * because UI Type it works with is already known to CRUD Editor.
               *
               * When omitted for FieldInputComponent, UI Type is considered to be unknown.
               * In such a case:
               * 1. either define converter,
               * 2. or unconverted (i.e. of Field Type) field value is sent to FieldInputComponent and
               *    FieldInputComponent is presupposed to return a value of Field Type.
               *
               * Ignored when custom "converter" is defined.
               */
              ?type: <string, embedded UI Type (see corresponding "Terminology" section)>,

              /*
               * Custom converter which overwrites default converter, if any.
               *
               * There is a default converter when Field Type is known to CRUID Editor and
               * 1. component is embedded React Component, or
               * 2. component is FieldInputComponent and "type" with UI Type is specified.
               */
              ?converter: {

                /*
                 * Field Type to UI Typer converter.
                 */
                format(value) {
                  ...
                  return <serializable>;
                }

                /*
                 * UI Type to Field Type converter.
                 * An error must be thrown if a value is invalid, i.e. cannot be converted to the Field Type.
                 */
                parse(value) {
                  ...
                  return <serializable>;
                }
            }
          }
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
          ?component: <FieldRenderComponent>  // see "FieldRenderComponent" subheading.
        }, ...]
      };
    },

    /*
     * Generate label for entity instance description.
     * Default is instance._objectLabel
     */
    ?instanceLabel(<object, entity instance>) {
      ...
      return <string, entity instance description>;
    },

    ?create: {

      /*
       * Generate and return an entity instance with predefined field values.
       * The instance is not persistent.
       */
      ?defaultNewInstance: function(<object, "search" View State>) {
        ...
        return <object, entity instance>;
      },

      /*
       * tab(), section() and field() may be replaced with false/undefined/null which are ignored.
       *
       * See "TabFormComponent" and "FieldInputComponent" subheading for React components props.
       *
       * If formLayout is not specified, create/edit/show View does not have any tabs/sections
       * and displays all fields from the model. The following fields are read-only in such case:
       * -- all fields in Show view,
       * -- Logical Key fields in Edit view.
       */
      ?formLayout: ({ tab, section, field }) => instance => {
        ...
        return [
          ?tab(
            {
              name: <string, tab name>,
              ?disabled: <boolean, false by default>,
              ?component: <function, TabFormComponent>,
              ?columns: <number, 1 by default>
            },
            ?section(
              { name: <string, section name>, ?columns: <number, columns in parent tab by default> },
              ?field({
                name: <string, field name>,
                ?readOnly: <boolean, false by default>,
                ?render: {
                  component: <function, FieldInputComponent>,
                  ?valueProp: {
                    ?name: <string, a name of Component's prop with field value, "value" by default>,
                    ?type: <string, embedded UI Type (see corresponding "Terminology" section)>
                  }
                }
              }),
              // Passing additional propName property to FieldInputComponent:
              ?field({
                name: <string, field name>,
                ?readOnly: <boolean, false by default>,
                render: {
                  component: props => <FieldInputComponent propName={propValue} {...props}>,
                  ?valueProp: {
                    ?name: <string, a name of component prop with field value, "value" by default>,
                    ?type: <string, embedded UI Type (see corresponding "Terminology" section)>
                  }
                }
              }),
              ...
            ),
            ?field({
              name: <string, field name>,
              ?readOnly: <boolean, false by default>,
              ?render: {
                component: <function, FieldInputComponent>,
                ?valueProp: {
                  ?name: <string, a name of component's prop with field value, "value" by default>,
                  ?type: <string, embedded UI Type (see corresponding "Terminology" section)>
                }
              }
            }),
            ...
          )
          ?section({ name: <string, section name> },
            ?field({
              name: <string, field name>,
              ?readOnly: <boolean, false by default>,
              ?render: {
                component: <function, FieldInputComponent>,
                ?valueProp: {
                  ?name: <string, a name of component's prop with field value, "value" by default>,
                  ?type: <string, embedded UI Type (see corresponding "Terminology" section)>
                }
              }
            }),
            ...
          ),
          ?field({
            name: <string, field name>,
            ?readOnly: <boolean, false by default>,
            ?render: {
              component: <function, FieldInputComponent>,
              ?valueProp: {
                ?name: <string, a name of component's prop with field value, "value" by default>,
                ?type: <string, embedded UI Type (see corresponding "Terminology" section)>
              }
            }
          }),
          ...
        ]
      }
    },

    ?edit: {
      ?formLayout: <function>  // see ui.create.formLayout for details
    },

    ?show: {
      ?formLayout: <function>  // see ui.create.formLayout for details
    },


    /*
     * Views in addition to standard ones.
     * TODO
     */
    ?customViews: {
      <view name>: <ViewComponent>,  // see "ViewComponent" subheading.
      ...
    },

    /*
     * Custom operations available in CRUD Editor.
     * An operation handler is called by pressing a dedicated button.
     */
    ?operations: function(<object, entity persistent instance>, {
      name: <string, View name>,  // See EditorComponent props.view.name
      state: <object, Full View State>  // See EditorComponent props.view.state
    }) {
      ...
      return [{
        name: <string, operation ID>,
        
        /*
         * name of an icon to be displayed inside a button, ex. "trash", "edit";
         * see full list at
         * http://getbootstrap.com/components/#glyphicons
         */
        ?icon: <string>,

        handler() {
          ...
          // return value is either undefined or view name/state.
          return {
            name: <string, View Name>,
            ?state: <object, View State, empty object by default>
          };
        }
      }, ...]
    }
  }
}
```

## FieldInputComponent

Custom React component for rendering [Formatted Instance](#formated-instance)'s field in Search Form or Create/Edit/Show Form.  If the field search is a range search, *FieldInputComponent*s for Search Form and Create/Edit/Show Form are distinct. onChange-handler accepts `{from: <...>, to: <...>}` new field value in former case.

Props:

Name | Type | Necessity | Default | Description
---|---|---|---|---
readOnly | boolean | optional | false | Wheter field value can be changed
value | serializable | mandatory | - | [Persistent field](#persistent-field) value formated to appropriate [UI Type](#ui-type)
onChange | function | mandatory | - | Handler called when component's value changes.<pre><code class="javascript">function(&lt;serializable, new field value&gt;) &#123;<br />&nbsp;&nbsp;...<br />&nbsp;&nbsp;return;  // return value is ignored<br />&#125;</code></pre>
onBlur | function | optional | - | Handler called when component loses focus.<pre><code class="javascript">function() &#123;<br />&nbsp;&nbsp;...<br />&nbsp;&nbsp;return;  // return value is ignored<br />&#125;</code></pre>

### Built-in components 

You can define a custom `component` prop for a field, tab, section or searchable field. It can be a React component, or a `string`, in which case CrudEditor treats it as a built-in component. There are 2 built-in components: [BUILTIN_INPUT](#builtin_input) and [BUILTIN_RANGE_INPUT](#builtin_range_input) which you can import from the CrudEditor lib.

#### Example
```
{ name: 'maxOrderValue', render: { component: BUILTIN_RANGE_INPUT, props: { type: 'integer' } } }
```
Built-in components also accept all props defined for [FieldInputComponent](#fieldinputcomponent).

#### BUILTIN_INPUT

Singular input field.

props.type | Description | UI Type | Auto-convertable field types
---|---|---|---
`string` | Regular input field which works with strings | UI_TYPE_STRING | FIELD_TYPE_STRING, FIELD_TYPE_BOOLEAN, FIELD_TYPE_DECIMAL, FIELD_TYPE_INTEGER, FIELD_TYPE_STRING_DATE, FIELD_TYPE_STRING_DECIMAL, FIELD_TYPE_STRING_INTEGER
`checkbox` | Checkbox | UI_TYPE_BOOLEAN | FIELD_TYPE_BOOLEAN
`date` | [DateInput](https://opuscapita.github.io/react-dates//branches/master/index.html?currentComponentName=DateInput) | UI_TYPE_DATE | FIELD_TYPE_STRING_DATE
`integer` | Input which accepts only numbers and `-` sign and formats using [i18n](https://github.com/OpusCapita/i18n).formatNumber | UI_TYPE_INTEGER | FIELD_TYPE_STRING_INTEGER, FIELD_TYPE_INTEGER, FIELD_TYPE_BOOLEAN, FIELD_TYPE_STRING
`decimal` | Input which accepts only numbers and `-` sign and formats using [i18n](https://github.com/OpusCapita/i18n).formatDecimalNumber | UI_TYPE_DECIMAL | FIELD_TYPE_STRING_DECIMAL, FIELD_TYPE_DECIMAL, FIELD_TYPE_BOOLEAN, FIELD_TYPE_STRING

#### BUILTIN_RANGE_INPUT

Range input field.

props.type | Description | UI Type | Auto-convertable field types
---|---|---|---
`string` | Range input which works with strings | UI_TYPE_STRING_RANGE_OBJECT | FIELD_TYPE_DECIMAL_RANGE, FIELD_TYPE_INTEGER_RANGE, FIELD_TYPE_STRING_DATE_RANGE, FIELD_TYPE_STRING_DECIMAL_RANGE, FIELD_TYPE_STRING_INTEGER_RANGE
`date` | [DateRangeInput](https://opuscapita.github.io/react-dates//branches/master/index.html?currentComponentName=DateRangeInput) | UI_TYPE_DATE_RANGE_OBJECT | FIELD_TYPE_STRING_DATE_RANGE
`integer` | Range input which accepts only numbers and `-` sign and formats using [i18n](https://github.com/OpusCapita/i18n).formatNumber | UI_TYPE_INTEGER_RANGE_OBJECT | FIELD_TYPE_STRING_INTEGER_RANGE, FIELD_TYPE_INTEGER_RANGE
`decimal` | Range input which accepts only numbers and `-` sign and formats using [i18n](https://github.com/OpusCapita/i18n).formatDecimalNumber | UI_TYPE_DECIMAL_RANGE_OBJECT | FIELD_TYPE_STRING_DECIMAL_RANGE, FIELD_TYPE_DECIMAL_RANGE

### Default field types

Field types and correnponding [built-in components](#built-in-components).

If you define just a field type (and omit any custom render), the following components will be default for your fields (see below mappings [specific to Create, Edit and Show](#mappings-specific-to-create-edit-and-show-views) views and [specific to Search](#mappings-specific-to-search-view-searchable-fields) view): 

#### Common mappings for all views

Field Type | Component | props.type
---|---|---
FIELD_TYPE_BOOLEAN | [BUILTIN_INPUT](#builtin_input) | 'checkbox'
FIELD_TYPE_STRING   | [BUILTIN_INPUT](#builtin_input) | 'string'
FIELD_TYPE_DECIMAL_RANGE  | [BUILTIN_RANGE_INPUT](#builtin_range_input) | 'decimal'
FIELD_TYPE_INTEGER_RANGE  | [BUILTIN_RANGE_INPUT](#builtin_range_input) | 'integer'
FIELD_TYPE_STRING_DATE_RANGE  | [BUILTIN_RANGE_INPUT](#builtin_range_input) | 'date'
FIELD_TYPE_STRING_DECIMAL_RANGE | [BUILTIN_RANGE_INPUT](#builtin_range_input) | 'string'
FIELD_TYPE_STRING_INTEGER_RANGE | [BUILTIN_RANGE_INPUT](#builtin_range_input) | 'string'

#### Mappings specific to Create, Edit and Show views

Field Type | Component | props.type
---|---|---
FIELD_TYPE_DECIMAL | [BUILTIN_INPUT](#builtin_input) | 'decimal' 
FIELD_TYPE_INTEGER  | [BUILTIN_INPUT](#builtin_input) | 'integer'
FIELD_TYPE_STRING_DATE  | [BUILTIN_INPUT](#builtin_input) | 'date' 
FIELD_TYPE_STRING_DECIMAL | [BUILTIN_INPUT](#builtin_input) | 'string'
FIELD_TYPE_STRING_INTEGER | [BUILTIN_INPUT](#builtin_input) | 'string'

#### Mappings specific to Search view (searchable fields)

Field Type | Component | props.type 
---|---|---
FIELD_TYPE_DECIMAL | [BUILTIN_RANGE_INPUT](#builtin_range_input) | 'decimal'  
FIELD_TYPE_INTEGER  | [BUILTIN_RANGE_INPUT](#builtin_range_input) | 'integer' 
FIELD_TYPE_STRING_DATE  | [BUILTIN_RANGE_INPUT](#builtin_range_input) | 'date'  
FIELD_TYPE_STRING_DECIMAL | [BUILTIN_RANGE_INPUT](#builtin_range_input) | 'string'  
FIELD_TYPE_STRING_INTEGER | [BUILTIN_RANGE_INPUT](#builtin_range_input) | 'string' 

### FieldRenderComponent

Custom React component for rendering [Formated Instance](#formated-instance)'s [persistent](#persistent-field)/[composite](#composite-field) field value in Search Result listing.

Props:

Name | Type | Necessity | Default | Description
---|---|---|---|---
name | string | mandatory | - | Field name from [Model Definition](#model-definition)'s **ui.search().resultFields**
instance | object | mandatory | - | Entity instance

### TabFormComponent

React component for a custom rendering of Tab form in create/edit/show Views.

Props:

Name | Type | Necessity | Default | Description
---|---|---|---|---
viewName | string | mandatory | - | [View Name](#editorcomponent-propsviewname)
instance | object | mandatory | - | persistent instance
[doTransition](#dotransition) | function | optional | - | [Editor State](#editor-state) change handler

### ViewComponent

React component for a custom View.

Props:

Name | Type | Necessity | Default | Description
---|---|---|---|---
viewState | object | mandatory | - | Custom [View State](#editorcomponent-propsviewstate)
[doTransition](#dotransition) | function | optional | - | [Editor State](#editor-state) change handler

### doTransition

This handler is called when

 - active View changes its [State](#editorcomponent-propsviewstate), *name* argument is optional in such case;
 - another [View](#editorcomponent-propsviewname) must be displayed, *state* argument is optional in such case.

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
name | active View Name | To-be-displayed [View Name](#editorcomponent-propsviewname)
state | `{}` | Full/sliced to-be-displayed [View State](#editorcomponent-propsviewstate)

If View State is sliced, not given or `{}`, all not-mentioned properties retain their current values (or default values in case of initial View rendering).

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
  message: <string, default error message in English>
}
```

### Internal Error

```javascript
{
  code: 500,
  id: <string, error id used by translation service>,
  message: <string, default error message in English>
}
```

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
- Allow custom operations to overwrite internal operations.

## Footnotes

1. <a id="footnote-1"></a>"There's no such thing as reducer / action creator pairing in Redux. That's purely a Ducks thing. Some people like it but it obscures the fundamental strengths of Redux/Flux model: state mutations are decoupled from each other and from the code causing them. Actions are global in the app, and I think that's fine. One part of the app might want to react to another part's actions because of complex product requirements, and we think this is fine. The coupling is minimal: all you depend on is a string and the action object shape. The benefit is it's easy to introduce new derivations of the actions in different parts of the app without creating tons of wiring with action creators. Your components stay ignorant of what exactly happens when an action is dispatched—this is decided on the reducer end. So our official recommendation is that you should first try to have different reducers respond to the same actions. If it gets awkward, then sure, make separate action creators. But don't start with this approach." ([source](https://github.com/reactjs/redux/issues/1171#issuecomment-167704896))
