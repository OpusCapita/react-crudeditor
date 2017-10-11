import { VIEW_NAME } from './constants';
import { buildFormLayout } from '../lib';

export { getViewState } from './selectors';

export const getUi = modelDefinition => {
  const createMeta = modelDefinition.ui.create || {};

  createMeta.formLayout = buildFormLayout({
    customBuilder: createMeta.formLayout,
    viewName: VIEW_NAME,
    fieldsMeta: modelDefinition.model.fields
  });

  return createMeta;
}
