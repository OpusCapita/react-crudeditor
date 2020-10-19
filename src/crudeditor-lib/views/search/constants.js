import { VIEW_SEARCH } from '../../common/constants';

const namespace = VIEW_SEARCH;

export const
  VIEW_NAME = VIEW_SEARCH,

  DEFAULT_OFFSET = 0,
  DEFAULT_ORDER = 'asc',

  /* ████████████████████████████████████████████
   * ███ ACTION TYPES (in alphabetical order) ███
   * ████████████████████████████████████████████
   */

  ALL_INSTANCES_SELECT = namespace + '/ALL_INSTANCES_SELECT',
  ALL_INSTANCES_DESELECT = namespace + '/ALL_INSTANCES_DESELECT',

  FORM_FILTER_RESET = namespace + '/FORM_FILTER_RESET',
  FORM_FILTER_UPDATE = namespace + '/FORM_FILTER_UPDATE',
  GOTO_PAGE_UPDATE = namespace + '/GOTO_PAGE_UPDATE',

  INSTANCES_SEARCH = namespace + '/INSTANCES_SEARCH',
  INSTANCES_SEARCH_FAIL = namespace + '/INSTANCES_SEARCH_FAIL',
  INSTANCES_SEARCH_REQUEST = namespace + '/INSTANCES_SEARCH_REQUEST',
  INSTANCES_SEARCH_SUCCESS = namespace + '/INSTANCES_SEARCH_SUCCESS',

  INSTANCE_SELECT = namespace + '/INSTANCE_SELECT',
  INSTANCE_DESELECT = namespace + '/INSTANCE_DESELECT',

  VIEW_INITIALIZE_REQUEST = namespace + '/VIEW_INITIALIZE_REQUEST',
  VIEW_INITIALIZE_FAIL = namespace + '/VIEW_INITIALIZE_FAIL',
  VIEW_INITIALIZE_SUCCESS = namespace + '/VIEW_INITIALIZE_SUCCESS',

  VIEW_REDIRECT_REQUEST = namespace + '/VIEW_REDIRECT_REQUEST',
  VIEW_REDIRECT_FAIL = namespace + '/VIEW_REDIRECT_FAIL',
  VIEW_REDIRECT_SUCCESS = namespace + '/VIEW_REDIRECT_SUCCESS',

  SEARCH_FORM_TOGGLE = namespace + '/SEARCH_FORM_TOGGLE';
