import { VIEW_NAME } from './constants';
import { buildFormLayout } from '../lib';

export { getViewState } from './selectors';

export const getUi = modelDefinition => {
  const editMeta = modelDefinition.ui.edit || {};

  editMeta.formLayout = buildFormLayout({
    customBuilder: editMeta.formLayout,
    viewName: VIEW_NAME,
    fieldsMeta: modelDefinition.model.fields
  });

  return editMeta;
}
