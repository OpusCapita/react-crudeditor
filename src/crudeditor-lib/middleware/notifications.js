import { NotificationManager } from 'react-notifications';

import {
  INSTANCE_SAVE_FAIL as CREATE_INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS as CREATE_INSTANCE_SAVE_SUCCESS,
  // ALL_INSTANCE_FIELDS_VALIDATE,
  INSTANCE_VALIDATE_FAIL as CREATE_INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS as CREATE_INSTANCE_VALIDATE_SUCCESS,
  ALL_INSTANCE_FIELDS_VALIDATE_FAIL as CREATE_ALL_INSTANCE_FIELDS_VALIDATE_FAIL
} from '../views/create/constants';

import {
  INSTANCE_SAVE_FAIL as EDIT_INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS as EDIT_INSTANCE_SAVE_SUCCESS,
  INSTANCE_EDIT_SUCCESS,
  INSTANCE_VALIDATE_FAIL as EDIT_INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS as EDIT_INSTANCE_VALIDATE_SUCCESS,
  ALL_INSTANCE_FIELDS_VALIDATE_FAIL as EDIT_ALL_INSTANCE_FIELDS_VALIDATE_FAIL
} from '../views/edit/constants';

import {
  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_SUCCESS,
  ERROR_NOT_FOUND
} from '../common/constants';

export const
  NOTIFICATION_ERROR = 'error',
  NOTIFICATION_SUCCESS = 'success',
  NOTIFICATION_VALIDATION_WARNING = 'warning',
  NOTIFICATION_VALIDATION_ERROR = 'instanceValidationError';

const
  SUCCESS_NOTIFICATION_TIMEOUT = 3000,
  ERROR_NOTIFICATION_TIMEOUT = 3000;

// eventsMiddleware is a function which accepts context as an argument and
// returns a standard Redux middleware function
const eventsMiddleware = ({ context, modelDefinition }) => store => next => action => {
  console.log(action)
  switch (action.type) {
    case CREATE_INSTANCE_SAVE_SUCCESS:
      NotificationManager.create({
        id: NOTIFICATION_SUCCESS,
        type: 'success',
        timeOut: SUCCESS_NOTIFICATION_TIMEOUT,
        message: context.i18n.getMessage('crudEditor.objectSaved.message')
      });
      break;
    case EDIT_INSTANCE_SAVE_SUCCESS:
      NotificationManager.create({
        id: NOTIFICATION_SUCCESS,
        type: 'success',
        timeOut: SUCCESS_NOTIFICATION_TIMEOUT,
        message: context.i18n.getMessage('crudEditor.objectUpdated.message')
      });
      break;
    case CREATE_INSTANCE_SAVE_FAIL:
    case EDIT_INSTANCE_SAVE_FAIL:
    case EDIT_ALL_INSTANCE_FIELDS_VALIDATE_FAIL:
    case CREATE_ALL_INSTANCE_FIELDS_VALIDATE_FAIL:
      NotificationManager.create({
        id: NOTIFICATION_ERROR,
        type: 'error',
        timeOut: ERROR_NOTIFICATION_TIMEOUT,
        message: context.i18n.getMessage('crudEditor.objectSaveFailed.message')
      });
      break;
    case INSTANCES_DELETE_FAIL:
      NotificationManager.create({
        id: NOTIFICATION_ERROR,
        type: 'error',
        timeOut: ERROR_NOTIFICATION_TIMEOUT,
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
        timeOut: SUCCESS_NOTIFICATION_TIMEOUT,
        message: action.payload.instances.length === 1 ?
          context.i18n.getMessage('crudEditor.objectDeleted.message') :
          context.i18n.getMessage('crudEditor.objectsDeleted.message', {
            labels: action.payload.instances.map(modelDefinition.ui.instanceLabel).join(', ')
          })
      });
      break;
    case INSTANCE_EDIT_SUCCESS:
      if (action.payload.error === ERROR_NOT_FOUND) {
        NotificationManager.create({
          id: NOTIFICATION_ERROR,
          type: 'error',
          timeOut: ERROR_NOTIFICATION_TIMEOUT,
          message: context.i18n.getMessage('crudEditor.found.items.message', { count: 0 })
        });
      }
      break;
    case CREATE_INSTANCE_VALIDATE_FAIL:
    case EDIT_INSTANCE_VALIDATE_FAIL:
      // in case 'model.validate' fails
      NotificationManager.create({
        id: NOTIFICATION_VALIDATION_ERROR,
        type: 'error',
        timeOut: ERROR_NOTIFICATION_TIMEOUT,
        message: context.i18n.getMessage('default.invalid.validator.message')
      });
      break;
    case CREATE_INSTANCE_VALIDATE_SUCCESS:
    case EDIT_INSTANCE_VALIDATE_SUCCESS:
      NotificationManager.remove({ id: NOTIFICATION_VALIDATION_ERROR });
      break;
    default:
  }

  return next(action)
}

export default eventsMiddleware;
