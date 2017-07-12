import {
  INSTANCE_CREATE
} from './constants';

export const
  createInstance = (_, source) => ({
    type: INSTANCE_CREATE,
    meta: { source }
  });
