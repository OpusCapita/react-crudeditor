import { VIEW_NAME } from './constants';
import { buildViewSelectorWrapper } from '../../selectorWrapper';
import { DEFAULT_FIELD_TYPE } from '../../common/constants';
import { getLogicalKeyBuilder } from '../lib';

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
    tab
  })),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewModelData = wrapper((storeState, {
    model: modelConfig,
    ui: uiConfig
  }) => ({
    activeEntries: storeState.activeTab ?
      storeState.activeTab.entries || [] :
      storeState.formLayout,
    activeTab: storeState.activeTab,
    entityName: modelConfig.name,
    formInstance: storeState.formInstance,
    fieldsErrors: storeState.errors,
    fieldsMeta: Object.entries(modelConfig.fields).reduce(
      (rez, [ name, info ]) => ({
        ...rez,
        [name]: {
          type: DEFAULT_FIELD_TYPE,
          constraints: {},
          ...info
        }
      }),
      {}
    ),
    instanceDescription: storeState.instanceDescription,
    persistentInstance: storeState.persistentInstance,
    tabs: storeState.formLayout.filter(({ tab }) => tab),
    viewName: VIEW_NAME
  }));
