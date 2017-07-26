const NAMESPACE = 'common';

export const
  AFTER_ACTION_NEW  = NAMESPACE + '/new',
  AFTER_ACTION_NEXT = NAMESPACE + '/next',

  ROLE_FIELD   = NAMESPACE + '/field',
  ROLE_SECTION = NAMESPACE + '/section',
  ROLE_TAB     = NAMESPACE + '/tab',

  VIEW_SEARCH = NAMESPACE + '/search',
  VIEW_CREATE = NAMESPACE + '/create',
  VIEW_EDIT   = NAMESPACE + '/edit',
  VIEW_SHOW   = NAMESPACE + '/show',
  VIEW_ERROR  = NAMESPACE + '/error',

  DEFAULT_FIELD_TYPE = NAMESPACE + '/string',
  DEFAULT_VIEW = VIEW_SEARCH,

  // Modes for tab, section and field:
  FORM_ENTRY_MODE_DISABLED = NAMESPACE + '/disabled',
  FORM_ENTRY_MODE_ENABLED  = NAMESPACE + '/enabled',
  FORM_ENTRY_MODE_HIDDEN   = NAMESPACE + '/hidden',
  FORM_ENTRY_MODE_READONLY = NAMESPACE + '/readonly',
  FORM_ENTRY_MODE_VISIBLE  = NAMESPACE + '/visible',
  FORM_ENTRY_MODE_WRITABLE = NAMESPACE + '/writable',

  /*███████████████████████████████████████*\
   *███ ACTIONS (in alphabetical order) ███*
  \*███████████████████████████████████████*/

  VIEW_INITIALIZE = NAMESPACE + '/VIEW_INITIALIZE';
