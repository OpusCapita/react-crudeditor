export default {
  isEmpty: value => false, // No native empty value.

  isValid: value => typeof value === 'boolean'
};
