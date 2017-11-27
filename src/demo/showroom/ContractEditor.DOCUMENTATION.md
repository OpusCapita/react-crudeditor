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
  onTransition={() => {}}
  onExternalOperation={{
    'testLink': (instance, { name, state }) => {
      console.log('testLink external handler');
      console.log({ instance, name, state });
    },
    'anotherLink': (instance, { name, state }) => {
      console.log('anotherLink external handler');
      console.log({ instance, name, state });
    }
  }}
/>;
```

## Contributors

Alexey Sergeev, Dmitry Divin, Daniel Zhitomirsky

## Component Name

ContractEditor

## License

Licensed by © 2016 OpusCapita