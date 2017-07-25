import { VIEW_NAME } from './constants';
import { buildViewSelectorWrapper } from '../../selectorWrapper';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getStatus = wrapper(({ status }) => status),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewState = wrapper(_ => {});
