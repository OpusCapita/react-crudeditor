/*
 * A selector decorator allowing the wrapped selector to access particular subtree of Redux store
 * => selectors are namespaced just like reducers.
 */
const buildSelectorWrapper = (...path) => selector => (storeState, ...args) => selector(
  path.reduce(
    (subtree, node) => subtree[node],
    storeState
  ),
  ...args
);

export const

  buildViewSelectorWrapper = viewName => buildSelectorWrapper('views', viewName),

  buildCommonSelectorWrapper = _ => buildSelectorWrapper('common');
