import React from 'react';
import immutable from 'object-path-immutable';

export const SearchFormEntryViewReducer = function(dispatch, viewState, context) {
  const {max, sort, order, filter} = viewState;
  const {searchableFields} = context;

  return {
    fields: searchableFields,
    filter,
    defaultFilter: {},
    onSearch(filter) {
      dispatch('search', {filter, offset: 0, max, sort, order});
    },
    onChange(name, value) {
      dispatch({
        ...viewState,
        filter: immutable.set(filter, name, value)
      });
    },
    onReset(filter) {
      dispatch({
        ...viewState,
        filter
      })
    },
    onCreate(object) {
      dispatch('create', {object, searchState: {max, sort, order, filter}});
    }
  }
};

export default function (props) {
  const {
    //onSearch(<filter>)
    onSearch,
    //onChange(<field>, <value>)
    onChange,
    //onRest(<default filter>)
    onReset,
    //onCreate(<new instance>)
    onCreate,
    fields,
    //filter object
    filter,
    //the object to will be set, by default is empty
    defaultFilter
  } = props;

  return (
    <form className="form-horizontal" onClick={(e) => {
      e.preventDefault();

      onSearch(filter);
    }}>

      <div className="form-submit text-right">
        <div className="row">
          <div className="col-md-8">
            {fields.map(field => {
              const {name, label, component} = field;
              return (
                <div className="form-group">
                  <label className="col-sm-3 control-label" htmlFor={name}>{label}</label>
                  <div className="col-sm-1 text-right">
                    {/*what is there?*/}
                  </div>
                  <div className="col-sm-8">
                    {React.createElement(component, {
                      id: name,
                      value: filter[name],
                      onChange(value) {
                        onChange(name, value)
                      }
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="form-inline">
          <button className="btn btn-link"
                  onClick={() => onReset(defaultFilter)}>
            Reset
          </button>

          <button className="btn btn-default"
                  onClick={() => onCreate(filter)}>Create</button>
          <button className="btn btn-primary" type="submit">Search</button>
        </div>
      </div>
    </form>
  );
}