# ContractEditor

## Synopsis

ContractEditor react component. Provides general CRUD functionality for Contracts database.

### Props Reference

| Name                           | Type                     | Description                                                                                             |
| ------------------------------ | :----------------------  | -----------------------------------------------------------                                             |
| view                           | object                   | Contains 'name': string, 'state': object                                                                |
| onTransition                   | func                     | Function which executes on each transition                                                              |

## Details

You can *set surrent language* with a URL query param `lang`. Just add it to current URL like this: `...&lang=en`.

`view` prop example:

```js
{
  "name": "edit",
  "state": {
    "instance": {
      "contractId": "1 int mam-cor art bypass"
    },
    "tab": "general"
  }
}
```

## Code Example

```js
<ContractEditor
  view={{name: 'search', state: {
    hideSearchForm: false
  } }}
  onTransition={({ name, state }) => { console.log('onTransition called', { name, state })}}
  externalOperations={instance => [{
    handler() {
      console.log('test link handler');
      console.log(instance)
    },
    ui({ name: viewName, state: viewState }) {
      return {
        title: () => 'Test link',
        icon: 'link',
        dropdown: false
      };
    }
  }, {
    handler() {
      console.log('another link handler');
      console.log(instance)
    },
    ui({ name: viewName, state: viewState }) {
      return {
        title: () => 'Another link',
        icon: 'send',
        dropdown: true
      };
    }
  }]}
  customBulkOperations={[{
    handler(instances) {
      console.log(instances);
    },
    ui: {
      title: 'Pring debug',
    }
  }]}
/>
```

## Contributors

Alexey Sergeev, Dmitry Divin, Daniel Zhitomirsky

## Component Name

ContractEditor

## License

Licensed by © 2016 OpusCapita
