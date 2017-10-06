const namespace = 'common';

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

  ACTIVE_VIEW_CHANGE = namespace + '/ACTIVE_VIEW_CHANGE',

  INSTANCES_DELETE         = namespace + '/INSTANCES_DELETE',
  INSTANCES_DELETE_FAIL    = namespace + '/INSTANCES_DELETE_FAIL',
  INSTANCES_DELETE_REQUEST = namespace + '/INSTANCES_DELETE_REQUEST',
  INSTANCES_DELETE_SUCCESS = namespace + '/INSTANCES_DELETE_SUCCESS',

  VIEW_HARD_REDIRECT = namespace + '/VIEW_HARD_REDIRECT',

  /*██████████████████████████████████████*\
   *███ ERRORS (in alphabetical order) ███*
  \*██████████████████████████████████████*/

  ERROR_UNKNOWN_VIEW = viewName => ({
    code: 500,
    id: 'unknownViewError',
    message: 'Unknown view:' + viewName
  });
