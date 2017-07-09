import { commonConstants } from '../../common';

export const
  VIEW_NAME = commonConstants.VIEW_SEARCH,

  /*███████████████████████████████████████*\
   *███ ACTIONS (in alphabetical order) ███*
  \*███████████████████████████████████████*/

  FORM_FILTER_RESET        = VIEW_NAME + '/FORM_FILTER_RESET',
  FORM_FILTER_UPDATE       = VIEW_NAME + '/FORM_FILTER_UPDATE',
  INSTANCES_SEARCH         = VIEW_NAME + '/INSTANCES_SEARCH',
  INSTANCES_SEARCH_FAIL    = VIEW_NAME + '/INSTANCES_SEARCH_FAIL',
  INSTANCES_SEARCH_REQUEST = VIEW_NAME + '/INSTANCES_SEARCH_REQUEST',
  INSTANCES_SEARCH_SUCCESS = VIEW_NAME + '/INSTANCES_SEARCH_SUCCESS',

  /*████████████████████████████████████████*\
   *███ STATUSES (in alphabetical order) ███*
  \*████████████████████████████████████████*/

  READY         = VIEW_NAME + '/READY',
  SEARCHING     = VIEW_NAME + '/SEARCHING',
  UNINITIALIZED = VIEW_NAME + '/UNINITIALIZED';
