import { VIEW_NAME } from './constants';
import { buildFormLayout } from '../lib';

export { getViewState } from './selectors';

export const getUi = modelDefinition => {
  const showMeta = modelDefinition.ui.show || {};

  if (!showMeta.standardOperations) {
    showMeta.standardOperations = {};
  }

  showMeta.formLayout = buildFormLayout({
    customBuilder: showMeta.formLayout,
    viewName: VIEW_NAME,
    fieldsMeta: modelDefinition.model.fields
  });

  return showMeta;
}
