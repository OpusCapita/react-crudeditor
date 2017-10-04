import { EMPTY_FIELD_VALUE } from '../../common/constants';

/*
 * The function receives filter field name/value and returns
 * false - if value must be cleaned out,
 * object with filter field name as object only key and filter field value as object value - otherwise.
 */
const cleanValue = ({ searchableFields, name, value }) => {
    if (!searchableFields.find(
      ({ name: fieldName }) => fieldName === name
    ).render.isRange) {
    return value !== EMPTY_FIELD_VALUE && {
      [name]: value
    }
  }

  const valueCleansed = {};

  if (value.from !== EMPTY_FIELD_VALUE) {
    valueCleansed.from = value.from;
  }

  if (value.to !== EMPTY_FIELD_VALUE) {
    valueCleansed.to = value.to;
  }

  return !!Object.keys(valueCleansed).length && {
    [name]: valueCleansed
  };
}

// The function returns new filter value with EMPTY_FIELD_VALUE leaf nodes deleted,
// or undefined when all filter values get cleansed.
export const cleanFilter = ({ searchableFields, filter }) => Object.keys(filter).reduce(
  (rez, name) => {
    const valueCleansed = cleanValue({
      searchableFields,
      name,
      value: filter[name]
    });

    return valueCleansed ? {
      ...(rez || {}),
      ...valueCleansed
    } :
      rez;
  },
  undefined
);
