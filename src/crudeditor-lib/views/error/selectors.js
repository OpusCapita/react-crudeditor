import { buildViewSelectorWrapper } from '../../selectorWrapper';
import { VIEW_NAME } from './constants';
import { STATUS_REDIRECTING } from '../../common/constants';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewState = wrapper(({ errors }) => errors),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewModelData = wrapper((storeState, {
    permissions
  }) => ({
    permissions,
    errors: storeState.errors,
    isLoading: storeState.status === STATUS_REDIRECTING
  }));
