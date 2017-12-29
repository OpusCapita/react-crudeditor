const EMPTY_VALUE = '';

export default {
  get EMPTY_VALUE() {
    return EMPTY_VALUE;
  },

  isValid(value) {
    return typeof value === 'string';
  }
};
