# CRUD Editor


[![CircleCI](https://circleci.com/gh/OpusCapita/react-crudeditor.svg?style=shield&circle-token=d9a917e9d6b76fc2d83928b2ec06e2297b3e05a4)](https://circleci.com/gh/OpusCapita/react-crudeditor)
[![npm version](https://img.shields.io/npm/v/@opuscapita/react-crudeditor.svg)](https://npmjs.org/package/@opuscapita/react-crudeditor)
[![Dependency Status](https://img.shields.io/david/OpusCapita/react-crudeditor.svg)](https://david-dm.org/OpusCapita/react-crudeditor)
[![NPM Downloads](https://img.shields.io/npm/dm/@opuscapita/react-crudeditor.svg)](https://npmjs.org/package/@opuscapita/react-crudeditor)
![badge-license](https://img.shields.io/github/license/OpusCapita/react-crudeditor.svg)

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

## Terminology

<dl>
  <dt>Logical Key</dt>
  <dd>Field(s) and their value(s) constituting visible unique identifier of an entity instance. It may or may not be DB <i>Primary ID</i>.</dd>

  <dt>Operation</dt>
  <dd>Optional actions to be perfomed with an entity instance. Each operation has a dedicated button (or menu item in Split button dropdown) on UI. There are three kinds of operations:
    <ul>
      <li id="standard-operation">
        <i>Standard</i> - predefined operation. Its handler is defined inside CRUD Editor. Standard operations IDs:
          <ol>
            <li>"delete"</li>
            <li>"edit"</li>
            <li>"save"</li>
            <li>"saveAndNext"</li>
            <li>"saveAndNew"</li>
            <li>"show"</li>
          </ol>
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
    Field classification, "string" by default. There are <a href="#default-fieldinput-components">standard types</a> as well as custom.  Custom type can be any string, ex. "collection", "com.jcatalog.core.DateRange", etc.
    <br /><br />
    There are <a href="#embedded-fieldinputcomponents">default React Components</a> for displaying fields of standard types.  Rendering of custom types fields requires specifying custom React Components (see <a href="#fieldinputcomponent">FieldInputComponent</a> and <a href="#fieldrendercomponent">FieldRenderComponent</a>) in <a href="#model-definition">Model Definition</a>'s <b>ui.search</b>, <b>ui.create</b>, <b>ui.edit</b> and <b>ui.show</b>.
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
    <i>UI Types</i> are defined in <b>render.value.type</b> of <b>searchableFields</b> and <b>formLayout</b> (see <a href="#model-definition">Model Definition</a>'s <b>ui.search</b>, <b>ui.create</b>, <b>ui.edit</b> and <b>ui.show</b>)
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

        ?type: <string, field type (see corresponding "Terminology" section)>,

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
          ?validate(<serializable, field value>, <object, entity instance>) {
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
    ?validate(<object, entity instance>) {
      ...
      throw [<Instance Validation Error>, ...];
      ...
      return true;
    },

    translations: <object, i18n translations> // See "i18n tranlations" section.
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
           *   component: <string, id of default FieldInputComponent for displaying the Field Type>,
           *
           *   value: {
           *     propName: "value",
           *     type: <string, UI Type peculiar to the default FieldInputComponent>
           *   }
           * }
           */
          ?render: {

            /*
             * Either custom FieldInputComponent (see corresponding subheading)
             * or id of embedded FieldInputComponent.
             */
            component: <FieldInputComponent|string>,

            ?props: <object, the component props to overwrite defaults>,
            ?value: {
              ?propName: <string, a name of component prop with field value>,

              /*
               * Redundant for an embedded FieldInputComponent,
               * because UI Type it works with is already known to CRUD Editor.
               *
               * When omitted for custom FieldInputComponent, UI Type is considered to be unknown.
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
               * 1. component is embedded FieldInputComponent, or
               * 2. component is custom FieldInputComponent and "type" with UI Type is specified.
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
        }, ...],

        /*
         * Configuration for Standard Operations (see corresponding Terminology section).
         * NOTE: only "delete" can be configured now.
         */
        ?standardOperations: {
          <name, stadard operation ID>: <object, entity instance> => {
            ...
            return {
              ?disabled: <boolean, false by default>
            };
          },
          ...
        }
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
                ?render: { // see "searchableFields" above for detailed explanation.
                  component: <FieldInputComponent|string>,
                  ?props: <object, the component props to overwrite defaults>,
                  ?value: {
                    ?propName: <string, a name of component prop with field value, "value" by default>,
                    ?type: <string, embedded UI Type (see corresponding "Terminology" section)>,
                    ?converter: { format, parse }
                  }
                },
                ?validate(<serializable, field value>, <object, entity instance>) { // Field-validator.
                  ...
                  throw [<Instance Validation Error>, ...];
                  ...
                  return true;
                }
              }),
              ?field({
                name: <string, field name>,
                ?readOnly: <boolean, false by default>,
                ?render: { // see "searchableFields" above for detailed explanation.
                  component: <FieldInputComponent|string>,
                  ?props: <object, the component props to overwrite defaults>,
                  ?value: {
                    ?propName: <string, a name of Component prop with field value, "value" by default>,
                    ?type: <string, embedded UI Type (see corresponding "Terminology" section)>,
                    ?converter: { format, parse }
                  },
                  ?validate(<serializable, field value>, <object, entity instance>) { // Field-validator.
                    ...
                    throw [<Instance Validation Error>, ...];
                    ...
                    return true;
                  }
                }
              }),
              ...
            ),
            ?field({
              name: <string, field name>,
              ?readOnly: <boolean, false by default>,
              ?render: { // see "searchableFields" above for detailed explanation.
                component: <FieldInputComponent|string>,
                ?props: <object, the component props to overwrite defaults>,
                ?value: {
                  ?propName: <string, a name of Component prop with field value, "value" by default>,
                  ?type: <string, embedded UI Type (see corresponding "Terminology" section)>,
                  ?converter: { format, parse }
                }
              },
              ?validate(<serializable, field value>, <object, entity instance>) { // Field-validator.
                ...
                throw [<Instance Validation Error>, ...];
                ...
                return true;
              }
            }),
            ...
          )
          ?section({ name: <string, section name> },
            ?field({
              name: <string, field name>,
              ?readOnly: <boolean, false by default>,
              ?render: { // see "searchableFields" above for detailed explanation.
                component: <FieldInputComponent|string>,
                ?props: <object, the component props to overwrite defaults>,
                ?value: {
                  ?propName: <string, a name of Component prop with field value, "value" by default>,
                  ?type: <string, embedded UI Type (see corresponding "Terminology" section)>,
                  ?converter: { format, parse }
                }
              }
              ?validate(<serializable, field value>, <object, entity instance>) { // Field-validator.
                ...
                throw [<Instance Validation Error>, ...];
                ...
                return true;
              }
            }),
            ...
          ),
          ?field({
            name: <string, field name>,
            ?readOnly: <boolean, false by default>,
            ?render: { // see "searchableFields" above for detailed explanation.
              component: <FieldInputComponent|string>,
              ?props: <object, the component props to overwrite defaults>,
              ?value: {
                ?propName: <string, a name of Component prop with field value, "value" by default>,
                ?type: <string, embedded UI Type (see corresponding "Terminology" section)>,
                ?converter: { format, parse }
              }
            }
            ?validate(<serializable, field value>, <object, entity instance>) { // Field-validator.
              ...
              throw [<Instance Validation Error>, ...];
              ...
              return true;
            }
          }),
          ...
        ]
      },

      /*
       * Configuration for Standard Operations (see corresponding Terminology section).
       * NOTE: nothing can be configured now.
       */
      ?standardOperations: {
        <name, stadard operation ID>: <object, entity instance> => {
          ...
          return {
            ?disabled: <boolean, false by default>
          };
        },
        ...
      }
    },

    ?edit: {
      ?formLayout: <function>  // see ui.create.formLayout for details

      /*
       * Configuration for Standard Operations (see corresponding Terminology section).
       * NOTE: only "delete" can be configured now.
       */
      ?standardOperations: {
        <name, stadard operation ID>: <object, entity instance> => {
          ...
          return {
            ?disabled: <boolean, false by default>
          };
        },
        ...
      }
    },

    ?show: {
      ?formLayout: <function>  // see ui.create.formLayout for details

      /*
       * Configuration for Standard Operations (see corresponding Terminology section).
       * NOTE: nothing can be configured now.
       */
      ?standardOperations: {
        <name, stadard operation ID>: <object, entity instance> => {
          ...
          return {
            ?disabled: <boolean, false by default>
          };
        },
        ...
      }
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
    ?customOperations: function(<object, entity persistent instance>, {
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

        /*
         * The operation button is not displayed if there is no hanlder.
         */
        ?handler() {
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

Custom React Component for rendering [Formatted Instance](#formated-instance)'s field in Search Form or Create/Edit/Show Form.

Props:

Name | Type | Necessity | Default | Description
---|---|---|---|---
readOnly | boolean | optional | false | Whether field value can be changed
value | serializable | mandatory | - | [Persistent field](#persistent-field) value formated to appropriate [UI Type](#ui-type)
onChange | function | mandatory | - | Handler called when component's value changes.<pre><code class="javascript">function(&lt;serializable, new field value&gt;) &#123;<br />&nbsp;&nbsp;...<br />&nbsp;&nbsp;return;  // return value is ignored<br />&#125;</code></pre>
onBlur | function | optional | - | Handler called when component loses focus.<pre><code class="javascript">function() &#123;<br />&nbsp;&nbsp;...<br />&nbsp;&nbsp;return;  // return value is ignored<br />&#125;</code></pre>

### Embedded FieldInputComponents

In CRUD Editor here are two embedded FieldInputComponents:

FieldInputComponent | id
---|---
[BUILTIN_INPUT](#builtin_input) | "input"
[BUILTIN_RANGE_INPUT](#builtin_range_input) | "rangeInput"

For being treated as embedded, string id must be used.  Additionally, the embedded FieldInputComponents can be imported from CRUD Editor package:

```javascript
import { BUILTIN_INPUT, BUILTIN_RANGE_INPUT } from '@opuscapita/react-crudeditor';
```

Embedded FieldInputComponents also accept all props defined for [FieldInputComponent](#fieldinputcomponent).

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

### Default FieldInputComponents

If you define just a [Field Type](#field-type) in [Model Definition](#model-definition)'s **model.fields.\<field name\>.type** (and omit any custom render in **searchableFields** and **formLayout**), the following components will be default for the fields:

#### Common mappings for all Views

Field Type | Component | props.type
---|---|---
FIELD_TYPE_BOOLEAN | [BUILTIN_INPUT](#builtin_input) | 'checkbox'
FIELD_TYPE_STRING   | [BUILTIN_INPUT](#builtin_input) | 'string'
FIELD_TYPE_DECIMAL_RANGE  | [BUILTIN_RANGE_INPUT](#builtin_range_input) | 'decimal'
FIELD_TYPE_INTEGER_RANGE  | [BUILTIN_RANGE_INPUT](#builtin_range_input) | 'integer'
FIELD_TYPE_STRING_DATE_RANGE  | [BUILTIN_RANGE_INPUT](#builtin_range_input) | 'date'
FIELD_TYPE_STRING_DECIMAL_RANGE | [BUILTIN_RANGE_INPUT](#builtin_range_input) | 'string'
FIELD_TYPE_STRING_INTEGER_RANGE | [BUILTIN_RANGE_INPUT](#builtin_range_input) | 'string'

#### Mappings specific to Create/Edit/Show View

Field Type | Component | props.type
---|---|---
FIELD_TYPE_DECIMAL | [BUILTIN_INPUT](#builtin_input) | 'decimal'
FIELD_TYPE_INTEGER  | [BUILTIN_INPUT](#builtin_input) | 'integer'
FIELD_TYPE_STRING_DATE  | [BUILTIN_INPUT](#builtin_input) | 'date'
FIELD_TYPE_STRING_DECIMAL | [BUILTIN_INPUT](#builtin_input) | 'string'
FIELD_TYPE_STRING_INTEGER | [BUILTIN_INPUT](#builtin_input) | 'string'

#### Mappings specific to Search View (searchable fields)

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

### i18n Translations

[Model Definition](#model-definition)'s **model.translations** object has translations for labels/messages defined in the model. Its shape should correspond to preferred format for [@opuscapita/i18n](https://github.com/OpusCapita/i18n) library.

Translation keys convention:

Translation Object | Translation Key
---|---
Model name (shown in the header) | `model.name`
Model tab label | `model.tab.<tab name>`
Model section label | `model.section.<section name>`
Model field label | `model.field.<field name>`
Custom [Field/Instance Validation Error](#parsing-error-and-fieldinstance-validation-error) message | `model.field.<field name>.error.<error id>`

If some translation is not defined, the corresponding label/message text is obtained by converting camelcase id/name to titlecase. For example, `maxOrderValue` is displayed as `Max Order Value`.

[React context](https://reactjs.org/docs/context.html) *must* have `i18n` property with [I18nManager](https://github.com/OpusCapita/i18n) as its value.

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
  ?message: <string, default error message in English - in case translations are not defined>,
  ?payload: <object, optional parameters for i18n service>
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
- Allow custom operations to overwrite standard operations.

## Footnotes

1. <a id="footnote-1"></a>"There's no such thing as reducer / action creator pairing in Redux. That's purely a Ducks thing. Some people like it but it obscures the fundamental strengths of Redux/Flux model: state mutations are decoupled from each other and from the code causing them. Actions are global in the app, and I think that's fine. One part of the app might want to react to another part's actions because of complex product requirements, and we think this is fine. The coupling is minimal: all you depend on is a string and the action object shape. The benefit is it's easy to introduce new derivations of the actions in different parts of the app without creating tons of wiring with action creators. Your components stay ignorant of what exactly happens when an action is dispatched—this is decided on the reducer end. So our official recommendation is that you should first try to have different reducers respond to the same actions. If it gets awkward, then sure, make separate action creators. But don't start with this approach." ([source](https://github.com/reactjs/redux/issues/1171#issuecomment-167704896))
