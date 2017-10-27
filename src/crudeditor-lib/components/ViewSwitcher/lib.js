import {
  VIEW_SEARCH,
  VIEW_CREATE,
  VIEW_EDIT
} from '../../common/constants';

export const checkErrorsObjects = (state, views) => {
  views.forEach(
    viewName => {
      const err = {};
      const errors = state.views[viewName].errors;
      if (!errors || typeof errors !== 'object' || Array.isArray(errors)) {
        err.message = `'errors' object is required in state of '${viewName}' view`;
        console.error(err.message);
        throw err
      }

      if (!errors.general) {
        err.message = `'errors' object should contain 'general' property of type Array;
        not found in '${viewName}' view state`;
        console.error(err.message);
        throw err
      }

      if (!Array.isArray(errors.general)) {
        err.message = `'errors.general' should be an Array in '${viewName}' view state`;
        console.error(err.message);
        throw err
      }

      if (~[VIEW_CREATE, VIEW_EDIT, VIEW_SEARCH].indexOf(viewName) && !errors.fields) {
        err.message = `'errors' object should contain 'field' property of type Object;
        not found in '${viewName}' view state`;
        console.error(err.message);
        throw err
      }

      if (
        errors.fields !== undefined &&
        (typeof errors.fields !== 'object' || Array.isArray(errors.fields))
      ) {
        err.message = `'errors.fields' should be an Object in '${viewName}' view state`;
        console.error(err.message);
        throw err
      }

      if (Object.keys(errors).some(key => ['general', 'fields'].indexOf(key) === -1)) {
        err.message = `'errors' should contain only 'general' and 'fields' properties in '${viewName}' view state`;
        console.error(err.message);
        throw err
      }
    }
  )
}
