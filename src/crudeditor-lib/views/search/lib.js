import { EMPTY_FIELD_VALUE } from '../../common/constants';

// The function returns new filter value with EMPTY_FIELD_VALUE leaf nodes removed,
// or undefined when all filter values get cleansed.
export const cleanFilter = filter => Object.keys(filter).reduce(
  (rez, name) => filter[name] === EMPTY_FIELD_VALUE ?
    rez : {
      ...(rez || {}),
      [name]: filter[name]
    },
  undefined
);

export const getDefaultSortField = searchMeta => {
  let fieldName = searchMeta.resultFields[0].name;

  if (searchMeta.resultFields.every(({ name, sortByDefault }) => {
    if (sortByDefault) {
      fieldName = name;
      return false;
    }

    return true;
  })) {
    searchMeta.resultFields.some(({ name, sortable }) => {
      if (sortable) {
        fieldName = name;
        return true;
      }

      return false;
    })
  }

  return fieldName;
};
