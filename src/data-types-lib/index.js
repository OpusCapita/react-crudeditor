import Big from 'big.js';

const NATURAL = 'natural';
const WHOLE = 'whole';
const INTEGER = 'integer';
const NUMBER = 'number';

export default ({ value, type, constraints }) => {
  if ([NATURAL, WHOLE, INTEGER].includes(type)) {
    // value may contain only 0-9 and '.' as a delimiter.
    let v;

    try {
      v = new Big(value);
    } catch(e) {
      return {
        errors: [{
          id: INVALID_NUMBER,
          description: 'Invalid number'
        }]
      }
    }

    if ([NATURAL, WHOLE, INTEGER].includes(type)) {
      if (!v.eq(v.round())) {
        return {
          errors: [{
            id: FORBIDDEN_FRACTIONAL_PART,
            description: 'Fractional part is forbidden'
          }]
        };
      }

      if (type === NATURAL && v.lte(0)) {
        return {
          errors: [{
            id: FORBIDDEN_FRACTIONAL_PART,
            description: 'Fractional part is forbidden'
          }]
        };
      }

      if (type === WHOLE && v.lt(0)) {
        return {
          errors: [{
            id: FORBIDDEN_FRACTIONAL_PART,
            description: 'Fractional part is forbidden'
          }]
        };
      }
    }
  }

  return {};
}
