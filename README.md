# CRUD Editor


[![CircleCI](https://circleci.com/gh/OpusCapita/react-crudeditor.svg?style=shield&circle-token=d9a917e9d6b76fc2d83928b2ec06e2297b3e05a4)](https://circleci.com/gh/OpusCapita/react-crudeditor)
[![npm version](https://img.shields.io/npm/v/@opuscapita/react-crudeditor.svg)](https://npmjs.org/package/@opuscapita/react-crudeditor)
[![Dependency Status](https://img.shields.io/david/OpusCapita/react-crudeditor.svg)](https://david-dm.org/OpusCapita/react-crudeditor)
[![NPM Downloads](https://img.shields.io/npm/dm/@opuscapita/react-crudeditor.svg)](https://npmjs.org/package/@opuscapita/react-crudeditor)
![badge-license](https://img.shields.io/github/license/OpusCapita/react-crudeditor.svg)

### [Demo](https://opuscapita.github.io/react-crudeditor/branches/master/?currentComponentName=ContractEditor&maxContainerWidth=100%25&showSidebar=false)

- [Getting started](#getting-started)
- API Reference:
  - [Terminology](https://github.com/OpusCapita/react-crudeditor/wiki/Terminology)
  - [Editor component](https://github.com/OpusCapita/react-crudeditor/wiki/Editor-Component)
  - [Model Definition](https://github.com/OpusCapita/react-crudeditor/wiki/Model-Definition)
  - [props.model](https://github.com/OpusCapita/react-crudeditor/wiki/props.model)
  - [Redux store](https://github.com/OpusCapita/react-crudeditor/wiki/Redux-Store)


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
