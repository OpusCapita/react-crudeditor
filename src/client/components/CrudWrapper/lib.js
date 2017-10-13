import {
  stringify as urlQueryStringify,
  parse as urlQueryParse
} from 'query-string';

function trimLeadingZeros(str) {
  return str.replace(/^0+(.|$)/, (_, p) => !p && '0' || p === '.' && '0.' || p);
}

export

// ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒

let buildURL = ({ base, query, hash }) => {
    // base  - string,
    // query - object or false - evaluated value (null, undefined, empty string, etc.).
    // hash  - object or false - evaluated value (null, undefined, empty string, etc.).
    let url = base;

    if (query) {
      if (typeof query !== 'object') {
        throw new Error(`query ${query} must be object`);
      }

      if (Object.keys(query).length) {
        url += '?' + urlQueryStringify(query);
      }
    }

    if (hash) {
      if (typeof hash !== 'object') {
        throw new Error(`query ${hash} must be object`);
      }

      if (Object.keys(hash).length) {
        url += '#' + encodeURIComponent(JSON.stringify(hash));
      }
    }

    console.log('buildURL for hash', hash, 'new URL', url);
    return url;
  },

  // ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒

  hash2obj = hash => {
    // Input string, output object.
    return hash ?
      JSON.parse(decodeURIComponent(hash.slice(1))) :
      {};
  },

  // ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒

  query2obj = query => {
    // Input string, output object.
    return { ...urlQueryParse(query) };
  },

  // ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒

  suffix2arr = suffix => {
    // Input string, ouput array.
    let suffixArr = suffix.replace(/^\/|\/$/g, '');
    return suffixArr ? suffixArr.split('/') : [];
  },

  // ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒

  toNaturalNumber = arg => {
    // The function returns natural number if input argument is natural number or natural number string,
    // undefined otherwise.
    let n, str;

    if (typeof arg === 'string') {
      str = trimLeadingZeros(arg);
      n = Math.floor(Number(str));
    } else if (typeof arg === 'number') {
      str = String(arg);
      n = Math.floor(arg);
    } else {
      return undefined;
    }

    return String(n) === str && n > 0 ?
      n :
      undefined;
  },

  // ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒

  toWholeNumber = arg => {
    // The function returns whole number if input argument is whole number or whole number string,
    // undefined otherwise.
    let n, str;

    if (typeof arg === 'string') {
      str = trimLeadingZeros(arg);
      n = Math.floor(Number(str));
    } else if (typeof arg === 'number') {
      str = String(arg);
      n = Math.floor(arg);
    } else {
      return undefined;
    }

    return String(n) === str && n >= 0 ?
      n :
      undefined;
  },

  // ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒

  toInteger = arg => {
    // The function returns integer if input argument is integer or integer string,
    // undefined otherwise.
    let n, str;

    if (typeof arg === 'string') {
      str = trimLeadingZeros(arg);
      n = Math.floor(Number(str));
    } else if (typeof arg === 'number') {
      str = String(arg);
      n = Math.floor(arg);
    } else {
      return undefined;
    }

    return String(n) === str ?
      n :
      undefined;
  };
