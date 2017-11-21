import exceptions from './exceptions/en';

/* eslint-disable max-len */
const common = {
  "crudEditor.create.header": "Create {modelName}",
  "crudEditor.edit.header": "Edit {modelName}",
  "crudEditor.show.header": "View {modelName}",
  "crudEditor.duplicate.header": "Duplicate {modelName}",
  "crudEditor.cancel.button": "Cancel",
  "crudEditor.save.button": "Save",
  "crudEditor.saveAndNew.button": "Save and New",
  "crudEditor.saveAndNext.button": "Save and Next",
  "crudEditor.search.header": "Search {payload}",
  "crudEditor.search.button": "Search",
  "crudEditor.reset.button": "Reset",
  "crudEditor.create.button": "Create",
  "crudEditor.select.button": "Select",
  "crudEditor.export.button": "Export",
  "crudEditor.close.button": "Close",
  "crudEditor.actions.tableHeader": "Actions",
  "crudEditor.show.button": "View",
  "crudEditor.edit.button": "Edit",
  "crudEditor.delete.button": "Delete",
  "crudEditor.deleteSelected.button": "Delete selected",
  "crudEditor.duplicate.button": "Duplicate",
  "crudEditor.refresh.button": "Refresh",
  "crudEditor.revisions.button": "Revisions",
  "crudEditor.delete.confirmation": "Do you really want to delete this entry?",
  "crudEditor.deleteSelected.confirmation": "Do you really want to delete the selected items?",
  "crudEditor.noItemsSelected.alert": "Items are not selected!",
  "crudEditor.objectSaved.message": "Object created.",
  "crudEditor.objectUpdated.message": "Object updated.",
  "crudEditor.objectSaveFailed.message": "Object save failed.",
  "crudEditor.objectDeleted.message": "Object deleted.",
  "crudEditor.objectsDeleted.message": "Objects {count} deleted.",
  "crudEditor.objectsDeleteIsNoAllowed.message": "You cannot delete some objects because of security restrictions.",
  "crudEditor.objectDeleteFailed.message": "Failed to delete object, perhaps it is already in use.",
  "crudEditor.objectsDeleteFailed.message": "Failed to delete objects {count}, perhaps they are already in use.",
  "crudEditor.objectDuplicated.message": "Object is copied.",
  "crudEditor.noAssociationEntriesFound.message": "No entries found. You can {1} a new entry.",
  "crudEditor.message.ajax.loading": "Please wait...",
  "crudEditor.search.result.label": "Search result",
  "crudEditor.unsaved.confirmation": "You have made changes. Leaving this site will lose these changes.",
  "crudEditor.search.resultsPerPage": "Results per page",
  "crudEditor.search.all": "All",
  "crudEditor.found.items.message": "{count} item(s) found",
  "crudEditor.range.from": "from",
  "crudEditor.range.to": "to",
  "crudEditor.confirm.action": "Confirm"
}
/* eslint-enable max-len */

export default {
  ...common,
  ...exceptions
}
