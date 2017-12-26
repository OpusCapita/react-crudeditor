import { buildViewSelectorWrapper } from '../../selectorWrapper';
import { getLogicalKeyBuilder } from '../lib';
import { VIEW_NAME } from './constants';

import {
  STATUS_EXTRACTING,
  STATUS_INITIALIZING,
  STATUS_REDIRECTING,
  STATUS_SEARCHING
} from '../../common/constants';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getAdjacentInstancesInfo = wrapper(({ offset }, getTotalCount) => ({
    previous: typeof offset === 'number' && offset > 0,
    next: typeof offset === 'number' && offset < (getTotalCount() - 1)
  })),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewState = wrapper(({
    persistentInstance,
    activeTab: { tab } = {}
  }, {
    model: { fields }
  }) => persistentInstance ?
    {
      instance: getLogicalKeyBuilder(fields)(persistentInstance),
      ...(tab ? { tab } : {})
    } :
    undefined // view is not initialized yet.
  ),

  getViewModelData = wrapper((storeState, {
    model: modelMeta,
    ui: { spinner }
  }) => ({
    spinner,
    activeEntries: storeState.activeTab || storeState.formLayout,
    activeTab: storeState.activeTab,
    entityName: modelMeta.name,
    formattedInstance: storeState.formattedInstance,
    fieldsMeta: modelMeta.fields,
    instanceLabel: storeState.instanceLabel,
    isLoading: [
      STATUS_EXTRACTING,
      STATUS_INITIALIZING,
      STATUS_REDIRECTING,
      STATUS_SEARCHING
    ].indexOf(storeState.status) > -1,
    persistentInstance: storeState.persistentInstance,
    tabs: storeState.formLayout.filter(({ tab }) => tab),
    status: storeState.status,
    viewName: VIEW_NAME
  }));
