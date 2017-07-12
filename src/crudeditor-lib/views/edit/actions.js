import {
  INSTANCE_EDIT
} from './constants';

export const
  editInstance = ({
    id,
    tab
  }, source) => ({
    type: INSTANCE_EDIT,
    payload: {
      id,
      tab
    },
    meta: {
      source
    }
  });
