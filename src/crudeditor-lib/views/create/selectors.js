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

  getViewState = wrapper(/* istanbul ignore next */ ({
    predefinedFields
  }) => ({
    predefinedFields
  })),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewModelData = wrapper(/* istanbul ignore next */ (storeState, {
    model: modelMeta,
    ui: { spinner }
  }) => ({
    spinner,
    activeEntries: storeState.activeTab || storeState.formLayout,
    activeTab: storeState.activeTab,
    entityName: modelMeta.name,
    fieldErrors: storeState.errors.fields,
    fieldsMeta: modelMeta.fields,
    formattedInstance: storeState.formattedInstance,
    instanceLabel: storeState.instanceLabel,
    isLoading: ([STATUS_REDIRECTING, STATUS_CREATING].indexOf(storeState.status) > -1),
    tabs: storeState.formLayout.filter(({ tab }) => tab),
    status: storeState.status,
    unsavedChanges:
      storeState.formInstance &&
      Object.keys(storeState.formInstance).some(
        key => storeState.formInstance[key] !== null &&
        storeState.formInstance[key] !== storeState.predefinedFields[key]
      ),
    viewName: VIEW_NAME
  }));
