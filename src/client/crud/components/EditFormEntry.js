import React from 'react';
import classnames from 'classnames';
import ConfirmDialog from './ConfirmDialog';
import immutable from 'object-path-immutable';

export const EditFormEntryViewReducer = function(dispatch, viewState, context) {
  const {editableFields, validate} = context;
  const {object, errors, searchState} = viewState;

  const saveAction = function(mode, object, state = {}) {
    validate(object, (errors) => {
      if (errors) {
        dispatch({
          ...viewState,
          errors
        })
      } else {
        dispatch(mode === 'edit' ? 'saveObject' : 'createObject', {object, searchState, ...state});
      }
    });
  };

  return {
    object,
    errors,
    fields: editableFields,
    onChange(name, value) {
      dispatch({
        ...viewState,
        object: immutable.set(object, name, value)
      })
    },
    onValidate(name) {
      validate(object, (newErrors) => {
        const errors = {
          ...viewState.errors
        };

        if (newErrors) {
          Object.keys(newErrors).forEach(name => {
            errors[name] = newErrors[name];
          })
        } else {
          delete errors[name];
        }
        dispatch({
          ...viewState,
          errors
        })
      }, name);
    },
    onDelete(object) {
      dispatch('deleteObject', {selected: [object], searchState});
    },
    onSave(mode, object) {
      saveAction(mode, object);
    },
    onSaveAndNew(mode, object) {
      saveAction(mode, object, {andNew: true});
    },
    onSaveAndNext(mode, object) {
      saveAction(mode, object, {andNext: true});
    },
    onCancel() {
      dispatch('search', {searchState});
    },
  };
};

export default function (props) {
  const {
    //mode === edit|create|view
    mode,
    //is it true if form will in next state (load, save, update, delete)
    inTransition,
    //flatten object values
    object,
    //flatten errors
    errors,
    fields,
    //onChange(<field>, <value>)
    onChange,
    //onValidate(<field>)
    onValidate,
    onSave,
    onDelete,
    onSaveAndNew,
    onSaveAndNext,
    onCancel,
  } = props;

  return (
    <form className="form-horizontal" onSubmit={(e) => {
      e.preventDefault();

      if (mode === 'edit' || mode === 'create') {
        onSave(mode, object);
      }
    }}>
      <div className="row">
        <div className="col-md-10">
          {fields.map(field => {
            const {name, label, hint, component, readOnly, required} = field;
            const fieldErrors = errors[name];

            return (
              <div className={classnames('form-group', {'has-error': fieldErrors})}>
                <label className="control-label col-sm-2" htmlFor={name}>
                  {label}{required ? '*' : null}
                </label>
                <div className="col-sm-1 text-right"/>
                <div className="col-sm-9">
                  {React.createElement(component, {
                    id: name,
                    readOnly,
                    value: object[name],
                    onChange(value) {
                      onChange(name, value);
                    },
                    onBlur() {
                      onValidate(name);
                    }
                  })}

                  {fieldErrors ? fieldErrors.map(error => <span className="label label-danger">{error}</span> ) : null }

                  {hint ? <p className="help-block">{hint}</p> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="form-submit text-right">
        <button className="btn btn-link" onClick={() => onCancel()}>Cancel</button>

        {mode === 'edit' ? (
        <ConfirmDialog trigger="click"
                       onConfirm={() => onDelete(object)}
                       title="Delete confirmation"
                       message="Do you want to delete this item?">
          <button className="btn btn-default" >Delete</button>
        </ConfirmDialog>
        ) : null }

        {/*other custom actions here*/}

        {mode === 'create' ? (
          <button className="btn btn-default" onClick={() => onSaveAndNew(mode, object)}>Save and New</button>
        ) : null }

        {mode === 'edit' ? (
          <button className="btn btn-default" onClick={() => onSaveAndNext(mode, object)}>Save and Next</button>
        ) : null }

        {mode === 'edit' || mode === 'create' ? (
          <button className="btn btn-primary" type="submit">Save</button>
        ) : null}
      </div>
    </form>
  );
}