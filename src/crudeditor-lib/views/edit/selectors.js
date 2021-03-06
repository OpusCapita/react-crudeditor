import isEqual from 'lodash/isEqual';
import { buildViewSelectorWrapper } from '../../selectorWrapper';
import { getLogicalKeyBuilder } from '../lib';
import { VIEW_NAME } from './constants';

import {
  STATUS_EXTRACTING,
  STATUS_DELETING,
  STATUS_INITIALIZING,
  STATUS_REDIRECTING,
  STATUS_SEARCHING,
  STATUS_UPDATING
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

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewModelData = wrapper(/* istanbul ignore next */ (storeState, {
    model: modelMeta,
    ui: { spinner }
  }) => ({
    spinner,
    activeEntries: storeState.activeTab || storeState.formLayout,
    activeTab: storeState.activeTab,
    entityName: modelMeta.name,
    formattedInstance: storeState.formattedInstance,
    fieldErrors: storeState.errors.fields,
    fieldsMeta: modelMeta.fields,
    instanceLabel: storeState.instanceLabel,
    isLoading: [
      STATUS_EXTRACTING,
      STATUS_DELETING,
      STATUS_INITIALIZING,
      STATUS_REDIRECTING,
      STATUS_SEARCHING,
      STATUS_UPDATING
    ].indexOf(storeState.status) > -1,
    persistentInstance: storeState.persistentInstance,
    tabs: storeState.formLayout.filter(({ tab }) => tab),
    status: storeState.status,
    unsavedChanges: storeState.formInstance && !isEqual(storeState.persistentInstance, storeState.formInstance),
    viewName: VIEW_NAME
  }));
