import { buildViewSelectorWrapper } from '../../selectorWrapper';

import {
  REDIRECTING,
  VIEW_NAME
} from './constants';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewState = wrapper(({ errors }) => errors),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewModelData = wrapper(storeState => ({
    errors: storeState.errors,
    isLoading: storeState.status === REDIRECTING
  }));
