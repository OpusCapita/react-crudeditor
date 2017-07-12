const wrapper = f => ({ common }, entityConfiguration) => f(common, entityConfiguration);

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getEntityConfigurationIndex = wrapper(({ entityConfigurationIndex }) => entityConfigurationIndex),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getActiveView = wrapper(({ activeView }) => activeView);
