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
  INSTANCE_SAVE_SUCCESS = namespace + '/INSTANCE_SAVE_SUCCESS',
  INSTANCE_CREATE_FAIL = namespace + '/INSTANCE_CREATE_FAIL',
  INSTANCE_CREATE_REQUEST = namespace + '/INSTANCE_CREATE_REQUEST',
  INSTANCE_CREATE_SUCCESS = namespace + '/INSTANCE_CREATE_SUCCESS',

  /* ████████████████████████████████████████████████████*\
   *███ STATUSES OF THE VIEW (in alphabetical order) ███*
  \*████████████████████████████████████████████████████*/

  READY = namespace + '/READY',
  SAVING = namespace + '/SAVING',

  VIEW_EXIT = namespace + '/VIEW_EXIT',
  TAB_SELECT = namespace + '/TAB_SELECT',

  VIEW_INITIALIZE_REQUEST = namespace + '/VIEW_INITIALIZE_REQUEST',
  VIEW_INITIALIZE_FAIL = namespace + '/VIEW_INITIALIZE_FAIL',
  VIEW_INITIALIZE_SUCCESS = namespace + '/VIEW_INITIALIZE_SUCCESS',

  VIEW_REDIRECT_SUCCESS = namespace + '/VIEW_REDIRECT_SUCCESS',
  VIEW_REDIRECT_REQUEST = namespace + '/VIEW_REDIRECT_REQUEST',
  VIEW_REDIRECT_FAIL = namespace + '/VIEW_REDIRECT_FAIL',

  INITIALIZING = namespace + '/INITIALIZING',
  REDIRECTING = namespace + '/REDIRECTING',
  UPDATING = namespace + '/UPDATING'
