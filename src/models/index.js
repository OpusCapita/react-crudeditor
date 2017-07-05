import authors from './authors';
import contracts from './contracts';

const modelBuilders = {
  authors,
  contracts
};

export default name => modelBuilders[name];
