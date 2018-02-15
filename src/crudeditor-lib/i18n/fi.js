import exceptions from './exceptions/fi';

/* eslint-disable max-len */
const common = {
  "crudEditor.actions.tableHeader": "Toimenpiteitä",
  "crudEditor.cancel.button": "Peru",
  "crudEditor.close.button": "Sulje",
  "crudEditor.create.button": "Luo",
  "crudEditor.create.header": "Luo {modelName}",
  "crudEditor.delete.button": "Poista",
  "crudEditor.delete.confirmation": "Haluatko varmasti poistaa tämän rivin?",
  "crudEditor.deleteSelected.button": "Poista valitut",
  "crudEditor.deleteSelected.confirmation": "Haluatko varmasti poistaa valitut rivit?",
  "crudEditor.duplicate.button": "Kaksoiskappale",
  "crudEditor.duplicate.header": "Kaksoiskappale {modelName}",
  "crudEditor.edit.button": "Muokkaa",
  "crudEditor.edit.header": "Muokkaa {modelName}",
  "crudEditor.message.ajax.loading": "Ole hyvä ja odota…",
  "crudEditor.noAssociationEntriesFound.message": "Syötteet puuttuvat. Voit {1} uuden syötteen.",
  "crudEditor.noItemsSelected.alert": "Rivejä ei ole valittu!",
  "crudEditor.objectDeleteFailed.message": "Rivin poistaminen epäonnistui, se voi olla jo käytössä.",
  "crudEditor.objectDeleted.message": "Rivi poistettu.",
  "crudEditor.objectDuplicated.message": "Rivi kopioitu.",
  "crudEditor.objectSaveFailed.message": "Rivin tallentaminen epäonnistui.",
  "crudEditor.objectSaved.message": "Rivi luotu.",
  "crudEditor.objectUpdated.message": "Rivi päivitetty.",
  "crudEditor.objectsDeleteFailed.message": "Rivien {0} poistaminen epäonnistui, koska ne ovat jo käytössä.",
  "crudEditor.objectsDeleteIsNoAllowed.message": "Et voi poistaa joitakin rivejä turvallisuusrajoitteista johtuen.",
  "crudEditor.objectsDeleted.message": "Rivit {labels} poistettu.",
  "crudEditor.refresh.button": "Päivitä",
  "crudEditor.reset.button": "Tyhjennä",
  "crudEditor.revisions.button": "Revisiot",
  "crudEditor.save.button": "Tallenna",
  "crudEditor.saveAndNew.button": "Tallenna ja luo uusi",
  "crudEditor.saveAndNext.button": "Tallenna ja siirry seuraavaan",
  "crudEditor.search.all": "Kaikki",
  "crudEditor.search.button": "Hae",
  "crudEditor.search.header": "Hae {payload}",
  "crudEditor.search.result.label": "Hakutulos",
  "crudEditor.search.resultsPerPage": "Tuloksia sivulla",
  "crudEditor.select.button": "Valitse",
  "crudEditor.unsaved.confirmation": "Olet tehnyt muutoksia. Jos poistut sivulta, menetät muutokset.",
  "crudEditor.show.button": "Katso",
  "crudEditor.show.header": "Katso {modelName}",
  "crudEditor.export.button": "Vie",
  "crudEditor.found.items.message": "{count} hakutulosta l\u00F6ytyi",
  "crudEditor.range.from": "l\u00E4htien",
  "crudEditor.range.to": "asti",
  "crudEditor.confirm.action": "Vahvista",
  "crudEditor.search.showSearchForm": "Näytä hakukentät",
  "crudEditor.search.hideSearchForm": "Piilota hakukentät"
}
/* eslint-enable max-len */

export default {
  ...common,
  ...exceptions
}
