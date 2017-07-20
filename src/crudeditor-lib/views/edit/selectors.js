import { VIEW_NAME } from './constants';
import { buildViewSelectorWrapper } from '../../lib';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getStatus = wrapper(({ status }) => status),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewState = wrapper(({
    persistentInstance,
    tab
  }, {
    model: { idField }
  }) => ({
    id: persistentInstance[idField],
    tab
  })),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getPersistentInstance = wrapper(({ persistentInstance }) => persistentInstance);
