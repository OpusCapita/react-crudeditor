import { NotificationManager } from 'react-notifications';

// FIXME DONE: add INSTANCE_VALIDATE_FAIL and INSTANCE_VALIDATE_SUCCESS from Edit and Create Views.
// FIXME DONE: add FORM_FILTER_PARSE from Search View.

import {
  INSTANCE_SAVE_FAIL as CREATE_INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS as CREATE_INSTANCE_SAVE_SUCCESS,

  INSTANCE_FIELD_VALIDATE as CREATE_INSTANCE_FIELD_VALIDATE,
  ALL_INSTANCE_FIELDS_VALIDATE
} from './views/create/constants';

import {
  INSTANCE_SAVE_FAIL as EDIT_INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS as EDIT_INSTANCE_SAVE_SUCCESS,

  INSTANCE_FIELD_VALIDATE as EDIT_INSTANCE_FIELD_VALIDATE,
  INSTANCE_EDIT_SUCCESS
} from './views/edit/constants';

import {
  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_SUCCESS,
  ERROR_NOT_FOUND
} from './common/constants';

export const
  NOTIFICATION_ERROR = 'error',
  NOTIFICATION_SUCCESS = 'success',
  NOTIFICATION_VALIDATION_WARNING = 'warning';

// eventsMiddleware is a function which accepts context as an argument and
// returns a standard Redux middleware function
const eventsMiddleware = context => store => next => action => {
  switch (action.type) {
    case CREATE_INSTANCE_SAVE_SUCCESS:
      NotificationManager.create({
        id: NOTIFICATION_SUCCESS,
        type: 'success',
        timeOut: 3000,
        message: context.i18n.getMessage('crudEditor.objectSaved.message')
      });
      break;
    case EDIT_INSTANCE_SAVE_SUCCESS:
      NotificationManager.create({
        id: NOTIFICATION_SUCCESS,
        type: 'success',
        timeOut: 3000,
        message: context.i18n.getMessage('crudEditor.objectUpdated.message')
      });
      break;
    case CREATE_INSTANCE_SAVE_FAIL:
    case EDIT_INSTANCE_SAVE_FAIL:
      NotificationManager.create({
        id: NOTIFICATION_ERROR,
        type: 'error',
        timeOut: 3000,
        message: context.i18n.getMessage('crudEditor.objectSaveFailed.message')
      });
      break;
    case INSTANCES_DELETE_FAIL:
      NotificationManager.create({
        id: NOTIFICATION_ERROR,
        type: 'error',
        timeOut: 3000,
        message: action.payload === 1 ?
          context.i18n.getMessage('crudEditor.objectDeleteFailed.message') :
          context.i18n.getMessage('crudEditor.objectsDeleteFailed.message', {
            count: action.payload
          })
      });
      break;
    case INSTANCES_DELETE_SUCCESS:
      NotificationManager.create({
        id: NOTIFICATION_SUCCESS,
        type: 'success',
        timeOut: 3000,
        message: action.payload.instances.length === 1 ?
          context.i18n.getMessage('crudEditor.objectDeleted.message') :
          context.i18n.getMessage('crudEditor.objectsDeleted.message', {
            count: action.payload.instances.length
          })
      });
      break;
    case INSTANCE_EDIT_SUCCESS:
      if (action.payload.error === ERROR_NOT_FOUND) {
        NotificationManager.create({
          id: NOTIFICATION_ERROR,
          type: 'error',
          timeOut: 3000,
          message: context.i18n.getMessage('crudEditor.found.items.message', { count: 0 })
        });
      }
      break;
    default:
  }

  if (~[
    CREATE_INSTANCE_FIELD_VALIDATE,
    EDIT_INSTANCE_FIELD_VALIDATE,
    ALL_INSTANCE_FIELDS_VALIDATE
  ].indexOf(action.type)) {
    const before = store.getState().views[store.getState().common.activeViewName].errors.fields;

    // run the action
    next(action);

    const after = store.getState().views[store.getState().common.activeViewName].errors.fields;

    if (before === after) {
      NotificationManager.remove({ id: NOTIFICATION_VALIDATION_WARNING })
    } else {
      // are there any errors?
      const errs = Object.keys(after).reduce((arr, errKey) => arr.concat(after[errKey]), [])

      if (errs.length) {
        NotificationManager.create({
          id: NOTIFICATION_VALIDATION_WARNING,
          type: 'error',
          timeOut: 3000,
          message: context.i18n.getMessage('Some fields are invalid!')
          // FIXME: ask Alexey Sergeev Qs below.
          // TODO / TBD / do we need this / where do we get translations from
        });
      } else {
        NotificationManager.remove({ id: NOTIFICATION_VALIDATION_WARNING })
      }
    }
  }

  return next(action)
}

export default eventsMiddleware;
