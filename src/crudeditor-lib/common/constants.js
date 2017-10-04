const NAMESPACE = 'common';

export const
  AUDITABLE_FIELDS = [
    'createdBy',
    'changedBy',
    'createdOn',
    'changedOn'
  ],

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

  /*
   * Value for a empty field/filter (even if the field is of type "string", "boolean", etc.)
   * => React Component (rendering particular field/filter) may want to translate this value into more appropriate for itself.
   */
  EMPTY_FIELD_VALUE = null,

  UNPARSABLE_FIELD_VALUE = undefined,

  /*███████████████████████████████████████*\
   *███ ACTIONS (in alphabetical order) ███*
  \*███████████████████████████████████████*/

  ACTIVE_VIEW_CHANGE = NAMESPACE + '/ACTIVE_VIEW_CHANGE',

  INSTANCES_DELETE         = NAMESPACE + '/INSTANCES_DELETE',
  INSTANCES_DELETE_FAIL    = NAMESPACE + '/INSTANCES_DELETE_FAIL',
  INSTANCES_DELETE_REQUEST = NAMESPACE + '/INSTANCES_DELETE_REQUEST',
  INSTANCES_DELETE_SUCCESS = NAMESPACE + '/INSTANCES_DELETE_SUCCESS',

  VIEW_INITIALIZE_REQUEST = NAMESPACE + '/VIEW_INITIALIZE_REQUEST',
  VIEW_INITIALIZE_FAIL    = NAMESPACE + '/VIEW_INITIALIZE_FAIL',
  VIEW_INITIALIZE_SUCCESS = NAMESPACE + '/VIEW_INITIALIZE_SUCCESS',

  VIEW_REDIRECT_FORCE   = NAMESPACE + '/VIEW_REDIRECT_FORCE',
  VIEW_REDIRECT_REQUEST = NAMESPACE + '/VIEW_REDIRECT_REQUEST',
  VIEW_REDIRECT_FAIL    = NAMESPACE + '/VIEW_REDIRECT_FAIL',
  VIEW_REDIRECT_SUCCESS = NAMESPACE + '/VIEW_REDIRECT_SUCCESS',

  /*██████████████████████████████████████*\
   *███ ERRORS (in alphabetical order) ███*
  \*██████████████████████████████████████*/

  ERROR_UNKNOWN_VIEW = viewName => ({
    code: 500,
    id: 'unknownViewError',
    message: 'Unknown view:' + viewName
  });
