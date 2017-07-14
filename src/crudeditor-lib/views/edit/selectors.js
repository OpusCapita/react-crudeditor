import { VIEW_NAME } from './constants';
import { buildViewSelectorWrapper } from '../../lib';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getPersistentInstance = wrapper(({ persistentInstance }) => persistentInstance);
