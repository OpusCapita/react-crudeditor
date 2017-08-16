import buildFieldComponent from '../components/DefaultFieldInput';

import {
  AUDITABLE_FIELDS,
  DEFAULT_FIELD_TYPE,
  FORM_ENTRY_MODE_HIDDEN,
  FORM_ENTRY_MODE_READONLY,
  FORM_ENTRY_MODE_WRITABLE,
  FORM_ENTRY_MODE_DISABLED,
  VIEW_EDIT,
  VIEW_SHOW
} from '../common/constants';

function enhanceFormEntries(viewName, fieldsMeta, entries) {
  /*
   * 1. making all fields readonly in "show" view.
   * 2. removing hidden entries.
   * 3. removing empty tabs and sections.
   * 4. assigning default Component to fields.
   * 5. Replace "mode" with
   *    -- "readOnly" in fields,
   *    -- "disabled" in tabs,
   *    -- remove it altogether in sections.
   */
  return entries.reduce(
    (rez, entry) => {
      if (entry.mode === FORM_ENTRY_MODE_HIDDEN) {
        return rez;
      }

      if (entry.tab || entry.section) {
        if (entry.entries) {
          entry.entries = enhanceFormEntries(viewName, fieldsMeta, entry.entries);
        }
        if (!entry.entries || entry.entries.length === 0) {
          return rez;
        }
        if (entry.tab) {
          entry.disabled = entry.mode === FORM_ENTRY_MODE_DISABLED;
        }
      } else {  // entry is field
        if (viewName === VIEW_SHOW) {
          entry.mode = FORM_ENTRY_MODE_READONLY;
        }
        if (!entry.Component) {
          entry.Component = buildFieldComponent(fieldsMeta[entry.field].type || DEFAULT_FIELD_TYPE)
        }
        entry.readOnly = viewName === VIEW_SHOW || entry.mode === FORM_ENTRY_MODE_READONLY;
      }

      delete entry.mode;

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

  buildFormLayout = ({
    instance,
    viewName,
    viewMeta,
    modelMeta
  }) => enhanceFormEntries(viewName, modelMeta.fields, viewMeta && viewMeta.formLayout ?
    viewMeta.formLayout(instance) :
    Object.keys(modelMeta.fields).
      filter(name => [VIEW_SHOW, VIEW_EDIT].includes(viewName) || !AUDITABLE_FIELDS.includes(name)).
      map(name => ({
        field: name,
        mode: viewName === VIEW_EDIT && (
            AUDITABLE_FIELDS.includes(name) ||  // Audiatable fields are read-only in Edit View.
            modelMeta.fields[name].unique  // Logical Key fields are read-only in Edit View.
          ) ?
          FORM_ENTRY_MODE_READONLY :
          FORM_ENTRY_MODE_WRITABLE
      }))
    ),

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  buildObjectLabel = ({
    instance,
    uiMeta: { objectLabel } = {}
  }) => objectLabel ?
    objectLabel(instance) :
    instance._objectLabel,

  // █████████████████████████████████████████████████████████████████████████████████████████████████████████

  getLogicalKeyBuilder = fieldsMeta => {
    const logicalKeyFields = Object.keys(fieldsMeta).filter(fieldName => fieldsMeta[fieldName].unique);

    return instance => logicalKeyFields.reduce(
      (rez, fieldName) => ({
        ...rez,
        [fieldName]: instance[fieldName]
      }),
      {}
    )
  };
