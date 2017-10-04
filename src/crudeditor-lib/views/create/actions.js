import {
  INSTANCE_CREATE
} from './constants';

export const
  createInstance = ({ instance } = {}) => ({
    type: INSTANCE_CREATE,
    payload: { instance }
  });
