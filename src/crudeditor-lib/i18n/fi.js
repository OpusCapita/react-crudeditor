import exceptions from './exceptions/fi';

/* eslint-disable max-len */
const common = {
  "crudEditor.actions.tableHeader": "Toimenpiteitä",
  "crudEditor.cancel.button": "Peru",
  "crudEditor.close.button": "Sulje",
  "crudEditor.create.button": "Luo",
  "crudEditor.create.header": "Luo {modelName}",
  "crudEditor.delete.button": "Poista",
  "crudEditor.delete.confirmation": "Haluatko varmasti tuhota tämän syötteen?",
  "crudEditor.deleteSelected.button": "Poista Valittu",
  "crudEditor.deleteSelected.confirmation": "Haluatko varmasti tuhota valitut itemit?",
  "crudEditor.duplicate.button": "Duplikaatti",
  "crudEditor.duplicate.header": "Duplikaatti {modelName}",
  "crudEditor.edit.button": "Editoida",
  "crudEditor.edit.header": "Editoi {modelName}",
  "crudEditor.message.ajax.loading": "Ole hyvä ja odota…",
  "crudEditor.noAssociationEntriesFound.message": "Syötteet puuttuvat. Voit {1} uuden syöttteen.",
  "crudEditor.noItemsSelected.alert": "Itemeita ei ole valittu!",
  "crudEditor.objectDeleteFailed.message": "Objektin tuhoaminen epäonnistui, se voi olla jo käytössä.",
  "crudEditor.objectDeleted.message": "Objekti poistettu.",
  "crudEditor.objectDuplicated.message": "Objekti kopioitu.",
  "crudEditor.objectSaveFailed.message": "Objektin tallentaminen epäonnistui.",
  "crudEditor.objectSaved.message": "Objekti luotu.",
  "crudEditor.objectUpdated.message": "Objekti päivitetty.",
  "crudEditor.objectsDeleteFailed.message": "Objektien {0} poistaminen epäonnistui, koska ne ovat jo käytössä.",
  "crudEditor.objectsDeleteIsNoAllowed.message": "Et voi poistaa joitakin objekteja turvallisuusrajoitteista johtuen.",
  "crudEditor.objectsDeleted.message": "Objektit {0} poistettu.",
  "crudEditor.refresh.button": "Päivitä",
  "crudEditor.reset.button": "Tyhjennä",
  "crudEditor.revisions.button": "Revisiot",
  "crudEditor.save.button": "Tallenna",
  "crudEditor.saveAndNew.button": "Tallenna Ja Uusi",
  "crudEditor.saveAndNext.button": "Tallenna ja Seuraava",
  "crudEditor.search.all": "Kaikki",
  "crudEditor.search.button": "Hae",
  "crudEditor.search.header": "Hae {payload}",
  "crudEditor.search.result.label": "Hakutulos",
  "crudEditor.search.resultsPerPage": "Tuloksia sivulla",
  "crudEditor.select.button": "Valitse",
  "crudEditor.unsaved.confirmation": "Olet tehnyt muutokset. Sivulta lähteminen johtaa muutosten menettämiseen.",
  "crudEditor.show.button": "Katso",
  "crudEditor.show.header": "Katso {modelName}",
  "crudEditor.export.button": "Vie",
  "crudEditor.found.items.message": "{count} itemia l\u00F6ytyi",
  "crudEditor.dateRange.from": "l\u00E4htien",
  "crudEditor.dateRange.to": "asti"
}
/* eslint-enable max-len */

export default {
  ...common,
  ...exceptions
}
