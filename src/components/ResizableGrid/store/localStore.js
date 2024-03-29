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
    const persistedValue = JSON.parse(value);
    if (persistedValue instanceof Object && persistedValue.version >= defaultValue.version) {
      return persistedValue.state;
    }
  }
  return defaultValue.state;
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
  const eventListeners = []
  return {
    getValue: () => getValue(storeIdProvider, defaultValue),
    setValue: (value) => {
      const oldValue = window.localStorage.getItem(storeIdProvider());
      const newValueObject = { version: oldValue instanceof Object && oldValue.version || 1, state: value };
      setValue(storeIdProvider, newValueObject);

      for (let i = 0; i < eventListeners.length; i++) {
        eventListeners[i].onEvent({ type: 'change', oldValue, newValue: value });
      }
    },
    reset() {
      const oldValue = getValue(storeIdProvider, -1)
      window.localStorage.removeItem(storeIdProvider())
      if (oldValue !== -1) {
        for (let i = 0; i < eventListeners.length; i++) {
          eventListeners[i].onEvent({ type: 'reset', oldValue });
        }
      }
    },
    addEventListener(listener) {
      eventListeners.push(listener)
    },
    removeEventListener(listener) {
      const index = eventListeners.indexOf(listener);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    }
  }
}
