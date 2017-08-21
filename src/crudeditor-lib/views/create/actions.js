import {
  INSTANCE_CREATE
} from './constants';

export const
  createInstance = ({ instance } = {}, source) => ({
    type: INSTANCE_CREATE,
    payload: { instance },
    meta: { source }
  });
