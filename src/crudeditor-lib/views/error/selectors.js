import { VIEW_NAME } from './constants';

const wrapper = f => ({
  views: {
    [VIEW_NAME]: view
  }
}, entityConfiguration) => f(view, entityConfiguration);

export const
  getErrorInfo = wrapper(({
    code,
    payload
  }) => ({
    code,
    payload
  }));
