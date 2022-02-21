/**
 * Get value from locale storage
 *
 * @param storeIdProvider - function that return unique identifier for stored value
 * @param defaultValue - default value
 * @returns stored value
 */
function getValue(storeIdProvider, defaultValue) {
  let value = window.localStorage.getItem(storeIdProvider());
  if (value) {
    return JSON.parse(value);
  }
  return defaultValue;
}

/**
 * Set value to the local storage
 *
 * @param storeIdProvider - function that return unique identifier for stored value
 * @param value - stored value
 */
function setValue(storeIdProvider, value) {
  window.localStorage.setItem(storeIdProvider(), JSON.stringify(value));
}

export default function(storeIdProvider, defaultValue) {
  return {
    getValue: () => getValue(storeIdProvider, defaultValue),
    setValue: (value) => setValue(storeIdProvider, value),
    reset() {
      window.localStorage.removeItem(storeIdProvider())
    }
  }
}
