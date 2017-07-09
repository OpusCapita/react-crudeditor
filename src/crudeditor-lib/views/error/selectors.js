import { VIEW_NAME } from './constants';

export const
  getErrorInfo = ({
    views: {
      [VIEW_NAME]: {
        code,
        payload
      }
    }
  }) => ({
    code,
    payload
  });
