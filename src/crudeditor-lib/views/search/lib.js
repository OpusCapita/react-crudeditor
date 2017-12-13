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
  let sortByDefaultIndex = 0;

  searchMeta.resultFields.some(({ sortByDefault }, index) => {
    if (sortByDefault) {
      sortByDefaultIndex = index;
      return true;
    }

    return false;
  });

  return searchMeta.resultFields[sortByDefaultIndex].name;
};
