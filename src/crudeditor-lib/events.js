import { NotificationManager } from 'react-notifications';

import {
  INSTANCE_SAVE_FAIL as create_INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS as create_INSTANCE_SAVE_SUCCESS
} from './views/create/constants';
import {
  INSTANCE_SAVE_FAIL as edit_INSTANCE_SAVE_FAIL,
  INSTANCE_SAVE_SUCCESS as edit_INSTANCE_SAVE_SUCCESS
} from './views/edit/constants';

const eventsMiddleware = store => next => action => {
  const actions = [
    create_INSTANCE_SAVE_FAIL,
    create_INSTANCE_SAVE_SUCCESS,
    edit_INSTANCE_SAVE_FAIL,
    edit_INSTANCE_SAVE_SUCCESS
  ];

  const { type } = action;

  if (~actions.indexOf(type)) {
    console.log(type + " triggered!")

    NotificationManager.create({
      id: 'error',
      type: 'error',
      message: 'some error occured'
    })
  }

  return next(action)
}

export default eventsMiddleware