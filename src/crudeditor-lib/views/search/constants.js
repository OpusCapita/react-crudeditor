import { VIEW_SEARCH } from '../../common/constants';

const namespace = VIEW_SEARCH;

import {
  FIELD_TYPE_DATE_STRING,
  FIELD_TYPE_NUMBER_STRING,
} from '../../../data-types-lib/constants';

export const
  VIEW_NAME = VIEW_SEARCH,
  RANGE_FIELD_TYPES = [FIELD_TYPE_DATE_STRING, FIELD_TYPE_NUMBER_STRING],

  /*████████████████████████████████████████████*\
   *███ ACTION TYPES (in alphabetical order) ███*
  \*████████████████████████████████████████████*/

  ALL_INSTANCES_SELECT     = namespace + '/ALL_INSTANCES_SELECT',
  ALL_INSTANCES_DESELECT   = namespace + '/ALL_INSTANCES_DESELECT',

  FORM_FILTER_RESET        = namespace + '/FORM_FILTER_RESET',
  FORM_FILTER_UPDATE       = namespace + '/FORM_FILTER_UPDATE',
  FORM_FILTER_PARSE        = namespace + '/FORM_FILTER_PARSE',

  INSTANCES_SEARCH         = namespace + '/INSTANCES_SEARCH',
  INSTANCES_SEARCH_FAIL    = namespace + '/INSTANCES_SEARCH_FAIL',
  INSTANCES_SEARCH_REQUEST = namespace + '/INSTANCES_SEARCH_REQUEST',
  INSTANCES_SEARCH_SUCCESS = namespace + '/INSTANCES_SEARCH_SUCCESS',

  INSTANCE_SELECT          = namespace + '/INSTANCE_SELECT',
  INSTANCE_DESELECT        = namespace + '/INSTANCE_DESELECT',

  VIEW_INITIALIZE_REQUEST  = namespace + '/VIEW_INITIALIZE_REQUEST',
  VIEW_INITIALIZE_FAIL     = namespace + '/VIEW_INITIALIZE_FAIL',
  VIEW_INITIALIZE_SUCCESS  = namespace + '/VIEW_INITIALIZE_SUCCESS',

  VIEW_REDIRECT_REQUEST    = namespace + '/VIEW_REDIRECT_REQUEST',
  VIEW_REDIRECT_FAIL       = namespace + '/VIEW_REDIRECT_FAIL',
  VIEW_REDIRECT_SUCCESS    = namespace + '/VIEW_REDIRECT_SUCCESS',

  /*████████████████████████████████████████████████████*\
   *███ STATUSES OF THE VIEW (in alphabetical order) ███*
  \*████████████████████████████████████████████████████*/

  DELETING      = namespace + '/DELETING',
  INITIALIZING  = namespace + '/INITIALIZING',
  READY         = namespace + '/READY',
  REDIRECTING   = namespace + '/REDIRECTING',
  SEARCHING     = namespace + '/SEARCHING',
  UNINITIALIZED = namespace + '/UNINITIALIZED';
