import { connect, createProvider } from 'react-redux'

const STORE_KEY = 'react-crudeditor'

export const Provider = createProvider(STORE_KEY)

function connectExtended(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  options = {}
) {
  options.storeKey = STORE_KEY // eslint-disable-line no-param-reassign
  return connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    options
  )
}

export { connectExtended as connect }
