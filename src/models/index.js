import authors from './authors';
import contracts from './contracts';

export default name => ({
  authors,
  contracts
})[name];
