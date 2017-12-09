import { VIEW_CREATE } from '../../common/constants';

const namespace = VIEW_CREATE;

export const
  VIEW_NAME = VIEW_CREATE,
  AFTER_ACTION_NEW = 'new',

  /* ████████████████████████████████████████████
   * ███ ACTION TYPES (in alphabetical order) ███
   * ████████████████████████████████████████████
   */

  ALL_INSTANCE_FIELDS_VALIDATE = namespace + '/ALL_INSTANCE_FIELDS_VALIDATE',

  INSTANCE_FIELD_CHANGE = namespace + '/INSTANCE_FIELD_CHANGE',
  INSTANCE_FIELD_VALIDATE = namespace + '/INSTANCE_FIELD_VALIDATE',

  INSTANCE_VALIDATE_REQUEST = namespace + '/INSTANCE_VALIDATE_REQUEST',
  INSTANCE_VALIDATE_FAIL = namespace + '/INSTANCE_VALIDATE_FAIL',
  INSTANCE_VALIDATE_SUCCESS = namespace + '/INSTANCE_VALIDATE_SUCCESS',

  INSTANCE_SAVE = namespace + '/INSTANCE_SAVE',
  INSTANCE_SAVE_FAIL = namespace + '/INSTANCE_SAVE_FAIL',
  INSTANCE_SAVE_REQUEST = namespace + '/INSTANCE_SAVE_REQUEST',
  INSTANCE_SAVE_SUCCESS = namespace + '/INSTANCE_SAVE_SUCCESS',

  TAB_SELECT = namespace + '/TAB_SELECT',

  VIEW_INITIALIZE = namespace + '/VIEW_INITIALIZE',

  VIEW_REDIRECT_REQUEST = namespace + '/VIEW_REDIRECT_REQUEST',
  VIEW_REDIRECT_FAIL = namespace + '/VIEW_REDIRECT_FAIL',
  VIEW_REDIRECT_SUCCESS = namespace + '/VIEW_REDIRECT_SUCCESS';
