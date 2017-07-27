import buildFieldComponent from './components/DefaultFieldInput';

import {
  AUDITABLE_FIELDS,
  DEFAULT_FIELD_TYPE,
  FORM_ENTRY_MODE_HIDDEN,
  FORM_ENTRY_MODE_READONLY,
  FORM_ENTRY_MODE_WRITABLE,
  VIEW_EDIT,
  VIEW_SHOW
} from './common/constants';

function enhanceFormEntries(viewName, fieldsMeta, entries) {
  return entries.reduce(
    (rez, entry) => {
      if (entry.mode === FORM_ENTRY_MODE_HIDDEN) {
        return rez;
      }

      if (entry.entries) {  // entry is either tab or section
        entry.entries = enhanceFormEntries(viewName, fieldsMeta, entry.entries);
      } else if (entry.field) {
        if (viewName === VIEW_SHOW) {
          entry.mode = FORM_ENTRY_MODE_READONLY;
        }

        if (!entry.Component) {
          entry.Component = buildFieldComponent(fieldsMeta[entry.field].type || DEFAULT_FIELD_TYPE)
        }
      }


      return [
        ...rez,
        entry
      ];
    },
    []
  )
}

export const

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  buildFormLayout = ( instance, viewName, {
    view: viewMeta,
    model: modelMeta
  }) => enhanceFormEntries(viewName, modelMeta.fields, viewMeta && viewMeta.formLayout ?
    viewMeta.formLayout(instance) :
    Object.keys(modelMeta.fields).
      filter(name => [VIEW_SHOW, VIEW_EDIT].includes(viewName) || !AUDITABLE_FIELDS.includes(name)).
      map(name => ({
        field: name,
        mode: viewName === VIEW_EDIT && (
            AUDITABLE_FIELDS.includes(name) ||
            modelMeta.logicalId.includes[name]
          ) &&
          FORM_ENTRY_MODE_READONLY ||
          FORM_ENTRY_MODE_WRITABLE
      }))
    ),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  buildInstanceDescription = (instance, { instanceDescription } = {}) => instanceDescription ?
    instanceDescription(instance) :
    instance._objectLabel;
