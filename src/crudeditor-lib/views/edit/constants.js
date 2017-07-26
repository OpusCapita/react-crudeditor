import { constants as commonConstants } from '../../common';

export const
  VIEW_NAME = commonConstants.VIEW_EDIT,

  AFTER_ACTION_NEW = VIEW_NAME + '/AFTER_ACTION_NEW',
  AFTER_ACTION_NEXT = VIEW_NAME + '/AFTER_ACTION_NEXT',

  /*████████████████████████████████████████████*\
   *███ ACTION TYPES (in alphabetical order) ███*
  \*████████████████████████████████████████████*/

  EDIT_EXIT = VIEW_NAME + '/EDIT_EXIT',

  INSTANCE_EDIT         = VIEW_NAME + '/INSTANCE_EDIT',
  INSTANCE_EDIT_FAIL    = VIEW_NAME + '/INSTANCE_EDIT_FAIL',
  INSTANCE_EDIT_REQUEST = VIEW_NAME + '/INSTANCE_EDIT_REQUEST',
  INSTANCE_EDIT_SUCCESS = VIEW_NAME + '/INSTANCE_EDIT_SUCCESS',

  INSTANCE_FIELD_VALIDATE = VIEW_NAME + '/INSTANCE_FIELD_VALIDATE',
  INSTANCE_FIELD_CHANGE   = VIEW_NAME + '/INSTANCE_FIELD_CHANGE',

  INSTANCE_SAVE         = VIEW_NAME + '/INSTANCE_SAVE',
  INSTANCE_SAVE_FAIL    = VIEW_NAME + '/INSTANCE_SAVE_FAIL',
  INSTANCE_SAVE_REQUEST = VIEW_NAME + '/INSTANCE_SAVE_REQUEST',
  INSTANCE_SAVE_SUCCESS = VIEW_NAME + '/INSTANCE_SAVE_SUCCESS',

  TAB_SELECT = VIEW_NAME + '/TAB_SELECT',

  /*████████████████████████████████████████████████████*\
   *███ STATUSES OF THE VIEW (in alphabetical order) ███*
  \*████████████████████████████████████████████████████*/

  EXTRACTING    = VIEW_NAME + '/EXTRACTING',
  DELETING      = VIEW_NAME + '/DELETING',
  READY         = VIEW_NAME + '/READY',
  UPDATING      = VIEW_NAME + '/UPDATING',
  UNINITIALIZED = VIEW_NAME + '/UNINITIALIZED';
