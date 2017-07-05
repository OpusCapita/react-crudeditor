import React from 'react';
import classnames from 'classnames';
import ConfirmDialog from './ConfirmDialog';

export const SortColumn = function(props) {
  const {title, field, sort, order, onSort} = props;

  return (
    <button className="btn btn-link"
            onClick={() => onSort(field, order === 'desc' ? 'asc' : 'desc')}>
      {title}

      {field === sort ? (
        <small>
          <span className={classnames('glyphicon', {
            'glyphicon-arrow-up': (!order || order === 'asc'),
            'glyphicon-arrow-down': (order === 'desc')
          })}/>
        </small>
      ) : null }
    </button>
  );
};

export const ListResultViewReducer = function(dispatch, viewState, context) {
  const {searchResultFields} = context;

  const {
    items,
    filter,
    sort,
    order,
    max,
    offset,
    selected = [],
    selectAll = false
  } = viewState;
  const filterParams = {filter, sort, order};

  return {
    items,
    sort,
    order,
    columns: searchResultFields,
    onSort(sort, order) {
      dispatch('search', {filterParams: {filter, sort, order, max, offset}});
    },
    linkSelectedAll() {
      return {
        checked: selectAll,
        onChange({target: {checked}}) {
          if (checked) {
            dispatch({...viewState, selectAll: !selectAll, selected: [].concat(items)});
          } else {
            dispatch({...viewState, selectAll: !selectAll, selected: []});
          }
        }
      }
    },
    linkSelectOne(item) {
      const index = selected.indexOf(item);
      return {
        checked: index !== -1,
        onChange({target: {checked}}) {
          if (checked) {
            dispatch({...viewState, selected: selected.concat(item)});
          } else {
            selected.splice(index, 1);
            dispatch({...viewState, selected});
          }
        }
      }
    },
    onEdit(object) {
      dispatch('editObject', {filterParams, object});
    },
    //will perform before confirmation
    onDelete(object) {
      dispatch('deleteObject', {filterParams, object});
    }
  }
};

export default function(props) {
  const {
    items,
    //information about columns
    // {name, title, sortable, component}
    //when component - React component how we can render it on table cell
    columns,
    //--------- sort props --
    //sortable field name
    sort,
    //order field name, one of [asc,desc]
    order,
    //change sort order onSort(sort, order)
    onSort,
    //selected actions
    // to bind check box fields
    linkSelectedAll,
    linkSelectOne,
    //common actions
    onEdit,
    onDelete
  } = props;

  return (
    <div className="table-responsive">
      <table className="table table-condensed">
        <thead>
        <th>
          <input type="checkbox" {...linkSelectedAll()}/>
        </th>

        {columns.map(column => {
          const {name, title, sortable} = column;
          return (
            <th>
              <nobr>
                {sortable ? (
                  <SortColumn title={title} field={name} sort={sort} order={order} onSort={onSort}/>
                ) : title }
              </nobr>
            </th>
          );
        })}

        <th>&nbsp;</th>
        </thead>
        <tbody>
        {items.map(object => {
          return (
            <tr>
              <td>
                <input type="checkbox" {...linkSelectOne(object)}/>
              </td>

              {columns.map(column => {
                const {name, component} = column;

                return (
                  <td>
                    {React.createElement(component, {name, object})}
                  </td>
                );
              })}

              <td className="text-right">
                <div className="btn-group">
                  <nobr>
                    <button className="btn-sm btn btn-default" onClick={() => onEdit(object)}>
                      <span className="glyphicon glyphicon-edit"/>
                      Edit
                    </button>

                    {/*custom actions here*/}

                    <ConfirmDialog trigger="click"
                                   onConfirm={() => onDelete(object)}
                                   title="Delete confirmation"
                                   message="Do you want to delete this item?">
                      <button className="btn-sm btn btn-default">
                        <span className="glyphicon glyphicon-trash"/>
                        Delete
                      </button>
                    </ConfirmDialog>
                  </nobr>
                </div>
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
}