import { VIEW_NAME } from './constants';
import { buildViewSelectorWrapper } from '../../selectorWrapper';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getErrorInfo = wrapper(({
    code,
    payload
  }) => ({
    code,
    payload
  }));
