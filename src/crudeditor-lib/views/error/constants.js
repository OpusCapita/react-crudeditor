import { VIEW_ERROR } from '../../common/constants';

const namespace = VIEW_ERROR;

export const
  VIEW_NAME = VIEW_ERROR,

  /*████████████████████████████████████████████*\
   *███ ACTION TYPES (in alphabetical order) ███*
  \*████████████████████████████████████████████*/

  HOME_GO               = namespace + '/HOME_GO',

  VIEW_INITIALIZE       = namespace + '/VIEW_INITIALIZE_REQUEST',

  VIEW_REDIRECT_REQUEST = namespace + '/VIEW_REDIRECT_REQUEST',
  VIEW_REDIRECT_FAIL    = namespace + '/VIEW_REDIRECT_FAIL',
  VIEW_REDIRECT_SUCCESS = namespace + '/VIEW_REDIRECT_SUCCESS',

  /*████████████████████████████████████████████████████*\
   *███ STATUSES OF THE VIEW (in alphabetical order) ███*
  \*████████████████████████████████████████████████████*/

  READY         = namespace + '/READY',
  REDIRECTING   = namespace + '/REDIRECTING',
  UNINITIALIZED = namespace + '/UNINITIALIZED';
