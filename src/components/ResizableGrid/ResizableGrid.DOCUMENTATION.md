# ResizableGrid

## Synopsis

Applies resize functionality to child's table DOM element.

### Props Reference

| Name                          | Type                   | Description                                     |
|-------------------------------|:-----------------------|-------------------------------------------------|
| store                         | object                 | Store contains getValue/setValue

## Details

...

## Code Example

```js
<ResizableGrid
  store={_scope.createLocaleStore(() => `${window.location.host}/test`, [1/2, 0.25, 0.10, 0.15])}
>
  <table style={{ overflowY: 'hidden', width: '100%' }}>
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th>Column 3</th>
        <th>Column 4</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Value 1 1</td>
        <td>Value 1 2</td>
        <td>Value 1 3</td>
        <td>Value 1 4</td>
      </tr>
      <tr>
        <td>Value 2 1</td>
        <td>Value 2 2</td>
        <td>Value 2 3</td>
        <td>Value 2 4</td>
      </tr>
    </tbody>
  </table>
</ResizableGrid>
```

## Contributors

Alexey Zinchenko

## Component Name

ResizableGrid

## License

Licensed by © 2022 OpusCapita
