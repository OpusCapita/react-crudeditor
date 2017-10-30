import { NotificationManager } from 'react-notifications';

import {
  INSTANCE_SAVE_FAIL as CREATE_INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS as CREATE_INSTANCE_SAVE_SUCCESS,

  INSTANCE_FIELD_VALIDATE as CREATE_INSTANCE_FIELD_VALIDATE,
  ALL_INSTANCE_FIELDS_VALIDATE
} from './views/create/constants';
import {
  INSTANCE_SAVE_FAIL as EDIT_INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS as EDIT_INSTANCE_SAVE_SUCCESS,

  INSTANCE_FIELD_VALIDATE as EDIT_INSTANCE_FIELD_VALIDATE
} from './views/edit/constants';
import {
  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_SUCCESS
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
        message: context.i18n.getMessage('crudEditor.objectDeleteFailed.message')
      });
      break;
    case INSTANCES_DELETE_SUCCESS:
      NotificationManager.create({
        id: NOTIFICATION_SUCCESS,
        type: 'success',
        timeOut: 3000,
        message: context.i18n.getMessage('crudEditor.objectsDeleted.message', {
          count: action.payload.instances.length
        })
      });
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
          message: context.i18n.getMessage('Dummy field validation warning')
        });
      } else {
        NotificationManager.remove({ id: NOTIFICATION_VALIDATION_WARNING })
      }
    }
  }

  return next(action)
}

export default eventsMiddleware