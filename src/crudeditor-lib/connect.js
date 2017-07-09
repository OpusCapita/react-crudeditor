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
   *     1. storeState which has "entityConfiguration" property in addition to its native properties,
   *     2. [optional] ownProps of a connecting React component.
   */

  /* Make the custom "connect" accept a function as 1st arg, just like original "connect":
  mapStoreStateToProps && (storeState => mapStoreStateToProps({
    ...storeState,
    entityConfiguration: getEntityConfiguration(storeState.common.entityConfigurationIndex)
  })),
  */
  mapStoreStateToProps && ((storeState, componentOwnProps) => {
    const entityConfiguration = getEntityConfiguration(getEntityConfigurationIndex(storeState));

    return Object.keys(mapStoreStateToProps).reduce(
      (rez, prop) => ({
        ...rez,
        [prop]: mapStoreStateToProps[prop]({
          ...storeState,
          entityConfiguration
        }, componentOwnProps)
      }),
      {}
    );
  }),

  ...args
);
