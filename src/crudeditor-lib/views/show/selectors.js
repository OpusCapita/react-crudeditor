import { buildViewSelectorWrapper } from '../../selectorWrapper';
import { getLogicalKeyBuilder } from '../lib';
import { VIEW_NAME } from './constants';

import {
  STATUS_INITIALIZING,
  STATUS_REDIRECTING,
  STATUS_EXTRACTING
} from '../../common/constants';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewState = wrapper(({
    persistentInstance,
    activeTab: { tab } = {}
  }, {
    model: { fields }
  }) => ({
    instance: getLogicalKeyBuilder(fields)(persistentInstance),
    ...(tab ? { tab } : {})
  })),

  getViewModelData = wrapper((storeState, {
    model: modelMeta,
    ui: { Spinner },
    permissions
  }) => ({
    permissions,
    Spinner,
    activeEntries: storeState.activeTab || storeState.formLayout,
    activeTab: storeState.activeTab,
    entityName: modelMeta.name,
    formatedInstance: storeState.formatedInstance,
    fieldsMeta: modelMeta.fields,
    flags: storeState.flags,
    instanceLabel: storeState.instanceLabel,
    isLoading: [
      STATUS_INITIALIZING,
      STATUS_REDIRECTING,
      STATUS_EXTRACTING
    ].indexOf(storeState.status) > -1,
    persistentInstance: storeState.persistentInstance,
    tabs: storeState.formLayout.filter(({ tab }) => tab),
    status: storeState.status,
    viewName: VIEW_NAME
  }));
