[#273](https://github.com/OpusCapita/react-crudeditor/issues/273): @nkovalenko-sc creates a CRUD, where some instances are editable, and some are not. He wants to show `View` button **instead of** `Edit` based on instance fields. This is not possible with current editor.

## Subject: buttons!

`Search` view: 
- instance operations:
  - `View`, `Edit`, `Delete`
  - `custom operations` - a button to navigate to some `view` with some `state`
  - `external operations` - a button to invoke random function
- bulk operations:
  - `Delete all`
- toolbar:
  - `Create`
  
`Show`, `Edit`, `Create` views:
- instance operations at the bottom
- toolbar: `go to previous`, `go to next` buttons

## History of use cases 

- need **custom operations** - buttons which allow to navigate to a `view` with certain `state`. 
  
  Examples: `Duplicate` (create view with predefined fields), `Create Child` (create with predefined parent contract).
  
  Solution: **add feature** `customOperations` - **defined in model**

- need **external operations** - buttons which allow to invoke random functions. 
  
  Examples: external link to any URL.
  
  Solution: **add feature** `externalOperations` - **defined in props**
  
- need to **disable Delete button based on instance object** - provide a function like `(instance) => ({ delete: { disabled: <boolean> } })
  to disable `Delete` button. 
  
  Examples: some instances cannot be deleted.
  
  Solution: **add feature** `standardOperations` - **defined in model**. **IMO application scope permissions, but we do it inside crud**.
  
  ```
  model.ui.VIEW_NAME.standardOperations: {
    'delete': instance => ({
      disabled: true/false
    })
  }
  ```
  
  A note about `standardOperations`: here we try to create **per-instance permissions** (we decide if user can delete or not). 
  This is not a UI concern; `disabled` here means `forbidden`, we don't hide a button entirely only because we don't want to make uneven layout.
  
  ## Not implemented use cases
  
  - provide possibility to **disable and/or hide any button based on some condition** (current instance, or current user permissions in application)
  - provide possibility to **change order of buttons**
  - provide possibility to call `Confirmation dialog` upon some condition in order to confirm an action
  
Back to issue [#273](https://github.com/OpusCapita/react-crudeditor/issues/273): @nkovalenko-sc creates a CRUD, where some instances are editable, and some are not. He wants to show `View` button **instead of** `Edit` based on instance fields. This is not possible with current editor.
  
Currently we have `permissions` in `model`: 
  
```
permissions: {
  crudOperations: {
    create: true,
    edit: true,
    delete: true,
    view: true
  }
}
```

If `edit === true` we show `Edit` button. Otherwise we show `View` button **instead of** `Edit` (opinionated restriction). 
It is impossible to show both `View` and `Edit`, or to show different button based on instance: permissions are editor-wide.

IMO it should be decided by application - what to show based on its permissions and business logic.
  
## Proposal
  
We can **remove** `permissions` and **combine** `customOperations`, `externalOperations`, `standardOperations` into a single point of configuration, and provide a possibility for developers to extend editor the way they want to.

Say, in a `model` we define a function: 

```
model.operations = ({
  view: { name, state }, // current view data
  instance, // if applicable
  onSave, // standard handler called when you try to update instance 
  ...other standard buttons handlers
  requestViewChange, // a function used to navigate to { view, state }, to support customOperations use cases
  showConfirmDialog, // a function which renders confirm dialog if needed
  Button, // standard button component for current view with proper styles and usable interface - so that developer doesn't need to implement a button from scratch
  defaultViewButtons: [component, component...] - standard buttons for this view. You can return it as is for no changes, or change order, or delete one of buttons, etc.
  store, // may be pass current Redux store entirely? 
  ...list of params can grow
}) => ({
  instanceOperations: [
    component, // array of buttons to render in place of instance operations
    component,
    component
  ],
  // if `bulkOperations` not returned -> render default ones
  // if you want to delete `bulkOperations` -> pass `null` to render empty thing
})
```

As a result developer can decide how Editor should behave based on his application's logic, permissions, business details etc.
