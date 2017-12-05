# FieldNumber

## Synopsis

Number input component.

### Props Reference

| Name                           | Type                     | Description                                                                                             |
| ------------------------------ | :----------------------  | -----------------------------------------------------------                                             |
| type                           | string                   | 'integer' or 'decimal'                                                                                  |
| readOnly                       | bool                     | true/false                                                                                              |
| onChange                       | func                     |                                                                                                         |
| onBlur                         | func                     |                                                                                                         |
| onFocus                        | func                     |                                                                                                         |
| value                          | number                   |                                                                                                         |

## Details

...

## Code Example

```js
<FieldNumber
  type="decimal"
  readOnly={false}
  onChange={_scope.handleChange.bind(_scope)}
  onFocus={_scope.handleFocus.bind(_scope)}
  onBlur={_scope.handleBlur.bind(_scope)}
  value={_scope.state.value}
/>
```

## Contributors

Egor Stambakio

## Component Name

FieldNumber

## License

Licensed by © 2017 OpusCapita