import { constants as commonConstants } from '../../common';

export const
  VIEW_NAME = commonConstants.VIEW_CREATE,

  /*████████████████████████████████████████████*\
   *███ ACTION TYPES (in alphabetical order) ███*
  \*████████████████████████████████████████████*/

  INSTANCE_CREATE       = VIEW_NAME + '/INSTANCE_CREATE',

  INSTANCE_SAVE         = VIEW_NAME + '/INSTANCE_SAVE',
  INSTANCE_SAVE_FAIL    = VIEW_NAME + '/INSTANCE_SAVE_FAIL',
  INSTANCE_SAVE_REQUEST = VIEW_NAME + '/INSTANCE_SAVE_REQUEST',
  INSTANCE_SAVE_SUCCESS = VIEW_NAME + '/INSTANCE_SAVE_SUCCESS',

  /*████████████████████████████████████████████████████*\
   *███ STATUSES OF THE VIEW (in alphabetical order) ███*
  \*████████████████████████████████████████████████████*/

  READY  = VIEW_NAME + '/READY',
  SAVING = VIEW_NAME + '/SAVING';
