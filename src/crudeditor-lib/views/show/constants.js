import { VIEW_SHOW } from '../../common/constants'

const namespace = VIEW_SHOW;

export const
  VIEW_NAME = VIEW_SHOW,

  /* ████████████████████████████████████████████
   * ███ ACTION TYPES (in alphabetical order) ███
   * ████████████████████████████████████████████
   */

  ADJACENT_INSTANCE_SHOW = namespace + '/ADJACENT_INSTANCE_SHOW',
  ADJACENT_INSTANCE_SHOW_FAIL = namespace + '/ADJACENT_INSTANCE_SHOW_FAIL',

  INSTANCE_SHOW_REQUEST = namespace + '/INSTANCE_SHOW_REQUEST',
  INSTANCE_SHOW_FAIL = namespace + '/INSTANCE_SHOW_FAIL',
  INSTANCE_SHOW_SUCCESS = namespace + '/INSTANCE_SHOW_SUCCESS',

  TAB_SELECT = namespace + '/TAB_SELECT',

  VIEW_REDIRECT_REQUEST = namespace + '/VIEW_REDIRECT_REQUEST',
  VIEW_REDIRECT_FAIL = namespace + '/VIEW_REDIRECT_FAIL',
  VIEW_REDIRECT_SUCCESS = namespace + '/VIEW_REDIRECT_SUCCESS',

  VIEW_INITIALIZE_REQUEST = namespace + '/VIEW_INITIALIZE_REQUEST',
  VIEW_INITIALIZE_FAIL = namespace + '/VIEW_INITIALIZE_FAIL',
  VIEW_INITIALIZE_SUCCESS = namespace + '/VIEW_INITIALIZE_SUCCESS';
