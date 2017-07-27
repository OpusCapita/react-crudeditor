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

  // Modes for tab, section and field:
  FORM_ENTRY_MODE_DISABLED = 'disabled',
  FORM_ENTRY_MODE_ENABLED  = 'enabled',
  FORM_ENTRY_MODE_HIDDEN   = 'hidden',
  FORM_ENTRY_MODE_READONLY = 'readonly',
  FORM_ENTRY_MODE_VISIBLE  = 'visible',
  FORM_ENTRY_MODE_WRITABLE = 'writable',

  /*███████████████████████████████████████*\
   *███ ACTIONS (in alphabetical order) ███*
  \*███████████████████████████████████████*/

  VIEW_INITIALIZE = NAMESPACE + '/VIEW_INITIALIZE';
