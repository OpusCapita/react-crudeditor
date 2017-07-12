import { connect } from 'react-redux';
import { selectors as commonSelectors } from './common';
import { getEntityConfiguration } from './entityConfiguration';

const { getEntityConfigurationIndex } = commonSelectors;

export default (mapStoreStateToProps, ...args) => connect(
  /*
   * The function forwards its args to original "connect" after modifying [optional] 1st argument which is
   * an object with
   *   keys - names of props to be added to a connecting React component,
   *   values - selectors. A selector is a function with two arguments:
   *     1. storeState,
   *     2. entityConfiguration.
   */

  /* Make the custom "connect" accept a function as 1st arg, just like original "connect":
  mapStoreStateToProps && (storeState => mapStoreStateToProps({
    ...storeState,
    entityConfiguration: getEntityConfiguration(storeState.common.entityConfigurationIndex)
  })),
  */
  mapStoreStateToProps && (storeState => {
    const entityConfiguration = getEntityConfiguration(getEntityConfigurationIndex(storeState));

    return Object.keys(mapStoreStateToProps).reduce(
      (rez, prop) => ({
        ...rez,
        [prop]: mapStoreStateToProps[prop](storeState, entityConfiguration)
      }),
      {}
    );
  }),

  ...args
);
