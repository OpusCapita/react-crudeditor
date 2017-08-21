const NAMESPACE = 'common';

export const
  AUDITABLE_FIELDS = [
    'createdBy',
    'changedBy',
    'createdOn',
    'changedOn'
  ],

  AFTER_ACTION_NEW  = 'new',
  AFTER_ACTION_NEXT = 'next',

  ROLE_FIELD   = 'field',
  ROLE_SECTION = 'section',
  ROLE_TAB     = 'tab',

  VIEW_SEARCH = 'search',
  VIEW_CREATE = 'create',
  VIEW_EDIT   = 'edit',
  VIEW_SHOW   = 'show',
  VIEW_ERROR  = 'error',

  DEFAULT_FIELD_TYPE = 'string',
  DEFAULT_VIEW = VIEW_SEARCH,

  /*███████████████████████████████████████*\
   *███ ACTIONS (in alphabetical order) ███*
  \*███████████████████████████████████████*/

  INSTANCES_DELETE         = NAMESPACE + '/INSTANCES_DELETE',
  INSTANCES_DELETE_FAIL    = NAMESPACE + '/INSTANCES_DELETE_FAIL',
  INSTANCES_DELETE_REQUEST = NAMESPACE + '/INSTANCES_DELETE_REQUEST',
  INSTANCES_DELETE_SUCCESS = NAMESPACE + '/INSTANCES_DELETE_SUCCESS',

  VIEW_INITIALIZE = NAMESPACE + '/VIEW_INITIALIZE';
