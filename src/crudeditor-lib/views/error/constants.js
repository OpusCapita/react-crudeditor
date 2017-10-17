import { VIEW_ERROR } from '../../common/constants';

const namespace = VIEW_ERROR;

export const
  VIEW_NAME = VIEW_ERROR,

  /* ████████████████████████████████████████████*\
   *███ ACTION TYPES (in alphabetical order) ███*
  \*████████████████████████████████████████████*/

  HOME_GO = namespace + '/HOME_GO',

  VIEW_INITIALIZE = namespace + '/VIEW_INITIALIZE',

  VIEW_REDIRECT_REQUEST = namespace + '/VIEW_REDIRECT_REQUEST',
  VIEW_REDIRECT_FAIL = namespace + '/VIEW_REDIRECT_FAIL',
  VIEW_REDIRECT_SUCCESS = namespace + '/VIEW_REDIRECT_SUCCESS';
