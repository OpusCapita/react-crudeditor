import { EMPTY_FIELD_VALUE } from '../constants';
import uiTypes from '../uiTypes';

const convert = ({ value, EMPTY_UI_VALUE, direction, converter, edge, i18n }) => {
  const [emptySource, emptyDestination] = direction === 'format' ?
    [EMPTY_FIELD_VALUE, EMPTY_UI_VALUE] :
    [EMPTY_UI_VALUE, EMPTY_FIELD_VALUE];

  return value.hasOwnProperty(edge) && value[edge] !== emptySource ?
    converter[direction]({ value: value[edge], i18n }) :
    emptyDestination;
};

const getRange = ({ value, EMPTY_UI_VALUE, direction, converter, i18n }) => ['from', 'to'].reduce(
  (rez, edge) => ({
    ...rez,
    [edge]: convert({ value, EMPTY_UI_VALUE, direction, converter, edge, i18n })
  }),
  {}
);

const getConverter = ({ EMPTY_UI_VALUE, converter }) => ['format', 'parse'].reduce(
  (rez, direction) => ({
    ...rez,
    [direction]: ({ value, i18n }) => getRange({
      value,
      EMPTY_UI_VALUE,
      direction,
      converter,
      i18n
    })
  }),
  {}
);

export const throwError = error => { throw error; };

export const
  buildRangeFieldType = (baseFieldType, baseUiTypes) => ({

    isValid(value) {
      if (value === EMPTY_FIELD_VALUE) {
        return true;
      }

      if (typeof value !== 'object' || !value) {
        return false;
      }

      if (Object.keys(value).length === 0) {
        return true;
      }

      if (Object.keys(value).length === 1) {
        if (!value.hasOwnProperty('from') && !value.hasOwnProperty('to')) {
          return false;
        }

        return baseFieldType.isValid(
          value.hasOwnProperty('from') && value.from ||
          value.hasOwnProperty('to') && value.to
        );
      }

      if (Object.keys(value).length === 2) {
        if (!value.hasOwnProperty('from') || !value.hasOwnProperty('to')) {
          return false;
        }

        return baseFieldType.isValid(value.from) && baseFieldType.isValid(value.to);
      }

      return false;
    },

    converter: Object.keys(baseUiTypes).reduce(
      (rez, rangeUiType) => {
        const baseUiType = baseUiTypes[rangeUiType];

        return {
          ...rez,
          [rangeUiType]: getConverter({
            EMPTY_UI_VALUE: uiTypes[baseUiType].EMPTY_VALUE,
            converter: baseFieldType.converter[baseUiType]
          })
        };
      },
      {}
    ),

    buildValidator: value => ({})
  });
