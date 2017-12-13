import { buildViewSelectorWrapper } from '../../selectorWrapper';
import { getLogicalKeyBuilder } from '../lib';
import { VIEW_NAME } from './constants';

import {
  STATUS_EXTRACTING,
  STATUS_DELETING,
  STATUS_INITIALIZING,
  STATUS_REDIRECTING,
  STATUS_UPDATING
} from '../../common/constants';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

export const

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
    formattedInstance: storeState.formattedInstance,
    formInstance: storeState.formInstance,
    fieldErrors: storeState.errors.fields,
    fieldsMeta: modelMeta.fields,
    instanceLabel: storeState.instanceLabel,
    flags: storeState.flags,
    isLoading: [
      STATUS_EXTRACTING,
      STATUS_DELETING,
      STATUS_INITIALIZING,
      STATUS_REDIRECTING,
      STATUS_UPDATING
    ].indexOf(storeState.status) > -1,
    persistentInstance: storeState.persistentInstance,
    tabs: storeState.formLayout.filter(({ tab }) => tab),
    status: storeState.status,
    viewName: VIEW_NAME
  })
  );
