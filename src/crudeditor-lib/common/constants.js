const namespace = 'common';

export const
  ROLE_FIELD = 'field',
  ROLE_SECTION = 'section',
  ROLE_TAB = 'tab',

  VIEW_SEARCH = 'search',
  VIEW_CREATE = 'create',
  VIEW_EDIT = 'edit',
  VIEW_SHOW = 'show',
  VIEW_ERROR = 'error',

  DEFAULT_FIELD_TYPE = 'string',
  DEFAULT_VIEW = VIEW_SEARCH,
  DEFAULT_TAB_COLUMNS = 1,

  /*
   * Value for a empty field/filter (even if the field is of type "string", "boolean", etc.)
   * => React Component (rendering particular field/filter) may want to translate this value
   *    into more appropriate for itself.
   */
  EMPTY_FIELD_VALUE = null,

  UNPARSABLE_FIELD_VALUE = undefined,

  /* █████████████████████████████████████████████*\
   *███ VIEW STATUSES (in alphabetical order) ███*
  \*█████████████████████████████████████████████*/

  STATUS_CREATING = 'creating',
  STATUS_EXTRACTING = 'extracting',
  STATUS_DELETING = 'deleting',
  STATUS_INITIALIZING = 'initializing',
  STATUS_READY = 'ready',
  STATUS_REDIRECTING = 'redirecting',
  STATUS_SEARCHING = 'searching',
  STATUS_UNINITIALIZED = 'uninitialized',
  STATUS_UPDATING = 'updating',

  /* ███████████████████████████████████████*\
   *███ ACTIONS (in alphabetical order) ███*
  \*███████████████████████████████████████*/

  ACTIVE_VIEW_CHANGE = namespace + '/ACTIVE_VIEW_CHANGE',

  INSTANCES_DELETE = namespace + '/INSTANCES_DELETE',
  INSTANCES_DELETE_FAIL = namespace + '/INSTANCES_DELETE_FAIL',
  INSTANCES_DELETE_REQUEST = namespace + '/INSTANCES_DELETE_REQUEST',
  INSTANCES_DELETE_SUCCESS = namespace + '/INSTANCES_DELETE_SUCCESS',

  VIEW_HARD_REDIRECT = namespace + '/VIEW_HARD_REDIRECT',

  VIEW_SOFT_REDIRECT = namespace + '/VIEW_SOFT_REDIRECT',

  /* ██████████████████████████████████████*\
   *███ ERRORS (in alphabetical order) ███*
  \*██████████████████████████████████████*/

  ERROR_CODE_INTERNAL = 500,
  ERROR_NOT_FOUND = 404,
  ERROR_FORBIDDEN = 403,

  ERROR_UNKNOWN_VIEW = viewName => ({
    code: ERROR_CODE_INTERNAL,
    id: 'unknownViewError',
    message: 'Unknown view:' + viewName
  }),

  ERROR_FORBIDDEN_VIEW = viewName => ({
    code: ERROR_FORBIDDEN,
    id: 'forbiddenViewError',
    message: `Access to '${viewName}' view is forbidden`
  });
