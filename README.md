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
- [Examples](#examples)
  - [Custom component for a field](#custom-component-for-a-field)
  - [Custom validation for a field](#custom-validation-for-a-field)
  - [Custom component for a tab](#custom-component-for-a-tab)
  - [Pre-save instance validation](#pre-save-instance-validation)
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

## Examples

### Custom component for a field

```
modelDefinition.model.fields[myCustomField] = {
  type: FIELD_TYPE_STRING_INTEGER
}
```
In [buildFormLayout](https://github.com/OpusCapita/react-crudeditor/blob/master/src/demo/models/contracts/index.js#L308) function: 
```
field({
  name: 'myCustomField',
  render: {
    component: myCustomComponent,
    type: UI_TYPE_INTEGER
  }
}),
```
Full API of `render` option: 
```
render: PropTypes.shape({
  component: PropTypes.func.isRequired,
  props: PropTypes.object, // additional props for this component
  value: PropTypes.shape({
    converter: PropTypes.shape({ // optional converter fieldType <=> uiType
      format: PropTypes.func,    // value<UI type> => value<Field type>
      parse: PropTypes.func      // value<Field type> => value<UI type>
    }),
    propName: PropTypes.string, // name of prop which is treated as 'value' for component. Default: 'value'
    type: PropTypes.oneOf(uiTypes) // UI type. Not needed if 'converter' is defined.
  })
})
```
Reference: [Field type](https://github.com/OpusCapita/react-crudeditor/wiki/Terminology#field-type), [UI type](https://github.com/OpusCapita/react-crudeditor/wiki/Terminology#ui-type).

### Custom validation for a field

You can add a custom validation for a field via `constraints` object:

```
modelDefinition.model.fields[myCustomField] = {
  type: FIELD_TYPE_STRING,
  constraints: {
    validate: (value, instance) => {
      if (value.indexOf('booo') !== -1) {
        const err = [{
          code: 400,
          // `id` is used to find translations for this particular error
          // define translations with the following key structure:
          // model.field.FIELD_NAME.error.ERROR_ID, where ERROR_ID is `id` defined below
          // if translation exists, than `message` is not needed
          id: 'forbiddenWord',
          // `message` is a default message in case translation is not found
          message: 'Description cannot contain `booo`!',
          // optional `payload` for error translations
          // here you can define props which you use in i18n messages
          // example: for i18n message `Hello {name}! This field cannot exceed {maxValue}`
          // define `name` and `maxValue` props
          args: {
            forbiddenWord: 'booo'
          }
        }];
        throw err; // validation failed!
      }
      // if `validate` doesn't throw it means success
    }
  }
}
```

### Custom component for a tab

In [buildFormLayout](https://github.com/OpusCapita/react-crudeditor/blob/master/src/demo/models/contracts/index.js#L308) function:

```
tab({ name: 'custom', component: CustomTabComponent, disabled: viewName === VIEW_CREATE })
```

- `name` is used for translating a label ([reference](https://github.com/OpusCapita/react-crudeditor/wiki/Model-Definition#i18n-translations))
- `component` is your custom component for tab
- `disabled` is a boolean which defines if tab is disabled or not

### Pre-save instance validation

When a user hits `Save`, instance validation function runs. If it fails (e.g. instance is not valid) than `Save` is not executed and a notification is shown. Example: 

```
modelDefinition.model.validate = ({ formInstance }) => {
  if (condition) {
    const err = [...same as for custom field validation, see above];
    throw err;
  }
  // if it doesn't throw it means successful instance validation
}
```
Instance validation function can also be **async**:
```
modelDefinition.model.validate = ({ formInstance }) => {
  return new Promise((resolve, reject) => {
    if (condition) {
      const err = [...];
      reject(err); // reject if validation failed
    }
    resolve(); // resolve if validation succeeded
  })
}
```

## TODO

Not implemented:

- isCreateSupported,
- duplicationConfiguration,
- cmlExportConfiguration.
- Allow custom operations to overwrite standard operations.
