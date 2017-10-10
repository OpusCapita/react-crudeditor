import { VIEW_CREATE } from '../../common/constants';

const namespace = VIEW_CREATE;

export const
  VIEW_NAME = VIEW_CREATE,

  /* ████████████████████████████████████████████*\
   *███ ACTION TYPES (in alphabetical order) ███*
  \*████████████████████████████████████████████*/

  INSTANCE_CREATE = namespace + '/INSTANCE_CREATE',

  INSTANCE_SAVE = namespace + '/INSTANCE_SAVE',
  INSTANCE_SAVE_FAIL = namespace + '/INSTANCE_SAVE_FAIL',
  INSTANCE_SAVE_REQUEST = namespace + '/INSTANCE_SAVE_REQUEST',
  INSTANCE_SAVE_SUCCESS = namespace + '/INSTANCE_SAVE_SUCCESS';
