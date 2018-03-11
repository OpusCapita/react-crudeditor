import { buildViewSelectorWrapper } from '../../selectorWrapper';
import { VIEW_NAME } from './constants';
import { STATUS_REDIRECTING } from '../../common/constants';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewState = wrapper(/* istanbul ignore next */ ({ errors }) => errors),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewModelData = wrapper(/* istanbul ignore next */ storeState => ({
    errors: storeState.errors,
    isLoading: storeState.status === STATUS_REDIRECTING
  }));
