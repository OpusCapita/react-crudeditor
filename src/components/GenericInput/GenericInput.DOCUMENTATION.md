# GenericInput

## Synopsis

Generic input component.

### Props Reference

| Name                           | Type                     | Description                                                                                             |
| ------------------------------ | :----------------------  | -----------------------------------------------------------                                             |
| type                           | string                   | one of: string (default), checkbox, integer, decimal, date                                              |

## Details

...

## Code Example

```js
<GenericInput
  type="string"
  onChange={_scope.handleChange.bind(_scope)}
  onFocus={_scope.handleFocus.bind(_scope)}
  onBlur={_scope.handleBlur.bind(_scope)}
  value={_scope.state.value}
/>
```

## Contributors

Egor Stambakio

## Component Name

GenericInput

## License

Licensed by © 2017 OpusCapita