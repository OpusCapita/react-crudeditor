import { VIEW_EDIT } from '../../common/constants';

const namespace = VIEW_EDIT;

export const
  VIEW_NAME = VIEW_EDIT,

  AFTER_ACTION_NEW = 'new',
  AFTER_ACTION_NEXT = 'next',

  /* ████████████████████████████████████████████*\
   *███ ACTION TYPES (in alphabetical order) ███*
  \*████████████████████████████████████████████*/

  INSTANCE_EDIT_FAIL = namespace + '/INSTANCE_EDIT_FAIL',
  INSTANCE_EDIT_REQUEST = namespace + '/INSTANCE_EDIT_REQUEST',
  INSTANCE_EDIT_SUCCESS = namespace + '/INSTANCE_EDIT_SUCCESS',
  INSTANCE_EDIT_ADJACENT = namespace + '/INSTANCE_EDIT_ADJACENT',

  INSTANCE_FIELD_CHANGE = namespace + '/INSTANCE_FIELD_CHANGE',
  INSTANCE_FIELD_VALIDATE = namespace + '/INSTANCE_FIELD_VALIDATE',

  ALL_INSTANCE_FIELDS_VALIDATE_FAIL = namespace + '/ALL_INSTANCE_FIELDS_VALIDATE_FAIL',

  INSTANCE_VALIDATE_REQUEST = namespace + '/INSTANCE_VALIDATE_REQUEST',
  INSTANCE_VALIDATE_FAIL = namespace + '/INSTANCE_VALIDATE_FAIL',
  INSTANCE_VALIDATE_SUCCESS = namespace + '/INSTANCE_VALIDATE_SUCCESS',

  INSTANCE_SAVE = namespace + '/INSTANCE_SAVE',
  INSTANCE_SAVE_FAIL = namespace + '/INSTANCE_SAVE_FAIL',
  INSTANCE_SAVE_REQUEST = namespace + '/INSTANCE_SAVE_REQUEST',
  INSTANCE_SAVE_SUCCESS = namespace + '/INSTANCE_SAVE_SUCCESS',

  TAB_SELECT = namespace + '/TAB_SELECT',

  VIEW_INITIALIZE_REQUEST = namespace + '/VIEW_INITIALIZE_REQUEST',
  VIEW_INITIALIZE_FAIL = namespace + '/VIEW_INITIALIZE_FAIL',
  VIEW_INITIALIZE_SUCCESS = namespace + '/VIEW_INITIALIZE_SUCCESS',

  VIEW_REDIRECT_REQUEST = namespace + '/VIEW_REDIRECT_REQUEST',
  VIEW_REDIRECT_FAIL = namespace + '/VIEW_REDIRECT_FAIL',
  VIEW_REDIRECT_SUCCESS = namespace + '/VIEW_REDIRECT_SUCCESS';
