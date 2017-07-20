import { VIEW_NAME } from './constants';
import { buildViewSelectorWrapper } from '../../lib';

const wrapper = buildViewSelectorWrapper(VIEW_NAME);

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getStatus = wrapper(({ status }) => status),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getViewState = wrapper(_ => {}),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getInstance = wrapper(({ instance }) => instance),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getInstanceDescription = wrapper(({ instance }, ui) => {
    if (ui && ui.createEditShow) {
      const instanceDescription = ui.createEditShow(VIEW_NAME).instanceDescription;

      if (instanceDescription) {
        return instanceDescription(instance);
      }
    }

    return instance._objectLabel;
  });
