const EMPTY_VALUE = null;

export default {
  get EMPTY_VALUE() {
    return EMPTY_VALUE;
  },

  isEmpty: value => value === EMPTY_VALUE,

  isValid(value) {
    return this.isEmpty(value) || value instanceof Date && !isNaN(value.getTime());
  }
};
