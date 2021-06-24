import exceptions from './exceptions/no';

/* eslint-disable max-len */
const common = {
  "common.CrudEditor.new.title": "Ny",
  "common.CrudEditor.create.header": "Opprett {modelName}",
  "common.CrudEditor.edit.header": "Rediger {modelName}",
  "common.CrudEditor.show.header": "Vis {modelName}",
  "common.CrudEditor.duplicate.header": "Lag kopi av {modelName}",
  "common.CrudEditor.cancel.button": "Avbryt",
  "common.CrudEditor.save.button": "Lagre",
  "common.CrudEditor.saveAndNew.button": "Lagre og ny",
  "common.CrudEditor.saveAndNext.button": "Lagre og neste",
  "common.CrudEditor.search.header": "Søk {payload}",
  "common.CrudEditor.search.button": "Søk",
  "common.CrudEditor.reset.button": "Tilbakestill",
  "common.CrudEditor.create.button": "Opprett",
  "common.CrudEditor.select.button": "Velg",
  "common.CrudEditor.close.button": "Lukk",
  "common.CrudEditor.actions.tableHeader": "Handlinger",
  "common.CrudEditor.show.button": "Visning",
  "common.CrudEditor.edit.button": "Rediger",
  "common.CrudEditor.delete.button": "Slett",
  "common.CrudEditor.deleteSelected.button": "Slett valgt",
  "common.CrudEditor.duplicate.button": "Duplikat",
  "common.CrudEditor.refresh.button": "Oppdater",
  "common.CrudEditor.revisions.button": "Revisjoner",
  "common.CrudEditor.delete.confirmation": "Vil du slette denne posten?",
  "common.CrudEditor.deleteSelected.confirmation": "Vil du slette de valgte elementene?",
  "common.CrudEditor.noItemsSelected.alert": "Elementer er ikke valgt!",
  "common.CrudEditor.objectSaved.message": "Objekt opprettet.",
  "common.CrudEditor.objectUpdated.message": "Objekt oppdatert.",
  "common.CrudEditor.objectSaveFailed.message": "Objektet kunne ikke lagres.",
  "common.CrudEditor.objectDeleted.message": "Objekt slettet.",
  "common.CrudEditor.objectsDeleted.message": "Objekter {labels} slettet.",
  "common.CrudEditor.objectsDeleteIsNoAllowed.message": "Noen av objektene kan ikke slettes på grunn av sikkerhetsbegrensninger.",
  "common.CrudEditor.objectDeleteFailed.message": "Kunne ikke slette objektet. Kanskje det er i bruk allerede.",
  "common.CrudEditor.objectsDeleteFailed.message": "Kunne ikke slette objektene {count}. Kanskje de er i bruk allerede.",
  "common.CrudEditor.objectDuplicated.message": "Objektet er kopiert.",
  "common.CrudEditor.noAssociationEntriesFound.message": "Fant ingen poster. Du kan {1} en ny post.",
  "common.CrudEditor.message.ajax.loading": "Vent litt ...",
  "common.CrudEditor.search.result.label": "Søkeresultat",
  "common.CrudEditor.unsaved.confirmation": "Du har foretatt endringer. Endringene går tapt hvis du forlater denne siden.",
  "common.CrudEditor.search.resultsPerPage": "Resultater per side",
  "common.CrudEditor.search.all": "Alle",
  "common.CrudEditor.export.button": "Eksporter",
  "common.CrudEditor.found.items.message": "{count} elementer funnet",
  "common.CrudEditor.range.from": "fra",
  "common.CrudEditor.range.to": "til",
  "common.CrudEditor.confirm.action": "Bekreft",
  "common.CrudEditor.search.showSearchForm": "Vis søkeskjema",
  "common.CrudEditor.search.hideSearchForm": "Skjul søkeskjema",
  "common.CrudEditor.pagination.goToPage": "Go"
}
/* eslint-enable max-len */

export default {
  ...common,
  ...exceptions
}
