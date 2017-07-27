import { connect } from 'react-redux';
import { getEntityConfigurationIndex } from './common/selectors';
import { getEntityConfiguration } from './entityConfiguration';

export default (mapStoreStateToProps, ...args) => connect(
  /*
   * The function forwards its args to original "connect" after modifying [optional] 1st argument which is
   * an object with
   *   keys - names of props to be added to a connecting React component,
   *   values - selectors. A selector is a function with two arguments:
   *     1. storeState,
   *     2. entityConfiguration.
   */

  mapStoreStateToProps && (storeState => {
    const entityConfiguration = getEntityConfiguration(getEntityConfigurationIndex(storeState));

    return Object.entries(mapStoreStateToProps).reduce(
      (rez, [prop, selector]) => ({
        ...rez,
        [prop]: selector(storeState, entityConfiguration)
      }),
      {}
    );
  }),

  ...args
);
