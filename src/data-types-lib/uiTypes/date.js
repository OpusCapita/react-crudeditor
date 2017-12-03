const EMPTY_VALUE = null;

export default {
  get EMPTY_VALUE() {
    return EMPTY_VALUE;
  },

  isValid(value) {
    return value === EMPTY_VALUE || value instanceof Date && !isNaN(value.getTime());
  }
};
