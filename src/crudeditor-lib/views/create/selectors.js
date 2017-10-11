import { buildViewSelectorWrapper } from '../../selectorWrapper';
import { getLogicalKeyBuilder } from '../lib';

import {
  VIEW_NAME
} from './constants';

import {
  STATUS_INITIALIZING,
  STATUS_REDIRECTING
} from '../../common/constants';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewState = wrapper(({
    instance
  }, {
    model: { fields }
  }) => ({
    instance: getLogicalKeyBuilder(fields)(instance)
  })),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewModelData = wrapper((storeState, {
    model: modelMeta
  }) => ({
    activeEntries: storeState.activeTab || storeState.formLayout,
    activeTab: storeState.activeTab,
    entityName: modelMeta.name,
    formInstance: storeState.formInstance,
    fieldsErrors: storeState.errors.fields,
    fieldsMeta: modelMeta.fields,
    formatedInstance: storeState.formatedInstance,
    generalErrors: storeState.errors.general,
    instanceLabel: storeState.instanceLabel,
    isLoading: ~[STATUS_INITIALIZING, STATUS_REDIRECTING].indexOf(storeState.status),
    tabs: storeState.formLayout.filter(({ tab }) => tab),
    status: storeState.status,
    viewName: VIEW_NAME
  }));
