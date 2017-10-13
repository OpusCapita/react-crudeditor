import devServerApi from './devserver';
import inlineDataApi from './inlinedata';

let api;

// handled by webpack

/* eslint-disable */
if (__WEBPACK__APISERVICE === 'devServer') {
  api = devServerApi
} else if (__WEBPACK__APISERVICE === 'inlineData') {
  api = inlineDataApi
}
/* eslint-enable */

export default api;
