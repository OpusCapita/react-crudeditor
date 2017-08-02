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
  }) => name),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getLogicalIdBuilder = wrapper((_, {
    model: {
      logicalId: logicalIdFields
    }
  }) => instance => Object.entries(instance).reduce(
    (rez, [fieldName, fieldValue]) => logicalIdFields.includes(fieldName) ? {
      ...rez,
      [fieldName]: fieldValue
    } :
    rez,
    {}
  ));
