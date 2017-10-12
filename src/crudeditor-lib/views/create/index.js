import { VIEW_NAME } from './constants';
import { buildFormLayout } from '../lib';

export { getViewState } from './selectors';

<<<<<<< HEAD
import {
  exitView,
  saveInstance,
  selectTab,
  validateInstanceField,
  changeInstanceField,
  saveAndNewInstance
} from './actions';
=======
export const getUi = modelDefinition => {
  const createMeta = modelDefinition.ui.create || {};
>>>>>>> master

  createMeta.formLayout = buildFormLayout({
    customBuilder: createMeta.formLayout,
    viewName: VIEW_NAME,
    fieldsMeta: modelDefinition.model.fields
  });

<<<<<<< HEAD
export default connect(
  (storeState, { modelDefinition }) => ({
    viewModelData: getViewModelData(storeState, modelDefinition)
  }), {
    exitView,
    saveInstance,
    selectTab,
    validateInstanceField,
    changeInstanceField,
    saveAndNewInstance
  },
  mergeProps
)(({
  viewModel,
  children,
  ...props
}) =>
  (<Main model={viewModel} {...props}>
    {children}
  </Main>)
);
=======
  return createMeta;
}
>>>>>>> master
