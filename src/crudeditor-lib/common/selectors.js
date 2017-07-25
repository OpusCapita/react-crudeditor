import { buildCommonSelectorWrapper } from '../selectorWrapper';

const wrapper = buildCommonSelectorWrapper();

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getEntityConfigurationIndex = wrapper(({ entityConfigurationIndex }) => entityConfigurationIndex),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getActiveView = wrapper(({ activeView }) => activeView),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getEntityName = wrapper((_, {
    model: { name }
  }) => name),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getIdField = wrapper((_, {
    model: { idField }
  }) => idField);
