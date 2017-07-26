import { VIEW_NAME } from './constants';
import { buildViewSelectorWrapper } from '../../selectorWrapper';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getStatus = wrapper(({ status }) => status),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewName = _ => VIEW_NAME,

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewState = wrapper(_ => {});
