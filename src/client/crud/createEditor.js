import React from 'react';

import EditView from './components/EditView';

export const errorCodes = {
  NOT_FOUND: 1,
  INTERNAL_ERROR: 2,
  NOT_VALIDATE: 3,
};

const withAsync = function (promise, onRequest, onResponse, onError) {
  return class extends React.Component {
    componentDidMount = () => {
      this.result = promise.then((req) => {
        delete this.result;
        onResponse(req);
      }, (err) => {
        delete this.result;
        onError(err)
      });
    };

    componentWillUnmount = () => {
      //dispose the promise request
      this.result && this.result.cancel();
    };

    render() {
      return onRequest();
    }
  }
};

//enhanceViewReducers
//enhanceViews
const controller = function (dispatch, context) {
  const {api, entryName} = context;

  return {
    error(viewState) {
      const {message, code, source, searchState} = viewState;
    },
    editObject(viewState) {
    },
    edit(viewState) {
      const {id, searchState} = viewState;
      const {load} = api;

      return withAsync(load(id), () => {
        return <EditView inTransition={true} mode="edit"
                         entryName={entryName}/>
      }, (res) => {
        dispatch('editObject', {object: res.body, searchState});
      }, (err) => {
        if (err.status === 404) {
          dispatch('error', {message: `Object by ID [${id}] not found.`, code: errorCodes.NOT_FOUND, source: 'edit'});
        } else {
          dispatch('error', {message: `Object by ID [${id}] could not load`, code: errorCodes.INTERNAL_ERROR, source: 'edit'});
        }
      })
    },
    create(viewState) {
      const {object, searchState} = viewState;
      // return <EditView mode="create" entryName={entryName}/>
    },
    delete(viewState) {
      const {selected} = viewState;
    },
    search(viewState) {}
  }
};

const defaultViews = function(dispatch, context) {
  const {api, validate} = context;

  return {
    view(viewState) {},
    edit(viewState) {
      const {object, filterParams} = viewState;

      return {
        state: {
          mode: 'edit',
          object,
        },
        // component: EditView
      }
    },
    load(viewState) {
      const { load } = api;
      const { id, filterParams } = viewState;

      load({id}).then((res) => {
        dispatch('edit', {object: res.body, errors: {}, filterParams});
      }, (err) => {
        if (err.status === 404) {
          dispatch('error', {message: `Object by ID [${id}] not found.`, code: errorCodes.NOT_FOUND});
        } else {
          dispatch('error', {message: `Object by ID [${id}] could not load`, code: errorCodes.INTERNAL_ERROR});
        }
      });

      // return <EditView mode="load" object={} errors={}/>;
    }
  }
};




const defaultFormActions = function(dispatch, formState, context) {
  const {mode, values, errors} = formState;

  const cancel = function () {
    dispatch('cancel')
  };

  const save = function () {

  };

  const deleteAction = function () {};
  const saveAndNew = function () {};
  const saveAndNext = function () {};

  if (mode === 'edit' || mode === '') {
    return {
      cancel,
      save,
      saveAndNew
    }
  } else if (mode === 'create') {
    return {
      cancel,
      delete: deleteAction,
      saveAndNew,
      saveAndNext,
      save
    }
  } else if (mode === 'view') {
    return {
      cancel
    }
  }
};

const defaultConfig = {
  formActions: defaultFormActions
};

export default function(customConfig = {}) {
  const {
    entityName,
    api
  } = customConfig;

  if (!entityName) {
    throw new Error("Illegal argument, config should by contains [entityName]");
  }

  if (!api) {
    throw new Error("Illegal argument, config should by contains [api]");
  }

  const config = {
    ...defaultConfig,
    ...customConfig
  }
}