import { buildCommonSelectorWrapper } from '../selectorWrapper';

const wrapper = buildCommonSelectorWrapper();

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getEntityConfigurationIndex = wrapper(({ entityConfigurationIndex }) => entityConfigurationIndex),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getActiveViewName = wrapper(({ activeViewName }) => activeViewName),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getEntityName = wrapper((_, {
    model: { name }
  }) => name);
