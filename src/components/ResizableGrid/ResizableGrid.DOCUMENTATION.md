# ResizableGrid

## Synopsis

Applies resize functionality to child's table DOM element.

### Props Reference

| Name                          | Type                     | Description                                                          |
|-------------------------------|:-------------------------|----------------------------------------------------------------------|
| name                          | string                   | Used for `persistChanges` functionality to identify table.           |
| persistChanges                | bool                     | Defines whether it is necessary to save changed layout in a browser. |
| initialColumnSizes            | array                    | Array with initial values(string) for every column.                  |
| minCellWidth                  | oneOfType: array, number | Array or number with minimal value(s) for every column.              |

## Details

...

## Code Example

```js
<ResizableGrid
  name={`showRoomTest`}
  persistChanges={false}
  initialColumnSizes={['200px', '200px', '200px', '200px']}
  minCellWidth={[100, 100, 100, 100]}
>
  <table style={{ overflowY: 'hidden' }}>
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
