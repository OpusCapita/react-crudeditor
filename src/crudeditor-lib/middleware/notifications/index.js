import React from 'react';
import { NotificationManager } from 'react-notifications';
import ExpandableNotice from './ExpandableNotice.react';
import { getModelMessage, getFieldErrorMessage, getFieldLabel, getTabLabel } from '../../../components/lib';

import {
  INSTANCES_DELETE_FAIL,
  INSTANCES_DELETE_SUCCESS
} from '../../common/constants';

import {
  INSTANCE_SAVE_FAIL as CREATE_INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS as CREATE_INSTANCE_SAVE_SUCCESS,
  INSTANCE_VALIDATE_FAIL as CREATE_INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS as CREATE_INSTANCE_VALIDATE_SUCCESS,
  ALL_INSTANCE_FIELDS_VALIDATE_FAIL as CREATE_ALL_INSTANCE_FIELDS_VALIDATE_FAIL,
  VIEW_REDIRECT_FAIL as CREATE_VIEW_REDIRECT_FAIL
} from '../../views/create/constants';

import {
  INSTANCE_SAVE_FAIL as EDIT_INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS as EDIT_INSTANCE_SAVE_SUCCESS,
  INSTANCE_VALIDATE_FAIL as EDIT_INSTANCE_VALIDATE_FAIL,
  INSTANCE_VALIDATE_SUCCESS as EDIT_INSTANCE_VALIDATE_SUCCESS,
  ALL_INSTANCE_FIELDS_VALIDATE_FAIL as EDIT_ALL_INSTANCE_FIELDS_VALIDATE_FAIL,
  VIEW_REDIRECT_FAIL as EDIT_VIEW_REDIRECT_FAIL,
  ADJACENT_INSTANCE_EDIT_FAIL
} from '../../views/edit/constants';

import {
  VIEW_REDIRECT_FAIL as SEARCH_VIEW_REDIRECT_FAIL
} from '../../views/search/constants';

import {
  VIEW_REDIRECT_FAIL as SHOW_VIEW_REDIRECT_FAIL,
  ADJACENT_INSTANCE_SHOW_FAIL
} from '../../views/show/constants';

import {
  VIEW_REDIRECT_FAIL as ERROR_VIEW_REDIRECT_FAIL
} from '../../views/error/constants';

export const
  NOTIFICATION_ERROR = 'error',
  NOTIFICATION_SUCCESS = 'success',
  NOTIFICATION_VALIDATION_ERROR = 'instanceValidationError';

const
  SUCCESS_NOTIFICATION_TIMEOUT = 3000,
  ERROR_NOTIFICATION_TIMEOUT = 6000;

const isFieldInLayout = ({ fieldName, layout }) => layout.
  filter(fieldOrSection => fieldOrSection.field ?
    fieldOrSection.field === fieldName : // this is a field
    isFieldInLayout({ fieldName, layout: fieldOrSection }) // this is a section, which is a nested layout
  ).length > 0;

/*
 * If 1st argument represents an array of
 *   - tabs
 *   or
 *   - sections and/or fields
 * the function returns
 *   - an element of the array with a field of the specified fieldName
 *   or
 *   - falsy value if there is no such element.
 *
 * If 1st argument represents an field-object, the function returns
 *   - this field-object if it has specified fieldName
 *   or
 *   - falsy value otherwise.
 */
const findLayoutByField = (layouts, fieldName) => {
  if (layouts.field === fieldName) {
    return layouts;
  }

  let foundLayout;

  if (Array.isArray(layouts)) {
    layouts.some(layout => {
      if (findLayoutByField(layout, fieldName)) {
        foundLayout = layout;
      }

      return foundLayout;
    });
  }

  return foundLayout;
}

// eventsMiddleware is a function which accepts i18n, modelDefinition as arguments and
// returns a Redux middleware function
const eventsMiddleware = /* istanbul ignore next */ ({ i18n, modelDefinition }) => store => next => action => {
  const getErrorMessages = errors => (Array.isArray(errors) ? errors : [errors]).
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
    filter((message, index, messages) =>
      message &&
      (
        index === 0 ||
        messages.slice(0, index).indexOf(message) === -1
      )
    );

  const getFieldErrorMessages = ({ errors, formLayout, activeTab }) => {
    const tabNames = [];

    let rez = (Array.isArray(errors) ? errors : [errors]).
      filter(err => err && typeof err === 'object').
      map(({ field, ...err }) => {
        const tabName = (findLayoutByField(formLayout, field) || {}).tab;

        if (tabName && tabNames.indexOf(tabName) === -1) {
          tabNames.push(tabName);
        }

        return {
          ...(tabName && { tab: getTabLabel({ i18n, name: tabName }) }),
          field: getFieldLabel({ i18n, name: field }),
          message: err.id ?
            getFieldErrorMessage({
              error: err,
              i18n,
              fieldName: field
            }) :
            err.message
        };
      }).
      filter(({ field, message }, index, errors) =>
        message &&
        (
          index === 0 ||
          errors.slice(0, index).some(err => err.field === field && err.message === message)
        )
      );

    return activeTab && tabNames.length === 1 && tabNames[0] === activeTab.tab ?
      // Removing "tab" key if all "tab"-s have active tab name as their value
      rez.map(({ field, message }) => ({ field, message })) :
      rez;
  }

  /*
   * Each case-clause is surrounded with curly braces to establish its own
   * block scope -- thus local let/const variables can be declared.
   */
  switch (action.type) {
    case CREATE_INSTANCE_SAVE_SUCCESS: {
      NotificationManager.create({
        id: NOTIFICATION_SUCCESS,
        type: 'success',
        timeOut: SUCCESS_NOTIFICATION_TIMEOUT,
        message: i18n.getMessage('common.CrudEditor.objectSaved.message')
      });
      break;
    }

    case EDIT_INSTANCE_SAVE_SUCCESS: {
      NotificationManager.create({
        id: NOTIFICATION_SUCCESS,
        type: 'success',
        timeOut: SUCCESS_NOTIFICATION_TIMEOUT,
        message: i18n.getMessage('common.CrudEditor.objectUpdated.message')
      });
      break;
    }

    case CREATE_INSTANCE_SAVE_FAIL:
    case EDIT_INSTANCE_SAVE_FAIL: {
      const detailMessages = getErrorMessages(action.payload);
      NotificationManager.create({
        id: NOTIFICATION_ERROR,
        type: 'error',
        timeOut: ERROR_NOTIFICATION_TIMEOUT,
        message: detailMessages.length ?
          (
            <ExpandableNotice
              id={NOTIFICATION_ERROR}
              message={i18n.getMessage('common.CrudEditor.objectSaveFailed.message')}
              details={
                detailMessages.map(message => (
                  <div key={message} style={{ margin: '3px' }}>
                    <p>{message}</p>
                  </div>
                ))
              }
            />
          ) :
          i18n.getMessage('common.CrudEditor.objectSaveFailed.message')
      });
      break;
    }

    case INSTANCES_DELETE_FAIL: {
      const { count, errors } = action.payload;
      const mainMessage = isNaN(count) || count === 1 ?
        i18n.getMessage('common.CrudEditor.objectDeleteFailed.message') :
        i18n.getMessage('common.CrudEditor.objectsDeleteFailed.message', { count });
      const detailMessages = getErrorMessages(errors);
      NotificationManager.create({
        id: NOTIFICATION_ERROR,
        type: 'error',
        timeOut: ERROR_NOTIFICATION_TIMEOUT,
        message: detailMessages.length ?
          (
            <ExpandableNotice
              id={NOTIFICATION_ERROR}
              message={mainMessage}
              details={
                detailMessages.map(message => (
                  <div key={message} style={{ margin: '3px' }}>
                    <p>{message}</p>
                  </div>
                ))
              }
            />
          ) :
          mainMessage
      });
      break;
    }

    case INSTANCES_DELETE_SUCCESS: {
      const labels = [];
      const { count, instances } = action.payload;

      if (instances) { // Actually deleted instances are known.
        instances.every(instance => {
          const label = modelDefinition.ui.instanceLabel(instance);

          if (label) {
            labels.push(label);
            return true;
          }

          labels.length = 0;
          return false;
        });
      }

      NotificationManager.create({
        id: NOTIFICATION_SUCCESS,
        type: 'success',
        timeOut: SUCCESS_NOTIFICATION_TIMEOUT,
        message: count === 1 ?
          i18n.getMessage('common.CrudEditor.objectDeleted.message') :
          i18n.getMessage('common.CrudEditor.objectsDeleted.message', {
            labels: labels.join(', ') // Empty string if there is an empty label for at least one deleted isntance.
          })
      });
      break;
    }

    case ADJACENT_INSTANCE_EDIT_FAIL:
    case ADJACENT_INSTANCE_SHOW_FAIL: {
      NotificationManager.create({
        id: NOTIFICATION_ERROR,
        type: 'error',
        timeOut: ERROR_NOTIFICATION_TIMEOUT,
        message: i18n.getMessage('common.CrudEditor.found.items.message', { count: 0 })
      });
      break;
    }

    case CREATE_INSTANCE_VALIDATE_FAIL:
    case EDIT_INSTANCE_VALIDATE_FAIL: {
      // in case 'model.validate' fails
      const detailMessages = getErrorMessages(action.payload);
      NotificationManager.create({
        id: NOTIFICATION_VALIDATION_ERROR,
        type: 'error',
        timeOut: ERROR_NOTIFICATION_TIMEOUT,
        message: detailMessages.length === 1 && detailMessages[0] ||
          detailMessages.length === 0 && i18n.getMessage('common.CrudEditor.default.invalid.validator.message') ||
          (
            <ExpandableNotice
              id={NOTIFICATION_VALIDATION_ERROR}
              message={i18n.getMessage('common.CrudEditor.default.invalid.validator.message')}
              details={
                detailMessages.map(message => (
                  <div key={message} style={{ margin: '3px' }}>
                    <p>{message}</p>
                  </div>
                ))
              }
            />
          )
      });
      break;
    }

    case CREATE_INSTANCE_VALIDATE_SUCCESS:
    case EDIT_INSTANCE_VALIDATE_SUCCESS: {
      NotificationManager.remove({ id: NOTIFICATION_VALIDATION_ERROR });
      break;
    }

    case SEARCH_VIEW_REDIRECT_FAIL:
    case CREATE_VIEW_REDIRECT_FAIL:
    case EDIT_VIEW_REDIRECT_FAIL:
    case SHOW_VIEW_REDIRECT_FAIL:
    case ERROR_VIEW_REDIRECT_FAIL: {
      const detailMessages = getErrorMessages(action.payload);
      NotificationManager.create({
        id: NOTIFICATION_ERROR,
        type: 'error',
        timeOut: ERROR_NOTIFICATION_TIMEOUT,
        message: detailMessages.length === 1 && detailMessages[0] ||
          detailMessages.length === 0 && i18n.getMessage('common.CrudEditor.default.errorOccurred.message') ||
          (
            <ExpandableNotice
              id={NOTIFICATION_ERROR}
              message={i18n.getMessage('common.CrudEditor.default.errorOccurred.message')}
              details={
                detailMessages.map(message => (
                  <div key={message} style={{ margin: '3px' }}>
                    <p>{message}</p>
                  </div>
                ))
              }
            />
          )
      });
      break;
    }

    case CREATE_ALL_INSTANCE_FIELDS_VALIDATE_FAIL:
    case EDIT_ALL_INSTANCE_FIELDS_VALIDATE_FAIL: {
      const storeState = store.getState();
      const activeView = storeState.views[storeState.common.activeViewName];
      const detailMessages = getFieldErrorMessages({
        errors: action.payload,
        formLayout: activeView.formLayout,
        activeTab: activeView.activeTab
      });
      NotificationManager.create({
        id: NOTIFICATION_ERROR,
        type: 'error',
        timeOut: ERROR_NOTIFICATION_TIMEOUT,
        message: detailMessages.length ?
          (
            <ExpandableNotice
              id={NOTIFICATION_ERROR}
              message={i18n.getMessage('common.CrudEditor.objectSaveFailed.message')}
              detailsHeader='Errors in fields'
              details={
                detailMessages.map(({ tab, field, message }) => (
                  <div key={`${field}:${message}`} style={{ margin: '3px' }}>
                    {
                      tab ? (
                        <p>Tab: {tab}<br/>Field: {field}<br/>Error: {message}</p>
                      ) : (
                        <p>Field: {field}<br/>Error: {message}</p>
                      )
                    }
                  </div>
                ))
              }
            />
          ) :
          i18n.getMessage('common.CrudEditor.objectSaveFailed.message')
      });
      break;
    }

    default:
  }

  return next(action);
}

export default eventsMiddleware;
