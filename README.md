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
- [Code-Conventions](https://github.com/OpusCapita/react-crudeditor/wiki/Code-Conventions)
- [Diagrams](https://github.com/OpusCapita/react-crudeditor/wiki/Diagrams)


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

## TODO

Not implemented:

- isCreateSupported,
- duplicationConfiguration,
- cmlExportConfiguration.
- Allow custom operations to overwrite standard operations.
