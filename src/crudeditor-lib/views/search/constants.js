import { VIEW_SEARCH } from '../../common/constants';

export const
  VIEW_NAME = VIEW_SEARCH,

  /*████████████████████████████████████████████*\
   *███ ACTION TYPES (in alphabetical order) ███*
  \*████████████████████████████████████████████*/

  ALL_INSTANCES_SELECT     = VIEW_NAME + '/ALL_INSTANCES_SELECT',
  ALL_INSTANCES_DESELECT   = VIEW_NAME + '/ALL_INSTANCES_DESELECT',

  FORM_FILTER_RESET        = VIEW_NAME + '/FORM_FILTER_RESET',
  FORM_FILTER_UPDATE       = VIEW_NAME + '/FORM_FILTER_UPDATE',
  FORM_FILTER_PARSE        = VIEW_NAME + '/FORM_FILTER_PARSE',

  INSTANCES_SEARCH         = VIEW_NAME + '/INSTANCES_SEARCH',
  INSTANCES_SEARCH_FAIL    = VIEW_NAME + '/INSTANCES_SEARCH_FAIL',
  INSTANCES_SEARCH_REQUEST = VIEW_NAME + '/INSTANCES_SEARCH_REQUEST',
  INSTANCES_SEARCH_SUCCESS = VIEW_NAME + '/INSTANCES_SEARCH_SUCCESS',

  INSTANCE_SELECT          = VIEW_NAME + '/INSTANCE_SELECT',
  INSTANCE_DESELECT        = VIEW_NAME + '/INSTANCE_DESELECT',

  /*████████████████████████████████████████████████████*\
   *███ STATUSES OF THE VIEW (in alphabetical order) ███*
  \*████████████████████████████████████████████████████*/

  DELETING      = VIEW_NAME + '/DELETING',
  READY         = VIEW_NAME + '/READY',
  SEARCHING     = VIEW_NAME + '/SEARCHING',
  UNINITIALIZED = VIEW_NAME + '/UNINITIALIZED';
