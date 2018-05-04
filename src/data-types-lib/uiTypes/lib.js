import { isEqual } from 'lodash-es';

export const buildRangeUiType = /* istanbul ignore next */ baseUiType => ({
  get EMPTY_VALUE() {
    // return baseUiType.EMPTY_VALUE;
    return {
      from: baseUiType.EMPTY_VALUE,
      to: baseUiType.EMPTY_VALUE
    }
  },

  isValid(value) {
    if (isEqual(value, baseUiType.EMPTY_VALUE)) {
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

      return baseUiType.isValid(value.hasOwnProperty('from') && value.from || value.hasOwnProperty('to') && value.to);
    }

    if (Object.keys(value).length === 2) {
      if (!value.hasOwnProperty('from') || !value.hasOwnProperty('to')) {
        return false;
      }

      return baseUiType.isValid(value.from) && baseUiType.isValid(value.to);
    }

    return false;
  }
});
