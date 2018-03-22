import { NotificationManager } from 'react-notifications';
import { getModelMessage } from '../../components/lib';

import {
  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_SUCCESS
} from '../common/constants';

import {
  INSTANCE_SAVE_FAIL as CREATE_INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS as CREATE_INSTANCE_SAVE_SUCCESS,
  INSTANCE_VALIDATE_FAIL as CREATE_INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS as CREATE_INSTANCE_VALIDATE_SUCCESS,
  ALL_INSTANCE_FIELDS_VALIDATE as CREATE_ALL_INSTANCE_FIELDS_VALIDATE,
  VIEW_REDIRECT_FAIL as CREATE_VIEW_REDIRECT_FAIL
} from '../views/create/constants';

import {
  INSTANCE_SAVE_FAIL as EDIT_INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS as EDIT_INSTANCE_SAVE_SUCCESS,
  INSTANCE_VALIDATE_FAIL as EDIT_INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS as EDIT_INSTANCE_VALIDATE_SUCCESS,
  ALL_INSTANCE_FIELDS_VALIDATE as EDIT_ALL_INSTANCE_FIELDS_VALIDATE,
  VIEW_REDIRECT_FAIL as EDIT_VIEW_REDIRECT_FAIL,
  ADJACENT_INSTANCE_EDIT_FAIL
} from '../views/edit/constants';

import {
  VIEW_REDIRECT_FAIL as SEARCH_VIEW_REDIRECT_FAIL
} from '../views/search/constants';

import {
  VIEW_REDIRECT_FAIL as SHOW_VIEW_REDIRECT_FAIL,
  ADJACENT_INSTANCE_SHOW_FAIL
} from '../views/show/constants';

import {
  VIEW_REDIRECT_FAIL as ERROR_VIEW_REDIRECT_FAIL
} from '../views/error/constants';

// this polyfill is required for IE11 because
// react-notifications module uses Object.assign
// source: mdn:Object/assign
/* eslint-disable */
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
/* eslint-enable */
// polyfill end

export const
  NOTIFICATION_ERROR = 'error',
  NOTIFICATION_SUCCESS = 'success',
  NOTIFICATION_VALIDATION_ERROR = 'instanceValidationError';

const
  SUCCESS_NOTIFICATION_TIMEOUT = 3000,
  ERROR_NOTIFICATION_TIMEOUT = 3000;

// eventsMiddleware is a function which accepts i18n as an argument and
// returns a Redux middleware function
const eventsMiddleware = /* istanbul ignore next */ ({ i18n, modelDefinition }) => store => next => action => {
  switch (action.type) {
    case CREATE_INSTANCE_SAVE_SUCCESS:
      NotificationManager.create({
        id: NOTIFICATION_SUCCESS,
        type: 'success',
        timeOut: SUCCESS_NOTIFICATION_TIMEOUT,
        message: i18n.getMessage('crudEditor.objectSaved.message')
      });
      break;
    case EDIT_INSTANCE_SAVE_SUCCESS:
      NotificationManager.create({
        id: NOTIFICATION_SUCCESS,
        type: 'success',
        timeOut: SUCCESS_NOTIFICATION_TIMEOUT,
        message: i18n.getMessage('crudEditor.objectUpdated.message')
      });
      break;
    case CREATE_INSTANCE_SAVE_FAIL:
    case EDIT_INSTANCE_SAVE_FAIL:
      NotificationManager.create({
        id: NOTIFICATION_ERROR,
        type: 'error',
        timeOut: ERROR_NOTIFICATION_TIMEOUT,
        message: i18n.getMessage('crudEditor.objectSaveFailed.message')
      });
      break;
    case INSTANCES_DELETE_FAIL:
      NotificationManager.create({
        id: NOTIFICATION_ERROR,
        type: 'error',
        timeOut: ERROR_NOTIFICATION_TIMEOUT,
        message: action.payload === 1 ?
          i18n.getMessage('crudEditor.objectDeleteFailed.message') :
          i18n.getMessage('crudEditor.objectsDeleteFailed.message', {
            count: action.payload
          })
      });
      break;
    case INSTANCES_DELETE_SUCCESS:
      let labels = [];

      action.payload.instances.some(instance => {
        const label = modelDefinition.ui.instanceLabel(instance);

        if (label) {
          labels.push(label);
          return false;
        } else {
          labels = [];
          return true;
        }
      });

      NotificationManager.create({
        id: NOTIFICATION_SUCCESS,
        type: 'success',
        timeOut: SUCCESS_NOTIFICATION_TIMEOUT,
        message: action.payload.instances.length === 1 ?
          i18n.getMessage('crudEditor.objectDeleted.message') :
          i18n.getMessage('crudEditor.objectsDeleted.message', {
            labels: labels.join(', ') // Empty string if there is an empty label for at least one deleted isntance.
          })
      });
      break;
    case ADJACENT_INSTANCE_EDIT_FAIL:
    case ADJACENT_INSTANCE_SHOW_FAIL:
      NotificationManager.create({
        id: NOTIFICATION_ERROR,
        type: 'error',
        timeOut: ERROR_NOTIFICATION_TIMEOUT,
        message: i18n.getMessage('crudEditor.found.items.message', { count: 0 })
      });
      break;
    case CREATE_INSTANCE_VALIDATE_FAIL:
    case EDIT_INSTANCE_VALIDATE_FAIL:
      // in case 'model.validate' fails
      NotificationManager.create({
        id: NOTIFICATION_VALIDATION_ERROR,
        type: 'error',
        timeOut: ERROR_NOTIFICATION_TIMEOUT,
        message: (Array.isArray(action.payload) ? action.payload : [action.payload]).
          filter(err => err && typeof err === 'object').
          map(({ id, message, args }) => id ?
            getModelMessage({
              i18n,
              key: `model.error.${id}`,
              args,
              defaultMessage: message
            }) :
            message
          ).
          filter(Boolean).
          join(' | ') ||
        i18n.getMessage('default.invalid.validator.message')
      });
      break;
    case CREATE_INSTANCE_VALIDATE_SUCCESS:
    case EDIT_INSTANCE_VALIDATE_SUCCESS:
      NotificationManager.remove({ id: NOTIFICATION_VALIDATION_ERROR });
      break;
    case SEARCH_VIEW_REDIRECT_FAIL:
    case CREATE_VIEW_REDIRECT_FAIL:
    case EDIT_VIEW_REDIRECT_FAIL:
    case SHOW_VIEW_REDIRECT_FAIL:
    case ERROR_VIEW_REDIRECT_FAIL:
      NotificationManager.create({
        id: NOTIFICATION_ERROR,
        type: 'error',
        timeOut: ERROR_NOTIFICATION_TIMEOUT,
        message: (Array.isArray(action.payload) ? action.payload : [action.payload]).
          filter(err => err && typeof err === 'object' && err.message).
          map(({ message }) => message).
          join(' | ') ||
          i18n.getMessage('default.errorOccurred.message')
      });
      break;
    case CREATE_ALL_INSTANCE_FIELDS_VALIDATE:
    case EDIT_ALL_INSTANCE_FIELDS_VALIDATE:
      const result = next(action);
      const storeState = store.getState();
      const currentView = storeState.common.activeViewName;
      const fieldErrors = storeState.views[currentView].errors.fields;

      if (Object.keys(fieldErrors).length > 0) {
        NotificationManager.create({
          id: NOTIFICATION_ERROR,
          type: 'error',
          timeOut: ERROR_NOTIFICATION_TIMEOUT,
          message: i18n.getMessage('crudEditor.objectSaveFailed.message')
        });
      }

      return result;
    default:
  }

  return next(action);
}

export default eventsMiddleware;
