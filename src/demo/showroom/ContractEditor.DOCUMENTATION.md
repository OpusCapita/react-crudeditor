# ContractEditor

## Synopsis

ContractEditor react component. Provides general CRUD functionality for Contracts database.

### Props Reference

| Name                           | Type                     | Description                                                                                             |
| ------------------------------ | :----------------------  | -----------------------------------------------------------                                             |
| view                           | object                   | Contains 'name'<string>, 'state'<object>                                                                |
| onTransition                   | func                     | Function which executes on each transition                                                              |

## Details

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
  view={{name: 'search', state: {} }}
  onTransition={() => {}}
/>;
```

## Contributors

Alexey Sergeev, Dmitry Divin, Daniel Zhitomirsky

## Component Name

ContractEditor

## License

Licensed by © 2016 OpusCapita