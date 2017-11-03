import { buildViewSelectorWrapper } from '../../selectorWrapper';

import {
  VIEW_NAME
} from './constants';

import {
  STATUS_REDIRECTING,
  STATUS_CREATING
} from '../../common/constants';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewState = wrapper(({
    predefinedFields
  }) => ({
    instance: predefinedFields
  })),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewModelData = wrapper((storeState, {
    model: modelMeta
  }) => ({
    activeEntries: storeState.activeTab || storeState.formLayout,
    activeTab: storeState.activeTab,
    entityName: modelMeta.name,
    formInstance: storeState.formInstance,
    // fieldsErrors: storeState.errors.fields, // TODO check create view for errors about undefined fieldsErrors
    fieldsMeta: modelMeta.fields,
    formatedInstance: storeState.formatedInstance,
    instanceLabel: storeState.instanceLabel,
    isLoading: ([STATUS_REDIRECTING, STATUS_CREATING].indexOf(storeState.status) > -1),
    tabs: storeState.formLayout.filter(({ tab }) => tab),
    status: storeState.status,
    viewName: VIEW_NAME
  }));
