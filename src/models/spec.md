## Overall Structure of Entity Metadata

```javascript
{
  name: <string| entity id, usually singular entity name in English>,
  api: <API OBJECT>,
  search: {
    ?Component: <function| React component replacing default one for search page>,
    criteria: <SEARCH CRITERIA OBJECT>,
    result: <SEARCH RESULT OBJECT>
  },
  edit: <EDIT OBJECT>
}
```

## API OBJECT

```
{
  ?get: function(entityId) <function-body| function body returning a promise of entity object>,
  ?search: function(filterName, filterParams) <function-body| function body returning a promise of entity objects list and errors list>,
  ?delete: function(entityIds) <function-body| function body returning a promise of removed entities IDs list and errors list>,
  ?create: function(entity) <function-body| function body returning a promise of created entity object and errors list>,
  ?save: function(entity) <function-body| function body returning a promise of updated entity object and errors list>
}
```

## SEARCH CRITERIA OBJECT

```javascript
{
  ?Component: <function| React component replacing default one for search criteria area>,
  fields: [
    {
      name: <string| field id>,
      ?default: <any|default filter value, string for default input type text or any other value if Component is specified>,
      ?Component: <function| React component replacing default input type text>,
      ?sortByDefault: <string| 'asc' or 'desc'>
    },
    ...
  ]
}
```

## SEARCH RESULT OBJECT

```javascript
{
  ?Component: <function| React component replacing default one for search result area>,
  fields: [
    {
      name: <string| field id>,
      ?Component: <function| React component replacing default string>,
      ?sortable = false: <boolean| whether the listing can be sorted by the field>,
    },
    ...
  ],
  ?listing: {
    ?Component: <function| React component replacing default one for ListResult>
  },
  ?pagination: {
    ?Component: <function| React component replacing default one for Pagination Panel>,
    ?max = 30: <int| max number of results per page>
  },
  ?bulkOperations: {
    ?Component: <function| React component replacing default one for Bulk Operations Panel>
  }
}
```

## EDIT OBJECT

```javascript
{
  Component: <function| React component replacing default one for create/edit>
}
```
