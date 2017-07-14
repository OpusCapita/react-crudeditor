import { constants as commonConstants } from '../../common';

export const
  VIEW_NAME = commonConstants.VIEW_CREATE,

  /*████████████████████████████████████████████*\
   *███ ACTION TYPES (in alphabetical order) ███*
  \*████████████████████████████████████████████*/

  INSTANCE_CREATE = VIEW_NAME + '/INSTANCE_CREATE',

  /*████████████████████████████████████████████████████*\
   *███ STATUSES OF THE VIEW (in alphabetical order) ███*
  \*████████████████████████████████████████████████████*/

  READY  = VIEW_NAME + '/READY',
  SAVING = VIEW_NAME + '/SAVING';
