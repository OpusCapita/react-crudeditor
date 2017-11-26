import exceptions from './exceptions/ru';

/* eslint-disable max-len */
const common = {
  "crudEditor.actions.tableHeader": "Действия",
  "crudEditor.cancel.button": "Отменить",
  "crudEditor.close.button": "Закрыть",
  "crudEditor.create.button": "Создать",
  "crudEditor.create.header": "Создать {modelName}",
  "crudEditor.delete.button": "Удалить",
  "crudEditor.delete.confirmation": "Вы действительно хотите удалить эту запись?",
  "crudEditor.deleteSelected.button": "Удалить выбранное",
  "crudEditor.deleteSelected.confirmation": "Вы действительно хотите удалить выбранные позиции?",
  "crudEditor.duplicate.button": "Копировать",
  "crudEditor.duplicate.header": "Копировать {modelName}",
  "crudEditor.edit.button": "Редактировать",
  "crudEditor.edit.header": "Редактировать: {modelName}",
  "crudEditor.message.ajax.loading": "Пожалуйста, подождите...",
  "crudEditor.noAssociationEntriesFound.message": "Записей не найдено. Вы можете {1} новую запись.",
  "crudEditor.noItemsSelected.alert": "Нет выбранных позиций!",
  "crudEditor.objectDeleteFailed.message": "Не удалось удалить объект, вероятно, он уже используется.",
  "crudEditor.objectDeleted.message": "Объект удален.",
  "crudEditor.objectDuplicated.message": "Объект скопирован.",
  "crudEditor.objectSaveFailed.message": "Не удалось сохранить объект.",
  "crudEditor.objectSaved.message": "Объект создан.",
  "crudEditor.objectUpdated.message": "Объект обновлен.",
  "crudEditor.objectsDeleteFailed.message": "Не удалось удалить объекты {0}, вероятно, они уже используются.",
  "crudEditor.objectsDeleteIsNoAllowed.message": "Вы не можете удалить некоторые объекты из-за ограничений безопасности.",
  "crudEditor.objectsDeleted.message": "Объекты {labels} удалены.",
  "crudEditor.refresh.button": "Обновить",
  "crudEditor.reset.button": "Сбросить",
  "crudEditor.revisions.button": "Ревизии",
  "crudEditor.save.button": "Сохранить",
  "crudEditor.saveAndNew.button": "Сохранить и создать новое",
  "crudEditor.saveAndNext.button": "Сохранить и далее",
  "crudEditor.search.all": "Все",
  "crudEditor.search.button": "Поиск",
  "crudEditor.search.header": "Поиск: {payload}",
  "crudEditor.search.result.label": "Результаты поиска",
  "crudEditor.search.resultsPerPage": "Число результатов на страницу",
  "crudEditor.select.button": "Выбрать",
  "crudEditor.unsaved.confirmation": "Вы внесли изменения. Если Вы покинете данную страницу, эти изменения будут утеряны.",
  "crudEditor.show.button": "Просмотреть",
  "crudEditor.show.header": "Просмотр: {modelName}",
  "crudEditor.export.button": "Экспорт",
  "crudEditor.found.items.message": "\u041D\u0430\u0439\u0434\u0435\u043D\u043E \u043F\u043E\u0437\u0438\u0446\u0438\u0439\: {count}",
  "crudEditor.range.from": "\u0441",
  "crudEditor.range.to": "\u043F\u043E",
  "crudEditor.search.showSearchForm": "Показать форму поиска",
  "crudEditor.search.hideSearchForm": "Скрыть форму поиска"
}
/* eslint-enable max-len */

export default {
  ...common,
  ...exceptions
}
