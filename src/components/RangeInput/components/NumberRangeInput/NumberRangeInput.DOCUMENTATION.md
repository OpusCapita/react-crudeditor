# NumberRangeInput

## Synopsis

Number range input component.

### Props Reference

| Name                           | Type                     | Description                                                                                             |
| ------------------------------ | :----------------------  | -----------------------------------------------------------                                             |
| type                           | string                   | 'integer' or 'decimal'                                                                                  |
| readOnly                       | bool                     | true/false                                                                                              |
| onChange                       | func                     |                                                                                                         |
| onBlur                         | func                     |                                                                                                         |
| onFocus                        | func                     |                                                                                                         |
| value                          | Object                   | { from: <number>, to: <number> }                                                                        |

## Details

...

## Code Example

```js
<NumberRangeInput
  type="decimal"
  onChange={_scope.handleChange.bind(_scope)}
  onFocus={_scope.handleFocus.bind(_scope)}
  onBlur={_scope.handleBlur.bind(_scope)}
  value={_scope.state.value}
/>
```

## Contributors

Egor Stambakio

## Component Name

NumberRangeInput

## License

Licensed by © 2017 OpusCapita